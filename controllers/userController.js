const asyncHandler = require('express-async-handler');
const { User, validateUpdateUser } = require('../models/User.js');
const bcrypt = require('bcryptjs');

/**
 * @desc update user
 * @route /api/users/:id
 * @method PUT
 * @access private
*/
const updateUser =  asyncHandler(async (req, res) => {
  //validation
    const { error } = validateUpdateUser(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    //hash password if the user want to change password
    if(req.body.password){
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }
    //update new data
    const updateUser = await User.findByIdAndUpdate(req.params.id , {
      $set:{
        username:req.body.username,
        password:req.body.password
      }
    },{new:true}).select("-password")
    //response to client
    res.status(200).json(updateUser);
})
//=================================================
/**
 * @desc get all users
 * @route /api/users
 * @method get
 * @access private(only admin)
*/
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password");
  res.status(200).json(users)
})
//=================================================
/**
 * @desc get user By Id
 * @route /api/users/:id
 * @method get
 * @access private(only admin & user himself)
*/
const getUserById =  asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password").populate("posts");
  if(!user){
    return res.status(404).json({message : "user not found"})
  }
  res.status(200).json(user);
})

//=================================================
/**
 * @desc delete user
 * @route /api/users/:id
 * @method delete
 * @access private(only admin & user himself)
*/
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if(!user){
    return res.status(404).json({message:"user not found"});
  }
  //delete the user himself
  await User.findByIdAndDelete(req.params.id);
  //send a res to the client
  return res.status(200).json({message:"your profile has been deleted"});
})

module.exports = {
  updateUser,
  getAllUsers,
  getUserById,
  deleteUser
}