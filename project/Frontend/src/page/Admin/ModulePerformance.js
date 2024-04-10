import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@material-ui/core';
import Navbar from '../../component/Navbar';


const useStyles = makeStyles((theme) => ({
  heading: {
    textAlign: 'center',
    marginBottom: theme.spacing(4),
    color: 'orange',
  },
  button: {
    width: '100%',
    padding: theme.spacing(2),
    marginBottom: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
    background: theme.palette.primary.main,
    color: theme.palette.common.white,
    border: 'none',
    outline: 'none',
    '&:hover': {
      background: theme.palette.primary.dark,
    },
  },
  modulePerformance: {
    marginTop: theme.spacing(4),
  },
  moduleCard: {
    marginBottom: theme.spacing(2),
  },
  tableHeading: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    backgroundColor: 'green',
    color: 'white',
  },
}));

function ModulePerformance() {
  const classes = useStyles();
  const [moduleNames, setModuleNames] = useState([]);
  const [moduleData, setModuleData] = useState(null);
  const [selectedModuleId, setSelectedModuleId] = useState(null);

  useEffect(() => {
    async function fetchModuleNames() {
      try {
        const response = await axios.get('http://localhost:3000/api/auth/modules');
        const data = response.data;
        const names = {};
        data.modules.forEach(module => {
          names[module._id] = module.moduleName;
        });
        setModuleNames(names);
      } catch (error) {
        console.error('Error fetching module names:', error);
      }
    }

    fetchModuleNames();
  }, []);

  async function fetchModulePerformance(moduleId) {
    try {
      const response = await axios.get(`http://localhost:3000/api/auth/marks/module/${moduleId}`);
      const marksData = response.data;
      const usersData = await Promise.all(
        marksData.map(async mark => {
          const userData = await fetchUserData(mark.userId);
          if (userData) {
            return { user: userData, marks: mark.marks };
          } else {
            return null;
          }
        })
      );
      setModuleData(usersData.filter(Boolean));
    } catch (error) {
      console.error('Error fetching module performance:', error);
    }
  }

  async function fetchUserData(userId) {
    try {
      const response = await axios.get(`http://localhost:3000/api/auth/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  }

  const handleModuleClick = async (moduleId) => {
    if (selectedModuleId === moduleId) {
      setSelectedModuleId(null); // If the button is re-clicked, close the data table
    } else {
      setSelectedModuleId(moduleId);
      await fetchModulePerformance(moduleId);
    }
  };

  return (
    <div>
      <Navbar></Navbar>
    <div className={classes.modulePerformance} >
      <h1 className={classes.heading}>PERFORMANCE</h1>
      {Object.entries(moduleNames).map(([moduleId, moduleName]) => (
        <div key={moduleId} className={classes.moduleCard} style={{backgroundColor:'orange'}}>
          <Button 
            className={classes.button} 
            onClick={() => handleModuleClick(moduleId)}
            variant="contained"
            
          >
            <Typography variant="h6" >{moduleName}</Typography>
          </Button>
          {selectedModuleId === moduleId && moduleData && (
            <Card>
              <CardContent>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell className={classes.tableHeading}>User Name</TableCell>
                        <TableCell className={classes.tableHeading}>Marks</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {moduleData.map((userData, index) => (
                        <TableRow key={index}>
                          <TableCell>{userData.user.name}</TableCell>
                          <TableCell>{userData.marks}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          )}
        </div>
      ))}
    </div>
    </div>
  );
}

export default ModulePerformance;
