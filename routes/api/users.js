const express = require('express');
const router = express.Router();

const validation = require('../../schemas/validation');
const userValidate = require('../../schemas/userValidate');
const refreshToken = require('../../schemas/refreshToken');
const auth = require('../../middlewares/auth');
const passport = require('../../middlewares/googleAuth');

const {
  registerUser,
  loginUser,
  logOut,
  getCurrentUser,
  refresh,
  googleLogin,
} = require('../../controllers/userControllers');

router.get('/google', passport.authenticate('google', { scope: ['email', 'profile'] }));
router.get('/google/callback', passport.authenticate('google', { session: false }), googleLogin);

router.post('/register', validation(userValidate), registerUser);
router.post('/login', validation(userValidate), loginUser);
router.post('/logout', auth, logOut);
router.post('/refresh', validation(refreshToken), refresh);
router.get('/current', auth, getCurrentUser);

module.exports = router;
