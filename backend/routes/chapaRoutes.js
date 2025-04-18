const express = require('express');
const router = express.Router();
const { initiatePayment, webhookClient } = require('../controllers/chapaController');

router.post('/initiate', initiatePayment);
router.post('/webhook', webhookClient); // Chapa will call this automatically

module.exports = router;
