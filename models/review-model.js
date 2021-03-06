const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  comment: {type: String, required: true},
  rating: {type: Number, required: true},
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  skill: { type: Schema.Types.ObjectId, ref: 'Skill' }
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;