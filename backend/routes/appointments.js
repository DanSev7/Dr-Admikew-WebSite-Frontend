const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const validateRequest = require('../middleware/validateRequest');
const schemas = require('../utils/validators');
const appointmentController = require('../controllers/appointmentController');

router.post('/', 
  auth, 
  validateRequest(schemas.appointment), 
  appointmentController.createAppointment
);
router.get('/', auth, appointmentController.getAppointments);

module.exports = router; 