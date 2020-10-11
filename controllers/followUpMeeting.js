const express = require('express');
const router = express.Router();

const {
	FollowUpMeeting,
	Beneficiary,
	Volunteer,
	Contact,
	Lodging,
} = require('../models');

const getBeneficiaryId = (mail, res) => {
	return Beneficiary.findOne({ mail })
		.then((beneficiary) => {
			if (beneficiary === null) {
				res.json({
					success: false,
					message: `No beneficiary with mail ${mail} was found`,
				});
				return;
			}
			return beneficiary._id;
		})
		.catch((err) => {
			res.json({
				success: false,
				message: err,
			});
			return;
		});
};

const getContactId = (mail, res) => {
	return Contact.findOne({ mail })
		.then((contact) => {
			if (contact === null) {
				res.json({
					success: false,
					message: `No contact with mail ${mail} was found`,
				});
				return;
			}
			return contact._id;
		})
		.catch((err) => {
			res.json({
				success: false,
				message: err,
			});
			return;
		});
};

const getLodgingId = (mail, res) => {
	return Lodging.findOne({ mail })
		.then((lodging) => {
			if (lodging === null) {
				res.json({
					success: false,
					message: `No lodging with mail ${mail} was found`,
				});
				return;
			}
			return lodging._id;
		})
		.catch((err) => {
			res.json({
				success: false,
				message: err,
			});
			return;
		});
};

const createMeeting = (req, res) => {
	console.log('POST /meetings');
	const {
		volunteerId,
		beneficiaryId,
		contactId,
		lodgingId,
		...allButInterlocutor
	} = req.body;

	// // Find the volunteer to which the meeting is attached
	// Volunteer.findOne({ mail: volunteerMail }, async (err, volunteer) => {
	// 	if (err !== null) {
	// 		res.json({
	// 			success: false,
	// 			message: err.toString(),
	// 		});
	// 		return;
	// 	}

	// 	if (volunteer === null) {
	// 		res.json({
	// 			success: false,
	// 			message: `No volunteer with mail ${volunteerMail} was found`,
	// 		});
	// 		return;
	// 	}

	// 	const volunteerId = volunteer._id;
	// 	//We need to get the interlocutor's type (beneficiary etc) and interlocutor's id to populate afterwards
	// 	let interlocutorMap = {
	// 		interlocutor: null,
	// 		interlocutorId: null,
	// 	};
	// 	let { interlocutor, interlocutorId } = interlocutorMap;

	// 	//We use the interlocutor's mail, which is unique, to find them and get their id
	// 	if (beneficiaryMail !== undefined) {
	// 		interlocutorId = await getBeneficiaryId(beneficiaryMail, res);
	// 		interlocutor = 'beneficiary';
	// 	} else if (contactMail !== undefined) {
	// 		interlocutorId = await getContactId(contactMail, res);
	// 		interlocutor = 'contact';
	// 	} else if (lodgingMail !== undefined) {
	// 		interlocutorId = await getLodgingId(lodgingMail, res);
	// 		interlocutor = 'lodging';
	// 	} else {
	// 		res.json({
	// 			success: false,
	// 			message: `Please choose an existing interlocutor`,
	// 		});
	// 	}

	// console.log('interlocutorId', interlocutorId);

	const meeting = new FollowUpMeeting({
		volunteer: volunteerId,
		beneficiary: beneficiaryId,
		contact: contactId,
		lodging: lodgingId,
		// [interlocutor]: interlocutorId, //unneeded now that we can choose multiple interlocutors
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
			const data = meetings.map((meeting) => {
				return {
					_id: meeting._id,
					date: meeting.date,
					summary: meeting.summary,
				};
			});

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
