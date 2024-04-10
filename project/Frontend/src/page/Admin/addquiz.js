import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Typography } from '@mui/material';
import Navbar from '../../component/Navbar';
import './AddQuizForm.css';

const AddQuizForm = () => {
  const [quizData, setQuizData] = useState({
    topic: '',
    questions: [{ question: '', options: [{ text: '' }], answer: '' }],
  });
  const [submissionStatus, setSubmissionStatus] = useState('');

  const handleChange = (e, questionIndex, optionIndex) => {
    const { name, value } = e.target;
    const updatedQuestions = [...quizData.questions];

    if (name === 'question' || name === 'answer') {
      updatedQuestions[questionIndex][name] = value;
    } else if (name === 'text') {
      updatedQuestions[questionIndex].options[optionIndex].text = value;
    }

    setQuizData({ ...quizData, questions: updatedQuestions });
  };

  const addOption = (questionIndex) => {
    const updatedOptions = [...quizData.questions[questionIndex].options, { text: '' }];
    const updatedQuestions = [...quizData.questions];
    updatedQuestions[questionIndex] = { ...updatedQuestions[questionIndex], options: updatedOptions };
    setQuizData({ ...quizData, questions: updatedQuestions });
  };

  const addQuestion = () => {
    setQuizData({
      ...quizData,
      questions: [...quizData.questions, { question: '', options: [{ text: '' }], answer: '' }],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.post('http://localhost:3000/api/auth/insertQuiz', quizData, config);
      console.log('Quiz added:', response.data);
      setSubmissionStatus('Quiz added successfully!');
      alert('Quiz added successfully!');
      setQuizData({ topic: '', questions: [{ question: '', options: [{ text: '' }], answer: '' }] });
    } catch (error) {
      console.error('Error adding quiz:', error);
      setSubmissionStatus('Failed to add quiz');
    }
  };

  return (
    <div className="page-container" style={{ backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
      <Navbar />
      <h1 className="quiz-heading" style={{ textAlign: 'center', marginTop: '20px', marginBottom: '20px', fontSize: '32px', fontWeight: 'bold' }}>
        Add Question
      </h1>
      <div className="quiz-form-container">
        {submissionStatus && <Typography variant="body1">{submissionStatus}</Typography>}
        <form onSubmit={handleSubmit} style={{ border: '2px solid #ccc', padding: '20px', backgroundColor: '#fff' }}>
          <TextField
            label="Topic"
            fullWidth
            value={quizData.topic}
            onChange={(e) => setQuizData({ ...quizData, topic: e.target.value })}
            required
            margin="normal"
            InputLabelProps={{ style: { fontSize: '18px', fontWeight: 'bold' } }}
            style={{ marginBottom: '10px', backgroundColor: '#fff' }}
          />

          {quizData.questions.map((question, questionIndex) => (
            <div key={questionIndex} className="question-container" style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '10px', borderRadius: '5px', backgroundColor: '#fff' }}>
              <TextField
                label={`Question ${questionIndex + 1}`}
                fullWidth
                value={question.question}
                onChange={(e) => handleChange(e, questionIndex, null)}
                name="question"
                required
                margin="normal"
                InputLabelProps={{ style: { fontSize: '18px', fontWeight: 'bold' } }}
                style={{ marginBottom: '10px', backgroundColor: '#fff' }}
              />

              {question.options.map((option, optionIndex) => (
                <div key={optionIndex} className="option-container" style={{ marginBottom: '10px' }}>
                  <TextField
                    label={`Option ${optionIndex + 1}`}
                    fullWidth
                    value={option.text}
                    onChange={(e) => handleChange(e, questionIndex, optionIndex)}
                    name="text"
                    required
                    margin="normal"
                    style={{ backgroundColor: '#fff' }}
                  />
                </div>
              ))}

              <Button variant="outlined" onClick={() => addOption(questionIndex)} className="add-option-button">
                Add Option
              </Button>

              <TextField
                label={`Answer for Question ${questionIndex + 1}`}
                fullWidth
                value={question.answer}
                onChange={(e) => handleChange(e, questionIndex, null)}
                name="answer"
                required
                margin="normal"
                style={{ marginBottom: '10px', backgroundColor: '#fff' }}
              />
            </div>
          ))}

          <Button variant="outlined" onClick={addQuestion} className="add-question-button">
            Add Question
          </Button>
          <Button variant="contained" color="primary" type="submit" className="submit-button" style={{ marginTop: '10px' }}>
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AddQuizForm;
