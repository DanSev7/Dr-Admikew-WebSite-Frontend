const express = require('express');
const router = express.Router();
const { submitContactForm, sendPaymentSuccessEmailRoute } = require('../controllers/emailController');
router.post('/send-email', submitContactForm);
// router.post('/send-email-success', sendPaymentSuccessEmailRoute);
module.exports = router;