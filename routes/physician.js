var express = require('express');
var router = express.Router();
const {addUpdatePatients,listPatients,addPatients,updatePatient} = require('../controllers/physicianControllers')
const {authMiddleware} = require('../middleware/authUser')

/* GET home page. */
router.post('/addUpdatePatient', authMiddleware,addUpdatePatients);
router.post('/addPatient', authMiddleware,addPatients);

router.get('/listPatients', authMiddleware,listPatients);
router.post('/updatePatient', authMiddleware,updatePatient);





module.exports = router;
