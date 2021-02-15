const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Skill = require('../models/skill-model');

router.post('/skills', (req, res, next) => {
  const { title, description } = req.body;
  Skill.create({title, description})
    .then(response => {
      res.json(response)
    })
    .catch(error => {
      res.json(error);
    });
});

router.get('/skills', (req, res, next) => {
  Skill.find()
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
    .then(() => {
      res.json({message: `Skill with ${req.params.skillId} updated successfully`});
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

module.exports = router;