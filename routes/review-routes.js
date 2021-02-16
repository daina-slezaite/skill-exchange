const express = require('express');
const mongoose = require('mongoose');
const Review = require('../models/review-model');
const Skill = require('../models/skill-model');
const router = express.Router();

router.get('/reviews/:reviewId', (req, res, next) => {
  Review.findById(req.params.reviewId)
    .then(review => {
      res.json(review);
    })
    .catch(error => {
      res.json(error);
    });
});

router.post('/reviews', (req, res, next) => {
  Review.create({
    comment: req.body.comment,
    rating: req.body.rating,
    skill: req.body.skillId
  })
    .then(response => {
      return Skill.findByIdAndUpdate(req.body.skillId, {
        $push: { reviews: response._id }
      });
    })
    .then(resp => {
      res.json(resp);
    })
    .catch(error => {
      res.json(error);
    });
});

router.put('/reviews/:reviewId', (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.reviewId)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }

  Review.findByIdAndUpdate(req.params.reviewId, req.body)
    .then(() => {
      res.json({message: `Review with ${req.params.reviewId} has been updated.`});
    })
    .catch(error => {
      res.json(error);
    });
});

router.delete('/reviews/:reviewId', (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.reviewId)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }

  Review.findByIdAndRemove(req.params.reviewId)
    .then(() => {
      res.json({message: `Review with ${req.params.reviewId} has been deleted.`});
    })
    .catch(error => {
      res.json(error);
    });
});

module.exports = router;