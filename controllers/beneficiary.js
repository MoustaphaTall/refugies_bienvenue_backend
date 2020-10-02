const express = require('express');
const router = express.Router();

const { Beneficiary } = require('../models');

/* On les réécrira en CRUD ensuite :
// const readBeneficiary = (req, res) => {
//     console.log('GET /beneficiaries/:id');
// }; 
    const updateBeneficiary
    const deleteBeneficiary
    etc
*/

router.get('/:id', (req, res) => {
	console.log('GET /beneficiaires/:id');
	const beneficiaryId = req.params.id;

	Beneficiary.findById(beneficiaryId)
		.populate('administrative.address')
		.populate('volunteer')
		.exec((err, beneficiary) => {
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
});

/* 
Puis ajoutera 
    router.route(/:id)
        .get(readBeneficiary),
        .put
        .delete
    etc        
*/

module.exports = router;
