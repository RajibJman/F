const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define Schema for Quiz
const QuizSchema = new Schema({
  topic: { type: String, required: true }, // Name of the topic
  questions: [{
    question: { type: String, required: true },
    options: [{
      text: { type: String, required: true }
    }],
    answer: { type: String, required: true }
  }]
});

// Define model
const Quiz = mongoose.model('Quiz', QuizSchema);

module.exports = Quiz;
