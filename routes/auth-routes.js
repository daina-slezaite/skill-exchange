const express    = require('express');
const authRoutes = express.Router();
const passport   = require('passport');
const bcrypt     = require('bcryptjs');
const User       = require('../models/user-model');

authRoutes.post('/signup', (req, res, next) => {
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  const description = req.body.description;

  console.log('This is req.body: ', req.body);

  if(!email || !username || !password) {
    res.status(400).json({message: 'All fields - email, username and password - must be provided to sign up.'});
    console.log('All fields provided during signup');
    return;
  }

  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
  if(!regex.test(password)) {
    res.status(400).json({message: 'Password must contain a number, lowercase and uppercase letters and be at least 8 characters long.'});
    console.log('Password passes regex test');
    return;
  }

  User.findOne({email}, (err, foundUser) => {
    console.log('Searching for user here');

    if(err) {
      res.status(500).json({message: 'Something went wrong with the email check.'});
      console.log('There has been an error with the email check:' , err)
      return;
    }

    if(foundUser) {
      res.status(400).json({message: 'This email is already taken. Try with another one.'});
      console.log('This email is already taken by:', foundUser)
      return;
    }

    const salt = bcrypt.genSaltSync(10);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      email: email,
      username: username,
      password: hashPass,
      description: description
    });

    newUser.save(err => {
      console.log('Trying to save new user');
      if(err) {
        res.status(500).json({message: 'Something went wrong while saving the user to the database.'});
        console.log('Could not save you: ', err)
        return;
      }

      req.login(newUser, (err) => {

        console.log('trying to log in after signup');

        if(err) {
          res.status(500).json({message: 'Unsuccessful login after signup.'});
          console.log('something went wrong with login after signup:', err)
          return;
        }
        
        res.status(200).json(newUser);
      });
    });
  });
});

authRoutes.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, theUser, failureDetails) => {
    if(err) {
      res.status(500).json({message: 'Authentication unsuccessful.'});
      return;
    }

    if(!theUser) {
      res.status(401).json(failureDetails);
      return;
    }

    req.login(theUser, (err) => {
      if(err) {
        res.status(500).json({message: 'Session save unsuccessful.'});
        return;
      }

      res.status(200).json(theUser);
    });
  }) (req, res, next);
});

authRoutes.post('/logout', (req, res, next) => {
  req.logout();
  res.status(200).json({message: 'Successful logout.'});
});

authRoutes.get('/loggedin', (req, res, next) => {
  if(req.isAuthenticated()) {
    res.status(200).json(req.user);
    return;
  }
  res.status(403).json({message: 'Unauthorised access.'});
});

module.exports = authRoutes;