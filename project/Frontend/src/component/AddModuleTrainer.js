import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledFormControl = styled(FormControl)({
  minWidth: 200,
  marginBottom: 16,
});

const OrangeButton = styled(Button)({
  backgroundColor: '#ff9800',
  fontSize: '1.2rem',
  width: '100%',
  marginBottom: '10px',
});

const AddModuleTrainer = () => {
  const [users, setUsers] = useState([]);
  const [modules, setModules] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedModule, setSelectedModule] = useState("");
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3000/api/auth/allData")
      .then((response) => response.json())
      .then((data) => {
        const filteredUsers = data.user.filter(user => user.role === 'Employee');
        setUsers(filteredUsers);
      })
      .catch((error) => console.error("Error fetching trainer data:", error));
  
    fetch("http://localhost:3000/api/auth/modules")
      .then((response) => response.json())
      .then((data) => setModules(data.modules))
      .catch((error) => console.error("Error fetching module data:", error));
  }, []);

  const handleUserChange = (event) => {
    setSelectedUser(event.target.value);
  };

  const handleModuleChange = (event) => {
    setSelectedModule(event.target.value);
  };

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const addModuleTrainer = async () => {
    if (selectedUser && selectedModule) {
      const token = localStorage.getItem('token');
      const requestBody = {
        selectedUser_id: selectedUser,
        selectedModule_id: selectedModule
      };

      try {
        const response = await fetch('http://localhost:3000/api/auth/moduletrainer', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(requestBody),
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Trainer added to module:', data);
          alert('Trainer added successfully');
          setSelectedUser("");
          setSelectedModule("");
          handleDialogClose();
        } else {
          const errorMessage = await response.text();
          switch (response.status) {
            case 400:
              throw new Error('Module already added to user');
            case 404:
              throw new Error('User not found');
            case 500:
              throw new Error('Internal server error');
            default:
              throw new Error(`Failed to add trainer to module: ${errorMessage}`);
          }
        }
      } catch (error) {
        console.error('Error adding trainer to module:', error.message);
        alert(error.message);
      }
    } else {
      alert('Please select a trainer and a module');
    }
  };

  return (
    <div>
      <OrangeButton variant="contained" color="primary" onClick={handleDialogOpen}>
        Add Module Trainer
      </OrangeButton>
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Add Trainer for Module</DialogTitle>
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
            <InputLabel id="userDropdownLabel">Select Trainer</InputLabel>
            <Select
              labelId="userDropdownLabel"
              id="userDropdown"
              value={selectedUser}
              onChange={handleUserChange}
              fullWidth
            >
              {users.map((user) => (
                <MenuItem key={user._id} value={user._id}>
                  {user.name}
                </MenuItem>
              ))}
            </Select>
          </StyledFormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <OrangeButton onClick={addModuleTrainer} color="primary">
            Add Trainer
          </OrangeButton>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddModuleTrainer;
