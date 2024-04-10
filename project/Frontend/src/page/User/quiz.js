import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './QuizPage.module.css'; // Import CSS module

const QuizPage = () => {
  const [quiz, setQuiz] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [resultPopup, setResultPopup] = useState(null);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes countdown timer
  const quizId = localStorage.getItem('quizId');

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/auth/quiz/${quizId}`);
        setQuiz(response.data);
      } catch (error) {
        console.error('Error fetching quiz:', error);
      }
    };

    if (quizId) {
      fetchQuiz();
    }
  }, [quizId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (timeLeft > 0) {
        setTimeLeft(timeLeft - 1);
      } else {
        handleSubmit();
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft]);

  const handleOptionChange = (questionId, optionText) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: optionText,
    });
  };

  const handleSubmit = async () => {
    let marks = 0;

    quiz.forEach((question) => {
      const selectedOption = selectedAnswers[question._id];
      const correctAnswer = question.options.find((option) => option.text === question.answer);

      if (selectedOption === correctAnswer.text) {
        marks++;
      }
    });

    const percentage = (marks / quiz.length) * 100;
    const userId = localStorage.getItem('userId');
    const moduleId = localStorage.getItem('moduleId');

    const data = {
      moduleId: moduleId,
      userId: userId,
      marks: percentage.toFixed(2)
    };

    try {
      await axios.post('http://localhost:3000/api/auth/addmarks', data);
    } catch (error) {
      console.error('Error submitting marks:', error);
    }

    let resultMessage = '';
    let resultColor = '';
    if (percentage >= 75) {
      resultMessage = 'Pass';
      resultColor = 'green';
    } else {
      resultMessage = 'Fail';
      resultColor = 'red';
    }

    setResultPopup(
      <div className={styles['result-popup']}>
        <h2>Quiz Result</h2>
        <p>Your marks: {marks}/{quiz.length}</p>
        <p>Percentage: {percentage.toFixed(2)}%</p>
        <p style={{ color: resultColor }}>{resultMessage}</p>
        <button onClick={() => setResultPopup(null)}>Close</button>
      </div>
    );

    setSubmitted(true);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className={styles.container}> {/* Use className from CSS module */}
      {quiz ? (
        <div>
          <div className={styles['countdown']} style={{ fontSize: '24px', fontWeight: 'bold' }}>
            Time Left: {minutes < 10 ? `0${minutes}` : minutes}:{seconds < 10 ? `0${seconds}` : seconds}
          </div>
          {quiz.map((question) => (
            <div className={styles.question} key={question._id}>
              <h3>{question.question}</h3>
              <ul className={styles.options}>
                {question.options.map((option) => (
                  <li className={styles.option} key={option._id}>
                    <input
                      type="radio"
                      name={`question_${question._id}`}
                      id={option._id}
                      value={option._id}
                      onChange={() => handleOptionChange(question._id, option.text)}
                      checked={selectedAnswers[question._id] === option.text}
                      disabled={submitted}
                    />
                    <label htmlFor={option._id}>{option.text}</label>
                  </li>
                ))}
              </ul>
              {submitted && (
                <p style={{ color: selectedAnswers[question._id] === question.answer ? 'green' : 'red' }}>
                  {selectedAnswers[question._id] === question.answer ? 'Correct!' : `Incorrect. Correct answer: ${question.answer}`}
                </p>
              )}
            </div>
          ))}
          <div className={styles['button-container']}>
            <button onClick={handleSubmit} disabled={submitted}>
              Submit
            </button>
          </div>
          {resultPopup}
        </div>
      ) : (
        <p className={styles.loading}>Loading...</p>
      )}
    </div>
  );
};

export default QuizPage;
