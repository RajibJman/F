const Quiz = require('../models/quiz');

async function insertQuizQuestion(req, res) {
    const { topic, questions } = req.body;
      
    try {
      const existingQuiz = await Quiz.findOne({ topic: topic });
  
      if (!existingQuiz) {
        const newQuiz = new Quiz({
          topic: topic,
          questions: questions
        });
  
        const savedQuiz = await newQuiz.save();
        res.status(201).json(savedQuiz);
      } else {
        // Push the new questions to the existing quiz's questions array
        existingQuiz.questions.push(...questions);
  
        // Save the updated quiz
        const savedQuiz = await existingQuiz.save();
  
        res.status(201).json(savedQuiz);
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
  

async function getQuestionsByTopicId(req, res) {
    const topicId = req.params.topicId;
    try {
      const quiz = await Quiz.findById(topicId);
      
      if (!quiz) {
        return res.status(404).json({ message: 'Quiz not found for the given topic ID' });
      }
  
      res.json(quiz.questions);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }


async function checkAnswerByTopicId(req, res) {
    const { topicId, questionId, userOption } = req.body;

  try {
    const quiz = await Quiz.findById(topicId);

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found for the given topic ID' });
    }

    const question = quiz.questions.find(q => q._id.toString() === questionId);

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
  
    if (userOption === question.answer) {
      const updatedScore = 5;
      return res.json({ message: 'Correct answer!', score: updatedScore });
    } else {
      return res.json({ message: 'Incorrect answer' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


async function getAllTopicNames(req, res) {
  try {
      const topics = await Quiz.find({}, '_id topic'); // Fetch _id and topic fields
      res.status(200).json(topics); // Respond with status 200 and the list of topics
  } catch (error) {
      console.error("Error fetching topic names:", error);
      res.status(500).json({ message: "Internal server error" }); // Respond with status 500 for any errors
  }
}

module.exports = {
  insertQuizQuestion,
  getQuestionsByTopicId,
  checkAnswerByTopicId,
  getAllTopicNames
};
