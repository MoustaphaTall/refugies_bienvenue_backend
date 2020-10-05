const express = require('express');
const router = express.Router();

const { BeneficiaryLodging, Beneficiary, Lodging } = require('../models');

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

const createBeneficiaryLodging = (req, res) => {
	const {
		beneficiaryMail,
		lodgingMail,
		dateEntry,
		dateExit,
		exitMotif,
		isContractSigned,
		isContractToRenew,
		comments,
	} = req.body;

	Beneficiary.findOne({ mail: beneficiaryMail }, async (err, beneficiary) => {
		if (err !== null) {
			res.json({
				success: false,
				message: err.toString(),
			});
			return;
		}

		if (beneficiary === null) {
			res.json({
				success: false,
				message: `No beneficiary with mail ${beneficiaryMail} was found`,
			});
			return;
		}

		const beneficiaryLodging = new BeneficiaryLodging({
			dateEntry,
			dateExit,
			exitMotif,
			isContractSigned,
			isContractToRenew,
			comments,
			lodging: lodging_id,
			beneficiary: beneficiary_id,
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
				data: meeting,
			});
		});
	});
};

const deleteBeneficiaryLodging = (req, res) => {
	const beneficiaryLodging = req.params.id;

	BeneficiaryLodging.deleteOne(
		{ _id: beneficiaryId },
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
					message: `No mbeneficiaryLodging with the id ${beneficiaryLodgingId} was found`,
				});
				return;
			}

			res.json({
				success: true,
				data: {
					isDeleted: true,
				},
				message: 'beneficiaryLodging was successfully deleted',
			});
		}
	);
};

const readBeneficiaryLodging = (req, res) => {
	const beneficiaryLodgingId = req.params.id;

	BeneficiaryLodging.findById(beneficiaryLodgingId)
		.populate('beneficiary')
		.exec((err, beneficiaryLodging) => {
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
					message: `No beneficiary with the id ${beneficiaryLodgingId} was found`,
				});
				return;
			}

			res.json({
				success: true,
				data: meeting,
			});
		});
};

const readBeneficiaryLodging = (req, res) => {
	BeneficiaryLodging.find({})
		.then((beneficiaryLodgings) => {
			const data = beneficiaryLodging.map((beneficiaryLodging) => {
				return {
					_id: beneficiaryLodging._id,
					beneficiary: beneficiaryLodging.beneficiary,
					lodging: beneficiaryLodging.lodging,
					dateEntry: beneficiaryLodging.dateEntry,
					dateExit: beneficiaryLodging.dateExit,
					exitMotif: beneficiaryLodging.exitMotif,
					isContractSigned: beneficiaryLodging.isContractSigned,
					isContractToRenew: beneficiaryLodging.isContractToRenew,
					comments: beneficiaryLodging.comments,
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

const updateBeneficiaryLodging = (req, res) => {
	const beneficiaryLodgingId = req.params.id;
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

			if (modifiedBeneficiaryLodging.Modified === 0) {
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

router.route('/').post(createBeneficiaryLodging).get(readBeneficiaryLodgings);
router
	.route('/:id')
	.get(readBeneficiaryLodging)
	.delete(deleteBeneficiaryLodging)
	.put(updateBeneficiaryLodging);

module.exports = router;
