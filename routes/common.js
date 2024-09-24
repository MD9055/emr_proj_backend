var express = require('express');
var router = express.Router();
const {getCountry,getState,getCity} = require('../controllers/commonControllers')

/* GET home page. */
router.get('/country',getCountry);
router.get('/state',getState);
router.get('/city',getCity);




module.exports = router;
