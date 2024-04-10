import React from 'react';

const ResultPage = ({ marks, totalQuestions }) => {
  return (
    <div className="container">
      <h2>Quiz Result</h2>
      <p>Your marks: {marks}/{totalQuestions}</p>
    </div>
  );
};

export default ResultPage;
