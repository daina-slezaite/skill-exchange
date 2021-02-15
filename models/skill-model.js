const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const skillSchema = new Schema({
  title: String,
  description: String,
  category: {
    type: String,
    enum: ['Handcrafts', 'Languages', 'Music', 'Art']
  },
  user: { type: Schema.Types.ObjectId, ref: 'User' }
});

const Skill = mongoose.model('Skill', skillSchema);

module.exports = Skill;