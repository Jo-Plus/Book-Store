const mongoose = require('mongoose');
const Joi = require('joi');
const passwordComplexity = require('joi-password-complexity');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 100,
    unique: true
  },
  username: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 200
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 8
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
}, { timestamps: true });

//====================
// Generate Auth Token
//====================
UserSchema.methods.generateToken = function() {
  return jwt.sign(
    { id: this._id, isAdmin: this.isAdmin },
    process.env.JWT_SECRET_KEY
  );
};

//====================
// Validation Register
//====================
function validateRegisterUser(obj) {
  const schema = Joi.object({
    email: Joi.string().trim().min(5).max(100).email().required(),
    username: Joi.string().trim().min(2).max(200).required(),
    password: passwordComplexity().required()
  });
  return schema.validate(obj);
}

//====================
// Validation Login
//====================
function validateLoginUser(obj) {
  const schema = Joi.object({
    email: Joi.string().trim().min(5).max(100).email().required(),
    password: passwordComplexity().required()
  });
  return schema.validate(obj);
}

//====================
// Validation change password
//====================
function validateChangePassword(obj) {
  const schema = Joi.object({
    password: passwordComplexity().required()
  });
  return schema.validate(obj);
}

//====================
// Validation Update
//====================
function validateUpdateUser(obj) {
  const schema = Joi.object({
    email: Joi.string().trim().min(5).max(100).email(),
    username: Joi.string().trim().min(2).max(200),
    password: Joi.string().trim().min(6)
  });
  return schema.validate(obj);
}

const User = mongoose.models.User || mongoose.model('User', UserSchema);

module.exports = {
  User,
  validateRegisterUser,
  validateLoginUser,
  validateUpdateUser,
  validateChangePassword
};
