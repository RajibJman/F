const mongoose = require('mongoose');

const marksSchema = new mongoose.Schema({
  moduleId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Module' // Reference to Module model
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'register' // Reference to User model
  },
  marks: {
    type: Number,
    required: true
  }
});

const Marks = mongoose.model('Marks', marksSchema);

module.exports = Marks;
