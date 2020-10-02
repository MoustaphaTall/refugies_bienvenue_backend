const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const beneficiarySchema = new Schema({
	volunteer: { type: Schema.Types.ObjectId, ref: 'Volunteer' },
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
	address: { type: Schema.Types.ObjectId, ref: 'Address' },
	cirOrDa: String,
	cirDaStatus: String,
	isBankAccount: Boolean,
	bankName: String,
	hasDrivingLicence: Boolean,
	drivingLicenceDate: Date,
	administrativeComments: String,
	hasCmu: Boolean,
	cmuStartDate: Date,
	cmuEndDate: Date,
	needsSpecificFollowup: Boolean,
	specificFollowup: String,
	healthComments: String,
	accessPrivatePark: Boolean,
	nature: String,
	isHomeless: Boolean,
	requestLsDalo: Boolean,
	dateRequestLsDalo: Date,
	siao: Boolean,
	housingComments: String,
	internationalProtection: Boolean,
	asylum: Boolean,
	statusComments: String,
	followsCourse: Boolean,
	howManyCoursesAccess: Number,
	frenchLevelComments: String,
	wishedTraining: String,
	currentTraining: String,
	trainingAccessMode: String,
	trainingComments: String,
	wishedJob: String,
	currentJob: String,
	jobaccessMode: String,
	diplomaEquivalence: Boolean,
	curriculum: Boolean,
	coverLetter: Boolean,
	hasIncome: Boolean,
	incomeValue: Number,
	jobComments: String,
});

const Beneficiary = mongoose.model('Beneficiary', beneficiarySchema);

module.exports = Beneficiary;
