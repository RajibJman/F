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

const AddUserModuleButton = styled(Button)({
  fontSize: '1.2rem',
  width: '100%',
  marginBottom: '10px',
});

function AddUserModule() {
  const [users, setUsers] = useState([]);
  const [modules, setModules] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedModule, setSelectedModule] = useState("");
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    fetchUserData();
    fetchModuleData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch("http://localhost:3000/api/auth/allData", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      const filteredUsers = data.user.filter(user => user.role === 'Employee');
      setUsers(filteredUsers);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchModuleData = async () => {
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

  const addUserModule = async () => {
    if (selectedUser && selectedModule) {
      const token = localStorage.getItem('token');
      const requestBody = {
        selectedUser_id: selectedUser,
        selectedModule_id: selectedModule
      };

      try {
        const response = await fetch('http://localhost:3000/api/auth/addusermodule', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          let errorMessage = 'Unknown error occurred';
          if (response.status === 400) {
            errorMessage = 'Module already added to user';
          } else if (response.status === 404) {
            errorMessage = 'User not found';
          } else if (response.status === 500) {
            errorMessage = 'Internal server error';
          }
          throw new Error(errorMessage);
        }

        const data = await response.json();
        console.log('Module added for user:', data);
        alert('Module added successfully');
        setSelectedUser("");
        setSelectedModule("");
        handleDialogClose();
      } catch (error) {
        console.error('Error adding module:', error.message);
        alert(error.message);
      }
    } else {
      alert('Please select a user and a module.');
    }
  };

  return (
    <div>
      <AddUserModuleButton variant="contained" color="primary" onClick={handleDialogOpen}>
        Add User Module
      </AddUserModuleButton>
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Add Module for User</DialogTitle>
        <DialogContent>
          <StyledFormControl>
            <InputLabel id="userDropdownLabel">Select User</InputLabel>
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
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <OrangeButton onClick={addUserModule} color="primary">
            Add Module
          </OrangeButton>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default AddUserModule;
