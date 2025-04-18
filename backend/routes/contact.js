const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const validateRequest = require('../middleware/validateRequest');
const schemas = require('../utils/validators');
const contactController = require('../controllers/contactController');

router.post('/', 
  validateRequest(schemas.contact), 
  contactController.submitContact
);
router.get('/', auth, contactController.getContactMessages);

module.exports = router; 