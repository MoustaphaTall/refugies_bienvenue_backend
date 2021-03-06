const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const beneficiaryLodgingSchema = new Schema({
	beneficiary: { type: Schema.Types.ObjectId, ref: 'Beneficiary' },
	lodging: { type: Schema.Types.ObjectId, ref: 'Lodging' },
	dateEntry: Date,
	dateExit: Date,
	exitMotif: String,
	isContractSigned: Boolean,
	isContractToRenew: Boolean,
	comments: String,
});

const BeneficiaryLodging = mongoose.model(
	'BeneficiaryLodging',
	beneficiaryLodgingSchema
);

module.exports = BeneficiaryLodging;
