const { Router } = require('express');
const { getForgotPasswordView, sendForgotPasswordLink, getResetPasswordView, resetThePassword } = require('../controllers/passwordController.js');
const router = Router();

// /password/forgot-password
router.get("/forgot-password", getForgotPasswordView );
router.post("/forgot-password", sendForgotPasswordLink );

// /password/reset-password/:userId/:token
router.get("/reset-password/:userId/:token", getResetPasswordView );
router.post("/reset-password/:userId/:token", resetThePassword );


module.exports = router;