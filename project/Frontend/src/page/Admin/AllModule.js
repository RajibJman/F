import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, List, ListItem, ListItemText, Typography, Box } from '@mui/material';
import './AllModule.css'; // Import CSS file\
import { useNavigate } from 'react-router-dom';
import Navbar from '../../component/Navbar';



function AllModule() {
  const [modules, setModules] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchModules() {
      try {
        const response = await axios.get('http://localhost:3000/api/auth/modules');
        setModules(response.data.modules);
      } catch (error) {
        console.error('Error fetching modules:', error);
      }
    }

    fetchModules();
  }, []);

  const handleButtonClick = (moduleId, quizId) => {
    // Handle button click for a module
    console.log('Button clicked for module ID:', moduleId);
    console.log('Associated quiz ID:', quizId);
    localStorage.setItem('moduleId', moduleId);
    localStorage.setItem('quizId', quizId);

      // Navigate to '/quiz'
      navigate('/quiz');
  };

  return (
    <div>
      <Navbar></Navbar>
    <div className="container"> {/* Apply container class */}
      <Box className="heading" mb={2}>
        <Typography variant="h3">Assessment</Typography> {/* Apply heading class */}
      </Box>
      <List>
        {modules.map(module => (
          <ListItem className="listItem" key={module._id}> {/* Apply listItem class */}
            <ListItemText  primary={<strong>{module.moduleName}</strong>} />
            <Button className="button" variant="contained" onClick={() => handleButtonClick(module._id, module.quizId)}>Start</Button> {/* Apply button class */}
          </ListItem>
        ))}
      </List>
    </div>
    </div>
  );
}

export default AllModule;
