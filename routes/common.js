var express = require('express');
var router = express.Router();
const {getCountry,getState,getCity,getByID} = require('../controllers/commonControllers')

/* GET home page. */
router.get('/country',getCountry);
router.get('/state',getState);
router.get('/city',getCity);
router.get('/getById', getByID)





module.exports = router;
