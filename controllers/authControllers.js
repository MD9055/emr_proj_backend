const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user'); // assuming you have a User model


async function login(req, res) {
  try {
    const { email, password } = req.body;
    
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
        userId: user._id, email:user.email, role:user.role
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


module.exports = {
  login
}