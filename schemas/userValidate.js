const Joi = require('joi');

const userValidate = Joi.object({
  name: Joi.string(),
  email: Joi.string().required(),
  password: Joi.string().min(6).required(),
  token: Joi.string(),
});

module.exports = userValidate;
