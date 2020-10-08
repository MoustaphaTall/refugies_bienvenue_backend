const express = require('express');
const router = express.Router();

const {
	Beneficiary,
	Volunteer,
	Address,
	Report,
	BeneficiaryLodging,
} = require('../models');

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
		volunteerId,
		...allButAddressVolunteer
	} = allBody;

	// Find the volunteer tied to the beneficiary --- not needed anymore
	//
	// Volunteer.findOne({ mail: volunteerMail }, (err, volunteer) => {
	// 	if (err !== null) {
	// 		res.json({
	// 			success: false,
	// 			message: err.toString(),
	// 		});
	// 		return;
	// 	}

	// 	// console.log(volunteer);
	// 	if (volunteer === null) {
	// 		res.status(404).json({
	// 			success: false,
	// 			message: `No volunteer with the specified mail was found`,
	// 		});
	// 		return;
	// 	}

	// const volunteerId = volunteer._id;

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
	// });
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

const readBeneficiary = (req, res) => {
	console.log('GET /beneficiaires/:id');
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

const readBeneficiaryLodgings = (req, res) => {
	BeneficiaryLodging.find({})
		.then((beneficiaryLodgings) => {
			const data = beneficiaryLodgings.map((beneficiaryLodging) => {
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

		// console.log(beneficiaries);

		const data = beneficiaries.map((beneficiary) => beneficiary);
		//  C'est Ghani qui l'a mis en commentaires, parce que j'ai besoin
		//de toutes les informqtion de beneciaires pour avoir une full fonctionnalité de search bar;
		// {
		// 	return {
		// 		_id: beneficiary._id,
		// 		firstName: beneficiary.firstName,
		// 		lastName: beneficiary.lastName,
		// 		phone: beneficiary.phone,
		// 		mail: beneficiary.mail,
		// 		isHomeless: beneficiary.isHomeless,
		// 		followsCourse: beneficiary.followsCourse,
		// 	};
		// }

		res.json({
			success: true,
			data,
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

		console.log(reports);

		if (Object.keys(reports) === 0) {
			res.json({
				success: false,
				message: `No reports were found`,
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

router.route('/reports').get(readReports);
router.route('/lodgings').get(readBeneficiaryLodgings);
router
	.route('/:id')
	.get(readBeneficiary)
	.delete(deleteBeneficiary)
	.put(updateBeneficiary);
router.route('/').post(createBeneficiary).get(readBeneficiaries);

module.exports = router;
