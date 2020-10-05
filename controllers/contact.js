const express = require('express');
const router = express.Router();

const { Contact, Address } = require('../models');

const saveContact = (addressId, otherData, res) => {
	const contact = new Contact({
		address: addressId,
		...otherData,
	});
	console.log(contact);

	contact.save((err, contact) => {
		if (err !== null) {
			console.log(err);
			return res.json({
				success: false,
				message: err.toString(),
			});
		}

		res.json({
			success: true,
			data: contact,
		});
	});
};

const createContact = (req, res) => {
	console.log('POST /contacts');

	const allBody = { ...req.body };
	//To select allBody except the addres fields: { whatToOmit, ...newObject } = oldObject
	const {
		streetNumber,
		streetName,
		zipCode,
		city,
		...allButAddress
	} = req.body;

	//Find an address, create new one if it doesn't exists
	Address.findOne(
		{ streetNumber, streetName, zipCode, city },
		(err, address) => {
			if (err !== null) {
				res.json({
					success: false,
					message: err.toString(),
				});
				return;
			}

			if (address === null) {
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

					saveContact(address._id, allButAddress, res);
				});
				return;
			}

			saveContact(address._id, allButAddress, res);
		}
	);
};

const deleteContact = (req, res) => {
	console.log('DELETE /contacts/:id');
	const contactId = req.params.id;

	Contact.deleteOne({ _id: contactId }, (err, deletedContact) => {
		console.log('deleted', deletedContact);
		if (err !== null) {
			res.json({
				success: false,
				message: err.toString(),
			});
			return;
		}

		if (deletedContact.deletedCount === 0) {
			res.json({
				success: false,
				message: `No contact with id ${contactId} was found`,
			});
			return;
		}

		res.json({
			success: true,
			data: {
				isDeleted: true,
			},
			message: 'Contact has been successfully deleted',
		});
	});
};

const readContact = (req, res) => {
	console.log('GET /contacts/:id');
	const contactId = req.params.id;

	Contact.findById(contactId)
		.populate('address')
		.exec((err, contact) => {
			if (err !== null) {
				res.json({
					success: false,
					message: err.toString(),
				});
				return;
			}

			if (contact === null) {
				res.json({
					success: false,
					message: `No contact with id ${contactId} was found`,
				});
				return;
			}

			res.json({
				success: true,
				data: contact,
			});
		});
};

const readContacts = (req, res) => {
	Contact.find({}, (err, contacts) => {
		if (err !== null) {
			res.json({
				success: false,
				message: err.toString(),
			});
			return;
		}
		res.json({
			success: true,
			data: contacts,
		});
	});
};

const updateContact = (req, res) => {
	console.log('PUT /contacts/:id');
	const contactId = req.params.id;
	const modifiedValues = { ...req.body };

	Contact.updateOne(
		{ _id: contactId },
		modifiedValues,
		(err, modifiedContact) => {
			if (err !== null) {
				res.json({
					success: false,
					message: err.toString(),
				});
				return;
			}

			if (modifiedContact.nModified === 0) {
				res.json({
					success: false,
					message: `The contact hasn't been updated. Check if this id exists, or if you entered new values`,
				});
				return;
			}

			res.json({
				success: true,
				data: modifiedContact,
				message: `Contact with id ${contactId} has been successfully updated`,
			});
		}
	);
};

router.route('/').post(createContact).get(readContacts);
router.route('/:id').get(readContact).put(updateContact).delete(deleteContact);

module.exports = router;
