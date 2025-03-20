const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  id: { type: String },
  login: { type: String },
  password: { type: String },
  first_name: { type: String },
  last_name: { type: String },
  DOB: { type: String },
  phone1: { type: String },
  phone2: { type: String },
  email: { type: String },
});

module.exports = mongoose.model('Users', userSchema);
