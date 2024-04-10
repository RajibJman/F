import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Paper, Table, TableHead, TableBody, TableCell, TableRow } from '@material-ui/core';
import Navbar from '../../component/Navbar';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  section: {
    margin: theme.spacing(2, 0),
    padding: theme.spacing(2),
    backgroundColor: 'orange',
    cursor: 'pointer',
    '&.expanded': {
      background: theme.palette.grey[200],
    },
  },
  heading: {
    textAlign: 'center',
    marginBottom: theme.spacing(4),
  },
  h5: {
    textAlign: 'left',
    color: 'blue',
  },
  tableHeading: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
  },
}));

const ModuleStatus = () => {
  const classes = useStyles();
  const [completedModules, setCompletedModules] = useState([]);
  const [ongoingModules, setOngoingModules] = useState([]);
  const [pendingModules, setPendingModules] = useState([]);
  const [trainingModules, setTrainingModules] = useState([]);
  const [expandedStatus, setExpandedStatus] = useState(null);
  const [trainerMap, setTrainerMap] = useState({});
  const [userRole, setUserRole] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const role = localStorage.getItem('role');
    const id = localStorage.getItem('userId');
    setUserRole(role);
    setUserId(id);

    const fetchData = async () => {
      try {
        const userResponse = await axios.get(`http://localhost:3000/api/auth/users/${userId}`);
        const userData = userResponse.data;

        const moduleIds = userData.modules.map(module => module._id);
        const modulesResponse = await axios.get('http://localhost:3000/api/auth/modules');
        const allModules = modulesResponse.data.modules || [];

        const userModules = allModules.filter(module => moduleIds.includes(module._id));

        const completed = userModules.filter(module => module.moduleStatus === 'complete');
        const ongoing = userModules.filter(module => module.moduleStatus === 'ongoing');
        const pending = userModules.filter(module => module.moduleStatus === 'pending');

        setCompletedModules(completed);
        setOngoingModules(ongoing);
        setPendingModules(pending);

        const trainerModules = allModules.filter(module =>
          module.trainer.some(trainer => trainer._id === userId)
        );
        setTrainingModules(trainerModules);

        const trainerIds = [...new Set(allModules.flatMap(module => module.trainer.map(trainer => trainer._id)))];
        const trainerResponse = await axios.get('http://localhost:3000/api/auth/allData');
        const trainers = trainerResponse.data.user.reduce((map, user) => {
          if (trainerIds.includes(user._id)) {
            map[user._id] = user.name;
          }
          return map;
        }, {});
        setTrainerMap(trainers);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (userRole === 'Employee') {
      fetchData();
    } else {
      axios.get('http://localhost:3000/api/auth/modules')
        .then(response => {
          const modules = response.data.modules || [];

          const completed = modules.filter(module => module.moduleStatus === 'complete');
          const ongoing = modules.filter(module => module.moduleStatus === 'ongoing');
          const pending = modules.filter(module => module.moduleStatus === 'pending');

          setCompletedModules(completed);
          setOngoingModules(ongoing);
          setPendingModules(pending);

          const trainerIds = [...new Set(modules.flatMap(module => module.trainer.map(trainer => trainer._id)))];

          axios.get('http://localhost:3000/api/auth/allData')
            .then(response => {
              const trainers = response.data.user.reduce((map, user) => {
                if (trainerIds.includes(user._id)) {
                  map[user._id] = user.name;
                }
                return map;
              }, {});
              setTrainerMap(trainers);
            })
            .catch(error => {
              console.error('Error fetching trainer data:', error);
            });
        })
        .catch(error => {
          console.error('Error fetching module data:', error);
        });
    }
  }, [userId, userRole]);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const formattedDate = date.toLocaleDateString();
    const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return `${formattedDate} ${formattedTime}`;
  };

  const handleSectionClick = (status) => {
    setExpandedStatus(expandedStatus === status ? null : status);
  };

  const getTrainerName = (trainerId) => {
    return trainerMap[trainerId] || 'Unknown';
  };

  return (
    <>
      <Navbar />
      <Typography variant="h3" gutterBottom className={classes.heading}>Module Status</Typography>
      <div className={classes.moduleStatus}>
        {/* Completed Modules Section */}
        <Paper className={`${classes.section} ${expandedStatus === 'completed' ? 'expanded' : ''}`} onClick={() => handleSectionClick('completed')}>
          <Typography variant="h5" gutterBottom className={`${classes.heading} ${classes.h5}`}>Completed Modules ({completedModules.length})</Typography>
          {expandedStatus === 'completed' && (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell className={classes.tableHeading}>Module Name</TableCell>
                  <TableCell className={classes.tableHeading}>Start Date</TableCell>
                  <TableCell className={classes.tableHeading}>End Date</TableCell>
                  <TableCell className={classes.tableHeading}>Trainer Name</TableCell>
                  <TableCell className={classes.tableHeading}>Level</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {completedModules.map(module => (
                  <TableRow key={module._id}>
                    <TableCell>{module.moduleName}</TableCell>
                    <TableCell>{formatDate(module.startDate)}</TableCell>
                    <TableCell>{formatDate(module.endDate)}</TableCell>
                    <TableCell>{module.trainer.map(trainer => getTrainerName(trainer._id)).join(', ')}</TableCell>
                    <TableCell>{module.level}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Paper>

        {/* Ongoing Modules Section */}
        <Paper className={`${classes.section} ${expandedStatus === 'ongoing' ? 'expanded' : ''}`} onClick={() => handleSectionClick('ongoing')}>
          <Typography variant="h5" gutterBottom className={`${classes.heading} ${classes.h5}`}>Ongoing Modules ({ongoingModules.length})</Typography>
          {expandedStatus === 'ongoing' && (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell className={classes.tableHeading}>Module Name</TableCell>
                  <TableCell className={classes.tableHeading}>Start Date</TableCell>
                  <TableCell className={classes.tableHeading}>End Date</TableCell>
                  <TableCell className={classes.tableHeading}>Trainer Name</TableCell>
                  <TableCell className={classes.tableHeading}>Level</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ongoingModules.map(module => (
                  <TableRow key={module._id}>
                    <TableCell>{module.moduleName}</TableCell>
                    <TableCell>{formatDate(module.startDate)}</TableCell>
                    <TableCell>{formatDate(module.endDate)}</TableCell>
                    <TableCell>{module.trainer.map(trainer => getTrainerName(trainer._id)).join(', ')}</TableCell>
                    <TableCell>{module.level}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Paper>

        {/* Pending Modules Section */}
        <Paper className={`${classes.section} ${expandedStatus === 'pending' ? 'expanded' : ''}`} onClick={() => handleSectionClick('pending')}>
          <Typography variant="h5" gutterBottom className={`${classes.heading} ${classes.h5}`}>Pending Modules ({pendingModules.length})</Typography>
          {expandedStatus === 'pending' && (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell className={classes.tableHeading}>Module Name</TableCell>
                  <TableCell className={classes.tableHeading}>Start Date</TableCell>
                  <TableCell className={classes.tableHeading}>End Date</TableCell>
                  <TableCell className={classes.tableHeading}>Trainer Name</TableCell>
                  <TableCell className={classes.tableHeading}>Level</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pendingModules.map(module => (
                  <TableRow key={module._id}>
                    <TableCell>{module.moduleName}</TableCell>
                    <TableCell>{formatDate(module.startDate)}</TableCell>
                    <TableCell>{formatDate(module.endDate)}</TableCell>
                    <TableCell>{module.trainer.map(trainer => getTrainerName(trainer._id)).join(', ')}</TableCell>
                    <TableCell>{module.level}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Paper>

        {/* Training Modules Section */}
        <Paper className={`${classes.section} ${expandedStatus === 'training' ? 'expanded' : ''}`} onClick={() => handleSectionClick('training')}>
          <Typography variant="h5" gutterBottom className={`${classes.heading} ${classes.h5}`}>Training Modules ({trainingModules.length})</Typography>
          {expandedStatus === 'training' && (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell className={classes.tableHeading}>Module Name</TableCell>
                  <TableCell className={classes.tableHeading}>Start Date</TableCell>
                  <TableCell className={classes.tableHeading}>End Date</TableCell>
                  <TableCell className={classes.tableHeading}>Trainer Name</TableCell>
                  <TableCell className={classes.tableHeading}>Level</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {trainingModules.map(module => (
                  <TableRow key={module._id}>
                    <TableCell>{module.moduleName}</TableCell>
                    <TableCell>{formatDate(module.startDate)}</TableCell>
                    <TableCell>{formatDate(module.endDate)}</TableCell>
                    <TableCell>{module.trainer.map(trainer => getTrainerName(trainer._id)).join(', ')}</TableCell>
                    <TableCell>{module.level}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Paper>
      </div>
    </>
  );
}

export default ModuleStatus;
