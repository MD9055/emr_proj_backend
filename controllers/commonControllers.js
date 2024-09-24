const COUNTRY = require('../models/country')
const STATE = require('../models/states')
const CITY  = require('../models/city')

async function getCountry(req, res) {
    try {
        let countryList = await COUNTRY.find({});
        console.log(countryList);
        sendResponse(res, 200, "", countryList);
        
    } catch (err) {
        console.error(err);

        sendResponse(res, 500, "An error occurred while retrieving the country list.", null, err.message);
    }
}

async function getState(req, res) {
    try {
        let stateList = await STATE.find({country_id:req.query.country_id});
        console.log(stateList);
        sendResponse(res, 200, "", stateList);
        
    } catch (err) {
        console.error(err);

        sendResponse(res, 500, "An error occurred while retrieving the country list.", null, err.message);
    }
}

async function getCity(req, res) {
    try {
        let cityList = await CITY.find({state_id:req.query.state_id});
        sendResponse(res, 200, "", cityList);
    } catch (err) {
        console.error(err);

        sendResponse(res, 500, "An error occurred while retrieving the country list.", null, err.message);
    }
}
function sendResponse(res, statusCode, message, data, error = null) {
    return res.status(statusCode).json({
        statusCode: statusCode,
        message: message,
        data: data,
        error: error
    });
}





module.exports = {
    getCountry,
    getState,
    getCity
}