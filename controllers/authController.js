const asyncHandler = require('express-async-handler');
const { User, validateRegisterUser, validateLoginUser } = require('../models/User.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * @desc register new user
 * @route /api/auth/register
 * @method POST
 * @access public
*/
const register = asyncHandler(async (req, res) => {
  // validation
  const {error} = validateRegisterUser(req.body);
  if(error){
    return res.status(400).json({message: error.details[0].message})
  }
  // is user already exists
  let user = await User.findOne({ email: req.body.email });
  if (user) {
    return res.status(400).json({ message: 'user already exist' });
  }
    // hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  // new user and save it to DB
  user = new User({
  username: req.body.username,
  email: req.body.email,
  password: hashedPassword,
  });
  const result = await user.save();
  const token = user.generateToken();
  // send a res to client
  res.status(201).json(result);
})

//=======================================================

/**
 * @desc login user
 * @route /api/auth/login
 * @method POST
 * @access public
*/
const login = asyncHandler(async (req,res) =>{
  // validation
  const { error } = validateLoginUser(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  //is user exist
  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).json({ message: 'user not exist' });
  }
  //check the password
  const isPasswordMatch = bcrypt.compareSync(req.body.password , user.password);
  if (!isPasswordMatch) {
    return res.status(404).json({ message: "In-Valid email or password" });
  }
  const token = user.generateToken();
  //response to client
  // res.status(200).json({})
})

module.exports = {
  register,
  login
}
