var express = require('express');
var router = express.Router();
const {login, updateProfilePassword} = require('../controllers/authControllers');
const {decryptMiddleware} = require('../middleware/encryption_decryption')


router.post('/login', login);
router.post('/updateProfile', updateProfilePassword)

module.exports = router;
