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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import RegistrationPage from '../../component/registration';
import axios from 'axios';
import Navbar from '../../component/Navbar';


const useStyles = makeStyles((theme) => ({
  tableHeader: {
    backgroundColor: 'orange',
    '& th': {
      fontSize: '1.2rem',
      fontWeight: 'bold',
    },
  },
  actionButtons: {
    '& button': {
      marginRight: theme.spacing(1), // Add margin-right between buttons
    },
  },
}));

function UserList() {
  const classes = useStyles();

  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [updateUserId, setUpdateUserId] = useState('');
  const [updateName, setUpdateName] = useState('');
  const [updateEmail, setUpdateEmail] = useState('');
  const [updateRole, setUpdateRole] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/auth/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      alert('Failed to fetch users. Please try again.');
    }
  };

  const handleUpdateOpen = (id, name, email, role) => {
    setUpdateUserId(id);
    setUpdateName(name);
    setUpdateEmail(email);
    setUpdateRole(role);
    setOpen(true);
  };

  const handleUpdateClose = () => {
    setOpen(false);
  };

  const updateUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Token not found in localStorage. Please log in again.');
        return;
      }
  
      const userData = {
        name: updateName,
        email: updateEmail,
        role: updateRole
      };
  
      await axios.post(`http://localhost:3000/api/auth/users/updateuser/${updateUserId}`, userData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      fetchUsers();
      setOpen(false);
      alert('User updated successfully!');
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Failed to update user. Please try again.');
    }
  };
  
  const deleteUser = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Token not found in localStorage. Please log in again.');
        return;
      }
      await axios.delete(`http://localhost:3000/api/auth/users/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUsers(prevUsers => prevUsers.filter(user => user._id !== id));
      alert('User deleted successfully!');
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user. Please try again.');
    }
  };

  return (
    <div>
      <Navbar></Navbar>
      <Grid container alignItems="center" style={{marginTop: '10px'}}>
        <Grid item xs>
          <Typography variant="h4" gutterBottom>User Details</Typography>
        </Grid>
        <Grid item>
          <RegistrationPage />
        </Grid>
      </Grid>
      <Table>
        <TableHead>
          <TableRow className={classes.tableHeader}>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map(user => (
            <TableRow key={user._id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell className={classes.actionButtons}>
                <Button variant="contained" color="primary" onClick={() => handleUpdateOpen(user._id, user.name, user.email, user.role)}>Update</Button>
                <Button variant="contained" color="secondary" onClick={() => deleteUser(user._id)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Update Dialog */}
      <Dialog open={open} onClose={handleUpdateClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Update User</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Name"
            type="text"
            fullWidth
            value={updateName}
            onChange={(e) => setUpdateName(e.target.value)}
          />
          <TextField
            margin="dense"
            id="email"
            label="Email Address"
            type="email"
            fullWidth
            value={updateEmail}
            onChange={(e) => setUpdateEmail(e.target.value)}
          />
          <FormControl fullWidth>
            <InputLabel id="role-label">Role</InputLabel>
            <Select
              labelId="role-label"
              id="role"
              value={updateRole}
              onChange={(e) => setUpdateRole(e.target.value)}
            >
              <MenuItem value="Intern">Intern</MenuItem>
              <MenuItem value="Employee">Employee</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUpdateClose} color="primary">
            Cancel
          </Button>
          <Button onClick={updateUser} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default UserList;
