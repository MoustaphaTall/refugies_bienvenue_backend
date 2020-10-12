const express = require('express');
const router = express.Router({ mergeParams: true });

const { Report } = require('../models');

const createReport = (req, res) => {
	console.log('POST /beneficiaries/:id/reports');
	console.log('POST /beneficiaries/:id/report req.params', req.params);

	const beneficiaryId = req.params.id;

	const report = new Report({
		beneficiary: beneficiaryId,
		...req.body,
	});

	report.save((err, report) => {
		if (err !== null) {
			res.json({
				success: false,
				message: err.toString(),
			});
			return;
		}

		res.json({
			success: true,
			data: report,
		});
	});
};

const deleteReport = (req, res) => {
	console.log('DELETE /beneficiaries/:id/reports/:reportId');

	const reportId = req.params.reportId;
	console.log(reportId);

	Report.deleteOne({ _id: reportId }, (err, deletedReport) => {
		console.log('deleted', deletedReport);
		if (err !== null) {
			res.json({
				success: false,
				message: err.toString(),
			});
			return;
		}

		if (deletedReport.deletedCount === 0) {
			res.json({
				success: false,
				message: `No report with the id ${reportId} was found`,
			});
			return;
		}

		res.json({
			success: true,
			data: {
				isDeleted: true,
			},
			message: 'Report has been successfully deleted',
		});
	});
};

const readReport = (req, res) => {
	console.log(req.params);
	console.log('GET /beneficiaries/:id/reports/:reportId');

	const reportId = req.params.reportId;

	Report.findById(reportId)
		.populate('beneficiary')
		.exec((err, report) => {
			if (err !== null) {
				res.json({
					success: false,
					message: err.toString(),
				});
				return;
			}

			if (report === null) {
				res.json({
					success: false,
					message: `No report with the id ${reportId} was found`,
				});
				return;
			}

			res.json({
				success: true,
				data: report,
			});
		});
};

const readBeneficiaryReports = (req, res) => {
	// console.log(req.params);
	console.log('GET /beneficiaries/:id/reports');

	const beneficiaryId = req.params.id;

	Report.find({ beneficiary: beneficiaryId })
		.populate('beneficiary')
		.exec((err, reports) => {
			if (err !== null) {
				res.json({
					success: false,
					message: err.toString(),
				});
				return;
			}

			if (reports.length === 0) {
				res.json({
					success: false,
					message: `No reports with beneficiary id ${beneficiaryId} were found`,
				});
				return;
			}

			res.json({
				success: true,
				data: reports,
			});
		});
};

const updateReport = (req, res) => {
	console.log('PUT /beneficiaries/:id/reports/:reportId');

	const reportId = req.params.reportId;
	const modifiedValues = { ...req.body };

	Report.updateOne(
		{ _id: reportId },
		modifiedValues,
		(err, modifiedReport) => {
			if (err !== null) {
				res.json({
					success: false,
					message: err.toString(),
				});
				return;
			}

			if (modifiedReport.nModified === 0) {
				res.json({
					success: false,
					message: `The report hasn't been updated. Check if this id exists or if you entered new values`,
				});
				return;
			}

			res.json({
				success: true,
				data: modifiedReport,
				message: `Report with id ${reportId} has been successfully updated`,
			});
		}
	);
};
router.route('/').post(createReport).get(readBeneficiaryReports);
router
	.route('/:reportId')
	.get(readReport)
	.put(updateReport)
	.delete(deleteReport);

module.exports = router;
