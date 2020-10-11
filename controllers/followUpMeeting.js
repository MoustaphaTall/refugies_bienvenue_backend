const express = require('express');
var mongoose = require('mongoose');
const router = express.Router();
const Volunteer = require('../models/volunteer');

const { FollowUpMeeting } = require('../models');

const createMeeting = (req, res) => {
	console.log('POST /meetings');
	const {
		volunteerId,
		beneficiaryId,
		contactId,
		lodgingId,
		...allButInterlocutor
	} = req.body;

	const meeting = new FollowUpMeeting({
		volunteer: volunteerId,
		beneficiary: beneficiaryId,
		contact: contactId,
		lodging: lodgingId,
		...allButInterlocutor,
	});

	meeting.save((err, meeting) => {
		if (err !== null) {
			res.json({
				success: false,
				message: err.toString(),
			});
			return;
		}

		res.json({
			success: true,
			data: meeting,
		});
	});
	// });
};

const deleteMeeting = (req, res) => {
	console.log('DELETE /meetings/:id');
	const meetingId = req.params.id;

	Meeting.deleteOne({ _id: beneficiaryId }, (err, deletedMeeting) => {
		console.log('deleted', deletedMeeting);

		if (err !== null) {
			res.json({
				success: false,
				message: err.toString(),
			});
			return;
		}

		if (deletedMeeting.deletedCount === 0) {
			res.json({
				success: false,
				message: `No meeting with the id ${meetingId} was found`,
			});
			return;
		}

		res.json({
			success: true,
			data: {
				isDeleted: true,
			},
			message: 'Meeting was successfully deleted',
		});
	});
};

const readMeeting = (req, res) => {
	console.log('GET /meeting/:id');
	const meetingId = req.params.id;

	FollowUpMeeting.findById(meetingId)
		.populate('volunteer')
		.populate('beneficiary')
		.populate('contact')
		.populate('lodging')
		.exec((err, meeting) => {
			if (err !== null) {
				res.json({
					success: false,
					message: err.toString(),
				});
				return;
			}

			if (meeting === null) {
				res.json({
					success: false,
					message: `No beneficiary with the id ${meetingId} was found`,
				});
				return;
			}

			res.json({
				success: true,
				data: meeting,
			});
		});
};

const readMeetings = (req, res) => {
	console.log('GET /meetings');

	FollowUpMeeting.find({})
		.then((meetings) => {
			const data = meetings.map((meeting) => meeting);
			// return {
			// 	_id: meeting._id,
			// 	date: meeting.date,
			// 	summary: meeting.summary,
			// };

			res.json({
				success: true,
				data,
			});
		})
		.catch((err) => {
			res.json({
				success: false,
				message: err.toString(),
			});
		});
};

const updateMeeting = (req, res) => {
	console.log('PUT /meetings/:id');
	const meetingId = req.params.id;
	const modifiedValues = { ...req.body };

	FollowUpMeeting.updateOne(
		{ _id: meetingId },
		modifiedValues,
		(err, modifiedMeeting) => {
			if (err !== null) {
				res.json({
					success: false,
					message: err.toString(),
				});
				return;
			}

			if (modifiedMeeting.nModified === 0) {
				res.json({
					success: false,
					message: `The meeting hasn't been updated. Check if this id exists, or if you entered new values`,
				});
				return;
			}

			res.json({
				success: true,
				data: modifiedMeeting,
				message: `Meeting with id ${meetingId} has been successfully updated`,
			});
		}
	);
};

router.route('/').post(createMeeting).get(readMeetings);
router.route('/:id').get(readMeeting).delete(deleteMeeting).put(updateMeeting);

module.exports = router;
