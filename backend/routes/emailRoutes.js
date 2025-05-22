const express = require('express');
const router = express.Router();
const { submitContactForm, sendBookingEmailRoute } = require('../controllers/emailController');
router.post('/send-email', submitContactForm);
router.post('/send-booking-email', sendBookingEmailRoute)
// router.post('/send-email-success', sendPaymentSuccessEmailRoute);
module.exports = router;