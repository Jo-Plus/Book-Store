const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const {User , validateChangePassword } = require('../models/User.js');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

/**
 * @desc get forgot password view
 * @route /password/forgot-password
 * @method GET
 * @access public
*/
const getForgotPasswordView =  asyncHandler((req, res) => {
  res.render('forgot-password');
})


/**
 * @desc send forgot password link
 * @route /password/forgot-password
 * @method POST
 * @access public
*/
const sendForgotPasswordLink =  asyncHandler(async(req, res) => {
  //get the user from DB by email
  const user = await User.findOne({email:req.body.email});
  if(!user){
    return res.status(404).json({message:"user with given email does not exist!"})
  }
  const secret = process.env.JWT_SECRET_KEY + user.password;
  const token = jwt.sign({email : user.email , id:user.id} , secret , {
    expiresIn : '10m',
  })
  const link = `${process.env.CLIENT_DOMAIN}/password/reset-password/${user._id}/${token}`;
  const transporter = nodemailer.createTransport({
    service : "gmail",
    auth:{
      user:process.env.USER_EMAIL,
      pass:process.env.USER_PASSWORD,
    }
  })
  const mailOptions ={
    from : process.env.USER_EMAIL,
    to: user.email,
    subject : "reset password",
    html:`<div>
    <h4>click on the link below to reset your password</h4>
    <P>${link}</p>
    </div>`
  }
  transporter.sendMail(mailOptions , function(error , success){
    if(error){
      console.log(error);
      res.status(500).json({message : "something went wrong"})
    }else{
      console.log("Email sent :" + success.response);
      res.render("link-send")
    }
  });
})


/**
 * @desc get reset password view
 * @route /password/reset-password/:id/:token
 * @method get
 * @access public
*/
const getResetPasswordView =  asyncHandler(async(req, res) => {

  //get the user from DB by email
  const user = await User.findById(req.params.userId);
  if(!user){
    return res.status(404).json({message:"user not found"})
  }
  const secret = process.env.JWT_SECRET_KEY + user.password;
  try {
    jwt.verify(req.params.token , secret);
    res.render('reset-password' , {email : user.email})
  } catch (error) {
    res.json({message:"error"});
  }
})


/**
 * @desc reset the password
 * @route /password/reset-password/:id/:token
 * @method POST
 * @access public
*/
const resetThePassword =  asyncHandler(async(req, res) => {
  const{error} = validateChangePassword(req.body);
  if(error){
    return res.status(400).json({message : error.details[0].message})
  }
  //get the user from DB by email
  const user = await User.findById(req.params.userId);
  if(!user){
    return res.status(404).json({message:"user not found"})
  }
  const secret = process.env.JWT_SECRET_KEY + user.password;
  try {
    jwt.verify(req.params.token , secret);
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password , salt);
    user.password = req.body.password;
    await user.save();
    res.render('success-password');
  } catch (error) {
    res.json({message:"error"});
  }
})

module.exports = {
  getForgotPasswordView,
  sendForgotPasswordLink,
  getResetPasswordView,
  resetThePassword
}