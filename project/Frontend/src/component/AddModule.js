// ModuleFormDialog.js
import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { styled } from '@mui/material/styles';
import './AddModule.css'; // Import CSS file

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
}));

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  padding: theme.spacing(2),
}));

const AddModule = ({ open, onClose, onSubmit }) => {
  const [moduleName, setModuleName] = useState('');
  const [quizRequired, setQuizRequired] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    // Fetch topics from the API
    fetch('http://localhost:3000/api/auth/topic')
      .then(response => response.json())
      .then(data => {
        setTopics(data);
      })
      .catch(error => console.error('Error fetching topics:', error));
  }, []);

  const handleSubmit = async () => {
    try {
      const moduleData = {
        
        quizId: selectedQuiz
      };

      const response = await fetch('http://localhost:3000/api/auth/modulequiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(moduleData),
      });

      if (!response.ok) {
        throw new Error('Failed to add module');
      }

      const responseData = await response.json();
      console.log('Module added successfully:', responseData);

      onSubmit(); // No need to pass data since it's already set in moduleData
      onClose(); // Close the dialog after successful submission
    } catch (error) {
      console.error('Error adding module:', error.message);
      // You can handle the error state here (e.g., show an error message)
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <StyledDialogTitle className="dialogTitle">Add Module</StyledDialogTitle>
      <StyledDialogContent className="dialogContent">
        <TextField
          label="Module Name"
          value={moduleName}
          onChange={(e) => setModuleName(e.target.value)}
          fullWidth
          margin="normal"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Require Quiz</InputLabel>
          <Select
            value={quizRequired}
            onChange={(e) => setQuizRequired(e.target.value)}
          >
            <MenuItem value={false}>No</MenuItem>
            <MenuItem value={true}>Yes</MenuItem>
          </Select>
        </FormControl>
        {quizRequired && (
          <FormControl fullWidth margin="normal">
            <InputLabel>Select Quiz</InputLabel>
            <Select
              value={selectedQuiz}
              onChange={(e) => setSelectedQuiz(e.target.value)}
            >
              {topics.map(topic => (
                <MenuItem key={topic._id} value={topic._id}>{topic.topic}</MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        <TextField
          label="Start Date"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          label="End Date"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
        />
      </StyledDialogContent>
      <DialogActions>
        <Button onClick={handleSubmit} color="primary">
          Save
        </Button>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddModule;
