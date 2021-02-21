const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Skill = require('../models/skill-model');
const User = require('../models/user-model');

router.post('/skills', (req, res, next) => {
  const { title, description, category } = req.body;
  Skill.create({
    title: title,
    description: description,
    category: category,
    reviews: [],
    user: req.user._id
  })
    .then(response => {
      res.json(response)
    })
    .catch(error => {
      res.json(error);
    });
});

router.get('/skills', (req, res, next) => {
  const userInSession = req.user;
  const userId = userInSession ? userInSession._id : null;
  Skill.find({user: { $nin: userId }})
    .populate('reviews')
    .then(allSkills => {
      res.json(allSkills);
    })
    .catch(error => {
      res.json(error);
    });
});

router.get('/skills/:skillId', (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.skillId)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }

  Skill.findById(req.params.skillId)
    .populate('reviews')
    .then(skill => {
      res.status(200).json(skill);
    })
    .catch(error => {
      res.json(error);
    })
})

router.put('/skills/:skillId', (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.skillId)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }

  Skill.findByIdAndUpdate(req.params.skillId, req.body, {new: true})
    .then(skill => {
      res.status(200).json(skill);
      // res.json({message: `Skill with ${req.params.skillId} updated successfully`});
    })
    .catch(error => {
      res.json(error);
    });
});

router.delete('/skills/:skillId', (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.skillId)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }

  Skill.findByIdAndRemove(req.params.skillId)
    .then(() => {
      res.json({message: `Skill with ${req.params.skillId} removed successfully`});
    })
    .catch(error => {
      res.json(error);
    });
});

router.get('/my-skills', (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.user._id)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }

  Skill.find({user: req.user._id})
    .then(mySkills => {
      res.status(200).json(mySkills);
    })
    .catch(error => {
      res.json(error);
    });
});

router.post('/skills/:skillId/to-favorites', (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.skillId)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }

  Skill.findById(req.params.skillId)
    .then(response => {
      return User.findByIdAndUpdate(req.user._id, {
        $push: { favoriteSkills: response._id }
      })
      // .populate('favoriteSkills')
      .then(response => {
        res.json(response)
      })
    })
    .then(resp => {
      res.json(resp);
    })
    .catch(error => {
      res.json(error);
    });
});

module.exports = router;