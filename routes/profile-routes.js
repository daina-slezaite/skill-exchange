const express = require('express');
const mongoose = require('mongoose');
const Review = require('../models/review-model');
const Skill = require('../models/skill-model');
const User = require('../models/user-model');
const router = express.Router();

router.get('/my-profile', (req, res, next) => {
  User.findById(req.user._id)
    .then(userDetails => {
      res.json(userDetails);
    })
    .catch(error => {
      res.json(error);
    });
})


module.exports = router;