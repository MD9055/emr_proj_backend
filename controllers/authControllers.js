const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user'); // assuming you have a User model
const  Mongoose  = require('mongoose');
const {generateJWTToken} = require('../utils/commonMethods')



async function login(req, res) {
  try {
    const { email, password } = req.body;

    console.log(req.body)
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    const user = await User.findOne({ email:email.toLowerCase() });
    console.log(user)
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    let payload = {
        userId: user._id, email:user.email, role:user.role, firstName:user.firstName, lastName:user.lastName
    }
    console.log(payload)
    const token = jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: '24h', 
    });
   return  res.status(200).json({message:"Login Successfully", token, statusCode:200})
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

async function updateProfilePassword(req, res) {
    try {
        let { _id, password, confirmPassword } = req.body;
        if (!_id || !password || !confirmPassword) {
            return sendResponse(res, 400, 'All fields are required', null);
        }
        if (password !== confirmPassword) {
            return sendResponse(res, 400, 'Passwords do not match', null);
        }
        let checkUser = await User.findOne({ _id: Mongoose.Types.ObjectId(_id) });
        if (!checkUser) {
            return sendResponse(res, 404, 'User not found', null);
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        checkUser.password = hashedPassword;
        let payload = {
          _id:checkUser._id,
          firstName:checkUser.firstName,
          email:checkUser.email,
          role:checkUser.role,

        }
        let generateToken = await generateJWTToken(payload, '24h')
        
        await User.findOneAndUpdate({_id:Mongoose.Types.ObjectId(_id)},{$set:{password:hashedPassword, token:generateToken}},{new:true})
        let data = {
          token:generateToken
        }
        return sendResponse(res, 200, 'Password updated successfully', data);
    } catch (err) {
        console.error(err);
        return sendResponse(res, 500, 'Internal server error', null, err.message);
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
  login,
  updateProfilePassword
}