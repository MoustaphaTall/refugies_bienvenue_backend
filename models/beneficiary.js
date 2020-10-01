const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const beneficiarySchema = new Schema({
	volunteer_id: Schema.Types.ObjectId,
	firstName: String,
	lastName: String,
	birthDate: Date,
	gender: String,
	phone: Number,
	mail: String,
	dateArrivalFrance: Date,
	dateArrivalAssociation: Date,
	dateExitAssociation: Date,
	datePiObtaining: Date,
	agdrefNumber: Number,

	administrative: {
		address_id: Schema.Types.ObjectId,
		cirOrDa: String,
		cirDaStatus: String,
		isBankAccount: Boolean,
		bankName: String,
		hasDrivingLicence: Boolean,
		drivingLicenceDate: Date,
		comments: String,
	},

	health: {
		hasCmu: Boolean,
		cmuStartDate: Date,
		cmuEndDate: Date,
		needsSpecificFollowup: Boolean,
		specificFollowup: String,
		comments: String,
	},

	housing: {
		accessPrivatePark: Boolean,
		type: String,
		isHomeless: Boolean,
		requestLsDalo: Boolean,
		dateRequestLsDalo: Date,
		siao: Boolean,
		comments: String,
	},

	status: {
		internationalProtection: Boolean,
		asylum: Boolean,
		comments: String,
	},

	frenchLevel: {
		followsCourse: Boolean,
		howManyCoursesAccess: Number,
		comments: String,
	},

	training: {
		wished: String,
		current: String,
		accessModeInFrance: String,
		comments: String,
	},

	job: {
		wished: String,
		current: String,
		accessModeInFrance: String,
		diplomaEquivalence: Boolean,
		curriculum: Boolean,
		coverLetter: Boolean,
		hasIncome: Boolean,
		incomeValue: Number,
		comments: String,
	},
});

const Beneficiary = mongoose.model('Beneficiary', beneficiarySchema);

module.exports = Beneficiary;
