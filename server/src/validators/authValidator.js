const Joi = require('joi');

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

const refreshSchema = Joi.object({
  refreshToken: Joi.string().required()
});

const registerSchema = Joi.object({
  name: Joi.string().trim().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  phone: Joi.string().allow('').optional(),
  role: Joi.string().valid('ADMIN', 'MANAGER', 'SALES', 'VIEWER').optional()
});

module.exports = { loginSchema, refreshSchema, registerSchema };
