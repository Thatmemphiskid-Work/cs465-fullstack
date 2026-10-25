const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  hashIterations: { type: Number, default: 1000 },
  hash: String,
  salt: String
});

// Method to set the password on this record.
userSchema.methods.setPassword = function(password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hashIterations = 210000;

  this.hash = crypto.pbkdf2Sync(
    password,
    this.salt,
    this.hashIterations || 1000,
    64,
    'sha512'
  ).toString('hex');
};

// Method to compare entered password against stored hash.
userSchema.methods.validPassword = function(password) {
  const hash = crypto.pbkdf2Sync(
    password,
    this.salt,
    this.hashIterations || 1000,
    64,
    'sha512'
  ).toString('hex');

  const stored = Buffer.from(this.hash || '', 'hex');
  const candidate = Buffer.from(hash, 'hex');
  return stored.length === candidate.length && crypto.timingSafeEqual(stored, candidate);
};

// Method to generate a JSON Web Token for the current record.
userSchema.methods.generateJWT = function() {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      name: this.name
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '1h'
    }
  );
};

const User = mongoose.model('users', userSchema);

module.exports = User;
