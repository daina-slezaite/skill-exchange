const express    = require('express');
const authRoutes = express.Router();
const passport   = require('passport');
const bcrypt     = require('bcryptjs');
const User       = require('../models/user-model');

authRoutes.post('/signup', (req, res, next) => {
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;

  if(!email || !username || !password) {
    res.status(400).json({message: 'All fields - email, username and password - must be provided to sign up.'});
    return;
  }

  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
  if(!regex.test(password)) {
    res.status(400).json({message: 'Password must contain a number, lowercase and uppercase letters and be at least 8 characters long.'});
    return;
  }

  User.findOne({email}, (err, foundUser) => {

    if(err) {
      res.status(500).json({message: 'Something went wrong with the email check.'});
      return;
    }

    if(foundUser) {
      res.status(400).json({message: 'This email is already taken. Try with another one.'});
      return;
    }

    const salt = bcrypt.genSaltSync(10);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      email: email,
      username: username,
      password: hashPass
    });

    newUser.save(err => {
      if(err) {
        res.status(500).json({message: 'Something went wrong while saving the user to the database.'});
        return;
      }

      req.login(newUser, (err) => {

        if(err) {
          res.status(500).json({message: 'Unsuccessful login after signup.'});
          return;
        }
        
        res.status(200).json(newUser);
      });
    });
  });
});

module.exports = authRoutes;