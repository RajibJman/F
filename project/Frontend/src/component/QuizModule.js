import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledFormControl = styled(FormControl)({
  minWidth: 200,
  marginBottom: 16,
});

const OrangeButton = styled(Button)({
  fontSize: '1.2rem',
  width: '100%',
  marginBottom: '10px',
});

function QuizModule() {
  const [modules, setModules] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [selectedModule, setSelectedModule] = useState("");
  const [selectedQuiz, setSelectedQuiz] = useState("");
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    fetchModules();
    fetchQuizzes();
  }, []);

  const fetchModules = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch("http://localhost:3000/api/auth/modules", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setModules(data.modules);
    } catch (error) {
      console.error("Error fetching module data:", error);
    }
  };

  const fetchQuizzes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch("http://localhost:3000/api/auth/alltopics", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setQuizzes(data);
    } catch (error) {
      console.error("Error fetching quiz data:", error);
    }
  };

  const handleModuleChange = (event) => {
    setSelectedModule(event.target.value);
  };

  const handleQuizChange = (event) => {
    setSelectedQuiz(event.target.value);
  };

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const addModuleQuiz = async () => {
    if (selectedModule && selectedQuiz) {
      const token = localStorage.getItem('token');
      const requestBody = {
        moduleId: selectedModule,
        quizId: selectedQuiz
      };

      try {
        const response = await fetch('http://localhost:3000/api/auth/modulequiz', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          throw new Error('Failed to add quiz to module');
        }

        const data = await response.json();
        console.log('Quiz added to module:', data);
        alert('Quiz added successfully');
        setSelectedModule("");
        setSelectedQuiz("");
        handleDialogClose();
      } catch (error) {
        console.error('Error adding quiz to module:', error);
        alert('Failed to add quiz to module');
      }
    } else {
      alert('Please select a module and a quiz');
    }
  };

  return (
    <div>
      <OrangeButton variant="contained" color="primary" onClick={handleDialogOpen}>
        Add Module Quiz
      </OrangeButton>
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Add Quiz For Module</DialogTitle>
        <DialogContent>
          <StyledFormControl>
            <InputLabel id="moduleDropdownLabel">Select Module</InputLabel>
            <Select
              labelId="moduleDropdownLabel"
              id="moduleDropdown"
              value={selectedModule}
              onChange={handleModuleChange}
              fullWidth
            >
              {modules.map((module) => (
                <MenuItem key={module._id} value={module._id}>
                  {module.moduleName}
                </MenuItem>
              ))}
            </Select>
          </StyledFormControl>
          <StyledFormControl>
            <InputLabel id="quizDropdownLabel">Select Quiz Topic</InputLabel>
            <Select
              labelId="quizDropdownLabel"
              id="quizDropdown"
              value={selectedQuiz}
              onChange={handleQuizChange}
              fullWidth
            >
              {quizzes.map((quiz) => (
                <MenuItem key={quiz._id} value={quiz._id}>
                  {quiz.topic}
                </MenuItem>
              ))}
            </Select>
          </StyledFormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={addModuleQuiz} color="primary">
            Add Quiz
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default QuizModule;
