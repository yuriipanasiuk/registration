const Joi = require('joi');

const refreshToken = Joi.object({
  refreshToken: Joi.string().required(),
});

module.exports = refreshToken;
