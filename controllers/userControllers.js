const bscrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const MyError = require('../helpers/myError');

const { ACCESS_SECRET_KEY, REFRESH_SECRET_KEY, FRONTEND_URL } = process.env;

const registerUser = async (req, res, next) => {
  const { email, password, name } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user) {
      return next(new MyError('Email in use', 409));
    }

    await User.create({
      email,
      password,
      name,
    });

    res.status(201).json({
      user: {
        email,
        name,
      },
    });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return next(new MyError('Email or password is wrong', 401));
    }

    const passwordCompare = await bscrypt.compare(password, user.password);

    if (!passwordCompare) {
      return next(new MyError('Email or password is wrong', 401));
    }

    const payload = {
      id: user._id,
    };

    const accessToken = jwt.sign(payload, ACCESS_SECRET_KEY, { expiresIn: '2m' });
    const refreshToken = jwt.sign(payload, REFRESH_SECRET_KEY, { expiresIn: '7h' });

    await User.findByIdAndUpdate(user._id, { accessToken, refreshToken });

    res.json({
      accessToken,
      refreshToken,
      user: {
        email,
      },
    });
  } catch (error) {
    next(error);
  }
};

const googleLogin = async (req, res) => {
  const { _id: id, name } = req.user;

  const payload = {
    id,
  };

  const accessToken = jwt.sign(payload, ACCESS_SECRET_KEY, { expiresIn: '2m' });
  const refreshToken = jwt.sign(payload, REFRESH_SECRET_KEY, { expiresIn: '7h' });
  await User.findByIdAndUpdate(id, { accessToken, refreshToken });

  res.redirect(
    `${FRONTEND_URL}/home?accessToken=${accessToken}&refreshToken=${refreshToken}&name=${name}`
  );
};

const logOut = async (req, res, next) => {
  const { _id } = req.user;

  try {
    await User.findByIdAndUpdate(_id, { accessToken: null, refreshToken: null });

    res.status(204).json();
  } catch (error) {
    next(error);
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    const { email, name } = req.user;
    res.json({ email, name });
  } catch (error) {
    next(error);
  }
};

const refresh = async (req, res, next) => {
  const { refreshToken: token } = req.body;

  try {
    const { id } = jwt.verify(token, REFRESH_SECRET_KEY);

    const isExist = await User.findOne({ refreshToken: token });

    if (!isExist) {
      next(new MyError('Token is invalid', 403));
    }

    const payload = {
      id,
    };

    const accessToken = jwt.sign(payload, ACCESS_SECRET_KEY, { expiresIn: '2m' });
    const refreshToken = jwt.sign(payload, REFRESH_SECRET_KEY, { expiresIn: '7h' });

    res.json({
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(new MyError(error.message, 403));
  }
};

module.exports = { registerUser, loginUser, logOut, getCurrentUser, refresh, googleLogin };
