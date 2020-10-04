const express = require('express');
const router = express.Router();

const { Beneficiary, Volunteer, Address, Report } = require('../models');

const saveBeneficiary = (addressId, volunteerId, otherData, res) => {
	const beneficiary = new Beneficiary({
		address: addressId,
		volunteer: volunteerId,
		...otherData,
	});

	beneficiary.save((err, beneficiary) => {
		if (err !== null) {
			res.json({
				success: false,
				message: err.toString(),
			});
			return;
		}

		res.json({
			success: true,
			data: beneficiary,
		});
	});
};

const createBeneficiary = (req, res) => {
	console.log('POST /beneficiary');

	const allBody = { ...req.body };
	//To select allBody, except the address fields : { whatToOmit, ...newObject } = oldObject
	const {
		streetNumber,
		streetName,
		zipCode,
		city,
		volunteerMail,
		...allButAddressVolunteer
	} = allBody;

	// Find the volunteer tied to the beneficiary
	Volunteer.find({ mail: volunteerMail }, (err, volunteer) => {
		if (err !== null) {
			res.json({
				success: false,
				message: err.toString(),
			});
			return;
		}

		const volunteerId = volunteer[0]._id;

		//Find an address, create new one if it doesn't exists
		Address.find(
			{ streetNumber, streetName, zipCode, city },
			(err, address) => {
				if (err !== null) {
					res.json({
						success: false,
						message: err.toString(),
					});
					return;
				}

				if (Object.keys(address).length === 0) {
					const address = new Address({
						...req.body,
					});

					address.save((err, address) => {
						if (err !== null) {
							res.json({
								success: false,
								message: err.toString(),
							});
							return;
						}

						saveBeneficiary(
							address._id,
							volunteerId,
							allButAddressVolunteer,
							res
						);
					});
					return;
				}

				// console.log(address[0]);
				saveBeneficiary(
					address[0]._id,
					volunteerId,
					allButAddressVolunteer,
					res
				);
			}
		);
	});
};

const deleteBeneficiary = (req, res) => {
	console.log('DELETE /beneficiaires/:id');
	const beneficiaryId = req.params.id;

	Beneficiary.deleteOne({ _id: beneficiaryId }, (err, deletedBeneficiary) => {
		console.log('deleted', deletedBeneficiary);
		if (err !== null) {
			res.json({
				success: false,
				message: err.toString(),
			});
			return;
		}

		if (deletedBeneficiary.deletedCount === 0) {
			res.json({
				success: false,
				message: `No beneficiary with the id ${beneficiaryId} was found`,
			});
		}

		res.json({
			success: true,
			data: {
				isDeleted: true,
			},
			message: 'Beneficiary has been successfully deleted',
		});
	});
};

const readReports = (req, res) => {
	console.log('GET /beneficiaries/reports');

	Report.find({}, (err, reports) => {
		if (err !== null) {
			res.json({
				success: false,
				message: err.toString(),
			});
			return;
		}

		const data = reports.map((report) => {
			return {
				_id: report._id,
				date: report.date,
			};
		});

		res.json({
			success: true,
			data,
		});
	});
};

const readBeneficiary = (req, res) => {
	console.log('GET /beneficiaires/:id');
	console.log(req.user);
	const beneficiaryId = req.params.id;

	Beneficiary.findById(beneficiaryId)
		.populate('address')
		.populate('volunteer')
		.exec((err, beneficiary) => {
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
					message: `No beneficiary with the id ${beneficiaryId} was found`,
				});
				return;
			}

			res.json({
				success: true,
				data: beneficiary,
			});
		});
};

const readBeneficiaries = (req, res) => {
	console.log('GET /beneficiaries');

	Beneficiary.find({}, (err, beneficiaries) => {
		if (err !== null) {
			res.json({
				success: false,
				message: err.toString(),
			});
			return;
		}

		const data = beneficiaries.map((beneficiary) => {
			return {
				_id: beneficiary._id,
				firstName: beneficiary.firstName,
				lastName: beneficiary.lastName,
				phone: beneficiary.phone,
				mail: beneficiary.mail,
			};
		});

		res.json({
			success: true,
			data,
		});
	});
};

const updateBeneficiary = (req, res) => {
	console.log('PUT /beneficiaries/:id');
	const beneficiaryId = req.params.id;
	const modifiedValues = { ...req.body };

	Beneficiary.updateOne(
		{ _id: beneficiaryId },
		modifiedValues,
		(err, modifiedBeneficiary) => {
			if (err !== null) {
				res.json({
					success: false,
					message: err.toString(),
				});
				return;
			}

			if (modifiedBeneficiary.nModified === 0) {
				res.json({
					success: false,
					message: `The beneficiary hasn't been updated. Check if this id exists, of if you entered new values`,
				});
				return;
			}

			res.json({
				success: true,
				data: modifiedBeneficiary,
				message: `Beneficiary with id ${beneficiaryId} has been successfully updated`,
			});
		}
	);
};

router.route('/').post(createBeneficiary).get(readBeneficiaries);

router
	.route('/:id')
	.get(readBeneficiary)
	.delete(deleteBeneficiary)
	.put(updateBeneficiary);

router.route('/reports').get(readReports);

module.exports = router;
