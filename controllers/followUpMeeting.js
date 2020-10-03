const express = require('express');
const router = express.Router();

const { FollowUpMeeting } = require('../models');

router.post('/', (req, res) => {
	const {
		beneficiary,
		lodging,
		contact,
		interlocutor,
		platform,
		date,
		attachments,
		isCompleted,
		summary,
		jobSearchingStatus,
		trainingStatus,
		actionItems,
	} = req.body;

	const followUpMeeting = new FollowUpMeeting({
		beneficiary,
		lodging,
		contact,
		interlocutor,
		platform,
		date,
		attachments,
		isCompleted,
		summary,
		jobSearchingStatus,
		trainingStatus,
		actionItems,
	});

	followUpMeeting.save((err, followUpMeetingDb) => {
		if (err !== null) {
			res.json({
				success: false,
				message: err.toString(),
			});
			return;
		}
		res.json({
			success: true,
			data: followUpMeetingDb,
		});
	});
});

router.get('/', (req, res) => {
	followUpMeeting.find;
});

module.exports = router;
