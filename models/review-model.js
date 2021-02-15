const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  comment: String,
  rating: Number,
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  skill: { type: Schema.Types.ObjectId, ref: 'Skill' }
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;