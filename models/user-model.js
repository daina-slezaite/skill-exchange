const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    trim: true,
    required: [true, 'Username is required.'],
    unique: true
  },
  email: {
    type: String,
    required: [true, 'Email is required.'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required.']
  },
  description: {
    type: String,
    required: [true, 'Description is required.']
  },
  favoriteSkills: [],
},
{
  timestamps: true
});

const User = mongoose.model('User', userSchema);
module.exports = User;