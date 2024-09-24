var express = require('express');
var router = express.Router();
const {login} = require('../controllers/authControllers');
const {decryptMiddleware} = require('../middleware/encryption_decryption')


router.post('/login', login);

module.exports = router;
