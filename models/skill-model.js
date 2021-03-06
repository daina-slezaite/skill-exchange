const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const skillSchema = new Schema({
  title: String,
  description: String,
  category: {
    type: String,
    enum: ['Graphic Design', 'Languages', 'Music', 'Illustration', 'Lifestyle', 'Photography & Video', 'Business', 'Writing', 'Fine Art']
  },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
  imageUrl: {type: String}
});

const Skill = mongoose.model('Skill', skillSchema);

module.exports = Skill;