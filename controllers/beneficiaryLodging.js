const express = require('express');
const router = express.Router({ mergeParams: true });

const { BeneficiaryLodging, Beneficiary, Lodging } = require('../models');

/*
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
*/

const createBeneficiaryLodging = (req, res) => {
	const beneficiaryId = req.params.id;
	const {
		lodgingId,
		dateEntry,
		dateExit,
		exitMotif,
		isContractSigned,
		isContractToRenew,
		comments,
	} = req.body;

	// Beneficiary.findOne({ mail: beneficiaryMail }, async (err, beneficiary) => {
	// 	if (err !== null) {
	// 		res.json({
	// 			success: false,
	// 			message: err.toString(),
	// 		});
	// 		return;
	// 	}

	// 	if (beneficiary === null) {
	// 		res.json({
	// 			success: false,
	// 			message: `No beneficiary with mail ${beneficiaryMail} was found`,
	// 		});
	// 		return;
	// 	}

	const beneficiaryLodging = new BeneficiaryLodging({
		lodging: lodgingId,
		beneficiary: beneficiaryId,
		dateEntry,
		dateExit,
		exitMotif,
		isContractSigned,
		isContractToRenew,
		comments,
	});

	beneficiaryLodging.save((err, beneficiaryLodging) => {
		if (err !== null) {
			res.json({
				success: false,
				message: err.toString(),
			});
			return;
		}

		res.json({
			success: true,
			data: beneficiaryLodging,
		});
	});
	// });
};

const deleteBeneficiaryLodging = (req, res) => {
	const beneficiaryLodgingId = req.params.lodgingId;

	BeneficiaryLodging.deleteOne(
		{ _id: beneficiaryLodgingId },
		(err, deletedBeneficiaryLodging) => {
			if (err !== null) {
				res.json({
					success: false,
					message: err.toString(),
				});
				return;
			}

			if (deletedBeneficiaryLodging.deletedCount === 0) {
				res.json({
					success: false,
					message: `No beneficiaryLodging with the id ${beneficiaryLodgingId} was found`,
				});
				return;
			}

			res.json({
				success: true,
				data: {
					isDeleted: true,
				},
				message: 'BeneficiaryLodging was successfully deleted',
			});
		}
	);
};

const readBeneficiaryLodging = (req, res) => {
	const beneficiaryLodgingId = req.params.lodgingId;

	BeneficiaryLodging.findById(beneficiaryLodgingId)
		.populate('beneficiary')
		.populate('lodging')
		.exec((err, beneficiaryLodging) => {
			if (err !== null) {
				res.json({
					success: false,
					message: err.toString(),
				});
				return;
			}

			if (beneficiaryLodging === null) {
				res.json({
					success: false,
					message: `No beneficiary with the id ${beneficiaryLodgingId} was found`,
				});
				return;
			}

			res.json({
				success: true,
				data: beneficiaryLodging,
			});
		});
};

const updateBeneficiaryLodging = (req, res) => {
	const beneficiaryLodgingId = req.params.lodgingId;
	const modifiedValues = { ...req.body };

	BeneficiaryLodging.updateOne(
		{ _id: beneficiaryLodgingId },
		modifiedValues,
		(err, modifiedBeneficiaryLodging) => {
			if (err !== null) {
				res.json({
					success: false,
					message: err.toString(),
				});
				return;
			}

			if (modifiedBeneficiaryLodging.nModified === 0) {
				res.json({
					success: false,
					message: `The beneficiaryLodging hasn't been updated. Check if this id exists, or if you entered new values`,
				});
				return;
			}

			res.json({
				success: true,
				data: modifiedBeneficiaryLodging,
				message: `BeneficiaryLodging with id ${beneficiaryLodgingId} has been successfully updated`,
			});
		}
	);
};

router
	.route('/:lodgingId')
	.get(readBeneficiaryLodging)
	.delete(deleteBeneficiaryLodging)
	.put(updateBeneficiaryLodging);
router.route('/').post(createBeneficiaryLodging);

module.exports = router;
