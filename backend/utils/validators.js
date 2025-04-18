const Joi = require('joi');

const schemas = {
  appointment: Joi.object({
    full_name: Joi.string().required(),
    sex: Joi.string().valid('male', 'female', 'other').required(),
    age: Joi.number().integer().min(0).max(120).required(),
    phone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).required(),
    department: Joi.string().required(),
    service_type: Joi.string().required(),
    sub_services: Joi.array().items(Joi.string()),
    mrn: Joi.string().allow(''),
    appointment_date: Joi.date().greater('now').required(),
    appointment_time: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
    appointment_mode: Joi.string().valid('center', 'home').required()
  }),

  contact: Joi.object({
    full_name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).required(),
    message: Joi.string().required().min(10)
  }),

  auth: {
    signup: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(8).required(),
      full_name: Joi.string().required(),
      phone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).required()
    }),
    login: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required()
    }),
    // Add this to your existing schemas object
  serviceCategory: Joi.object({
    name: Joi.string().required(),
    category: Joi.string().required(),
    price: Joi.number().positive().required(),
    description: Joi.string().allow(''),
    is_active: Joi.boolean()
  }),
  }
};

module.exports = schemas; 