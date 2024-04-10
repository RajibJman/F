import React, { useState, useEffect } from 'react';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  makeStyles,
  Grid,
  MenuItem // Import MenuItem for dropdown options
} from '@material-ui/core';
import axios from 'axios';
import Navbar from '../../component/Navbar';

const useStyles = makeStyles((theme) => ({
  dialogContent: {
    padding: theme.spacing(2),
  },
  textField: {
    marginBottom: theme.spacing(2),
  },
  tableHeader: {
    backgroundColor: 'orange',
    '& > *': {
      fontSize: '18px',
      fontWeight: 'bold',
    },
  },
  actionButtons: {
    '& > *': {
      marginRight: theme.spacing(1), // Apply right margin to buttons
    },
  },
}));

function ModuleList() {
  const classes = useStyles();
  const [modules, setModules] = useState([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [updateModuleId, setUpdateModuleId] = useState('');
  const [updateModuleName, setUpdateModuleName] = useState('');
  const [updateStartDate, setUpdateStartDate] = useState('');
  const [updateEndDate, setUpdateEndDate] = useState('');
  const [moduleName, setModuleName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [level, setLevel] = useState('basic'); // Default level value
  const [traineeCount, setTraineeCount] = useState('');

  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/api/auth/modules', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setModules(response.data.modules);
    } catch (error) {
      console.error('Error fetching modules:', error);
      alert('Failed to fetch modules. Please try again.');
    }
  };

  const handleAddOpen = () => {
    setOpenAdd(true);
  };

  const handleAddClose = () => {
    setOpenAdd(false);
  };

  const handleUpdateOpen = (id, name, startDate, endDate) => {
    setUpdateModuleId(id);
    setUpdateModuleName(name);
    setUpdateStartDate(startDate);
    setUpdateEndDate(endDate);
    setOpenUpdate(true);
  };

  const handleUpdateClose = () => {
    setOpenUpdate(false);
  };

  const addModule = async () => {
    try {
      const token = localStorage.getItem('token');
      const moduleData = {
        moduleName,
        startDate,
        endDate,
        level,
        traineeCount
      };

      await axios.post('http://localhost:3000/api/auth/addmodule', moduleData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      fetchModules();
      setOpenAdd(false);
      alert('Module added successfully!');
    } catch (error) {
      console.error('Error adding module:', error);
      alert('Failed to add module. Please try again.');
    }
  };

  const updateModule = async () => {
    try {
      const token = localStorage.getItem('token');
      const moduleData = {
        moduleName: updateModuleName,
        startDate: updateStartDate,
        endDate: updateEndDate,
        level,
        traineeCount
      };

      await axios.post(`http://localhost:3000/api/auth/modules/${updateModuleId}`, moduleData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      fetchModules();
      setOpenUpdate(false);
      alert('Module updated successfully!');
    } catch (error) {
      console.error('Error updating module:', error);
      alert('Failed to update module. Please try again.');
    }
  };

  const deleteModule = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/api/auth/modules/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setModules(prevModules => prevModules.filter(module => module._id !== id));
      alert('Module deleted successfully!');
    } catch (error) {
      console.error('Error deleting module:', error);
      alert('Failed to delete module. Please try again.');
    }
  };

  return (
    <div>
      <Navbar></Navbar>
      <Grid container alignItems="center" style={{ marginTop: '10px' }}>
        <Grid item xs>
          <Typography variant="h4" gutterBottom>Module Details</Typography>
        </Grid>
        <Grid item>
          <Button variant="contained" color="primary" onClick={handleAddOpen}>Add Module</Button>
        </Grid>
      </Grid>
      <Table>
        <TableHead>
          <TableRow className={classes.tableHeader}>
            <TableCell>Module Name</TableCell>
            <TableCell>Start Date</TableCell>
            <TableCell>End Date</TableCell>
            <TableCell>Level</TableCell>
            <TableCell>Trainee Count</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {modules.map(module => (
            <TableRow key={module._id}>
              <TableCell>{module.moduleName}</TableCell>
              <TableCell>{new Date(module.startDate).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', month: 'numeric', day: 'numeric' })}</TableCell>
              <TableCell>{new Date(module.endDate).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', month: 'numeric', day: 'numeric' })}</TableCell>
              <TableCell>{module.level}</TableCell>
              <TableCell>{module.traineeCount}</TableCell>
              <TableCell className={classes.actionButtons}>
                <Button variant="contained" color="primary" onClick={() => handleUpdateOpen(module._id, module.moduleName, module.startDate, module.endDate)}>Update</Button>
                <Button variant="contained" color="secondary" onClick={() => deleteModule(module._id)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Add Module Dialog */}
      <Dialog open={openAdd} onClose={handleAddClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Add Module</DialogTitle>
        <DialogContent className={classes.dialogContent}>
          <TextField
            className={classes.textField}
            autoFocus
            margin="dense"
            id="moduleName"
            label="Module Name"
            type="text"
            fullWidth
            value={moduleName}
            onChange={(e) => setModuleName(e.target.value)}
          />
          <TextField
            className={classes.textField}
            margin="dense"
            id="startDate"
            label="Start Date"
            type="datetime-local"
            fullWidth
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <TextField
            className={classes.textField}
            margin="dense"
            id="endDate"
            label="End Date"
            type="datetime-local"
            fullWidth
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <TextField
            className={classes.textField}
            margin="dense"
            id="level"
            select
            label="Level"
            fullWidth
            value={level}
            onChange={(e) => setLevel(e.target.value)}
          >
            <MenuItem value="basic">Basic</MenuItem>
            <MenuItem value="intermediate">Intermediate</MenuItem>
            <MenuItem value="advanced">Advanced</MenuItem>
          </TextField>
          <TextField
            className={classes.textField}
            margin="dense"
            id="traineeCount"
            label="Trainee Count"
            type="number"
            fullWidth
            value={traineeCount}
            onChange={(e) => setTraineeCount(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddClose} color="primary">
            Cancel
          </Button>
          <Button onClick={addModule} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Update Module Dialog */}
      <Dialog open={openUpdate} onClose={handleUpdateClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Update Module</DialogTitle>
        <DialogContent className={classes.dialogContent}>
          <TextField
            className={classes.textField}
            autoFocus
            margin="dense"
            id="updateModuleName"
            label="Module Name"
            type="text"
            fullWidth
            value={updateModuleName}
            onChange={(e) => setUpdateModuleName(e.target.value)}
          />
          <TextField
            className={classes.textField}
            margin="dense"
            id="updateStartDate"
            label="Start Date"
            type="datetime-local"
            fullWidth
            value={updateStartDate}
            onChange={(e) => setUpdateStartDate(e.target.value)}
          />
          <TextField
            className={classes.textField}
            margin="dense"
            id="updateEndDate"
            label="End Date"
            type="datetime-local"
            fullWidth
            value={updateEndDate}
            onChange={(e) => setUpdateEndDate(e.target.value)}
          />
          <TextField
            className={classes.textField}
            margin="dense"
            id="updateLevel"
            select
            label="Level"
            fullWidth
            value={level}
            onChange={(e) => setLevel(e.target.value)}
          >
            <MenuItem value="basic">Basic</MenuItem>
            <MenuItem value="intermediate">Intermediate</MenuItem>
            <MenuItem value="advanced">Advanced</MenuItem>
          </TextField>
          <TextField
            className={classes.textField}
            margin="dense"
            id="updateTraineeCount"
            label="Trainee Count"
            type="number"
            fullWidth
            value={traineeCount}
            onChange={(e) => setTraineeCount(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUpdateClose} color="primary">
            Cancel
          </Button>
          <Button onClick={updateModule} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default ModuleList;
