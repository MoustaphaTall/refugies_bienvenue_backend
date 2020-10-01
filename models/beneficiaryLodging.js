const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const beneficiaryLodgingSchema = new Schema({
	beneficiary_id: { type: Schema.Types.ObjectId, ref: 'beneficiary' },
	lodging_id: { type: Schema.Types.ObjectId, ref: 'lodging' },
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
