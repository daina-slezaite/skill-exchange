const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Skill = require('../models/skill-model');
const User = require('../models/user-model');
const uploader = require('../configs/cloudinary-setup.config');

router.post('/upload', uploader.single('imageUrl'), (req, res, next) => {
  res.json({secure_url: req.file.path});
})

router.post('/skills', (req, res, next) => {
  const { title, description, category, image } = req.body;
  Skill.create({
    title: title,
    description: description,
    category: category,
    reviews: [],
    user: req.user._id,
    imageUrl: image
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

router.get('/skills/search', (req, res, next) => {
  // Skill.find({$or: [{title: new RegExp(req.query.title, 'i')}, {category: req.query.category}]})
  Skill.find({title: new RegExp(req.query.title, 'i')})
    .then(foundSkills => {
      res.status(200).json(foundSkills);
    })
    .catch(error => {
      res.json(error);
    });
}) 

router.get('/skills/:skillId/:userId', (req, res, next) => {
  Skill.find({$and: [{user: req.params.userId}, {_id: req.params.skillId}]})
  .then(response => {
    User.findById(response[0].user)
      .then(foundUser => {
        res.status(200).json(foundUser);
      })
      .catch(error => res.json(error));
  })
  .catch(error => res.json(error));
})

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

router.post('/skills/:skillId/favorites', (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.skillId)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }

  Skill.findById(req.params.skillId)
    .then(response => {
      return User.findByIdAndUpdate(req.user._id, {
        $push: { favoriteSkills: response._id }
      })
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

router.delete('/skills/:skillId/favorites', (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.skillId)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }

  Skill.findById(req.params.skillId)
    .then(response => {
      return User.findByIdAndUpdate(req.user._id, {
        $pull: { favoriteSkills: response._id }
      })
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