const { Schema, model } = require('mongoose');
const bscrypt = require('bcryptjs');

const userModel = new Schema(
  {
    name: {
      type: String,
      require: [true, 'Write your name'],
    },
    email: {
      type: String,
      require: [true, 'Emails is require'],
      unique: true,
    },

    password: {
      type: String,
      require: [true, 'Set password for user'],
    },
    accessToken: {
      type: String,
      default: null,
    },
    refreshToken: {
      type: String,
      default: null,
    },
  },
  { versionKey: false, timestamps: true }
);

userModel.pre('save', async function () {
  if (this.isNew) {
    this.password = await bscrypt.hash(this.password, 10);
  }
});

const User = model('user', userModel);

module.exports = User;
