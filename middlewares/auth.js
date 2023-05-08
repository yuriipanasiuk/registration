const jwt = require('jsonwebtoken');

const { ACCESS_SECRET_KEY } = process.env;

const User = require('../models/user');
const MyError = require('../helpers/myError');

const auth = async (req, res, next) => {
  try {
    const { authorization = '' } = req.headers;
    const [type, token] = authorization.split(' ');

    if (type !== 'Bearer') {
      return next(new MyError('Not autorized', 401));
    }
    const { id } = jwt.verify(token, ACCESS_SECRET_KEY);
    const user = await User.findById(id);

    if (!user || !user.accessToken) {
      return next(new MyError('Not autorized', 401));
    }

    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = auth;
