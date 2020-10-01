const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const beneficiaryLodgingSchema = new Schema({
	beneficiary_id: Schema.Types.ObjectId,
	lodging_id: Schema.Types.ObjectId,
	dateEntry: Date,
	dateExit: Date,
	exitMotif: String,

	cohabitationContract: {
		isSigned: Boolean,
		isToRenew: Boolean,
	},

	comments: String,
});

const BeneficiaryLodging = mongoose.model(
	'BeneficiaryLodging',
	beneficiaryLodgingSchema
);

module.exports = BeneficiaryLodging;
