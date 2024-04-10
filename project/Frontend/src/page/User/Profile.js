import React, { useState, useEffect } from 'react';
import { Typography, Container, Paper, CircularProgress, TextField, Button, IconButton } from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import Navbar from '../../component/Navbar';


function UserDetailsPage() {
    const [userDetails, setUserDetails] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [newEmail, setNewEmail] = useState('');
    const [newMobile, setNewMobile] = useState('');
    const [newAddress, setNewAddress] = useState('');
    const [updating, setUpdating] = useState(false);
    const [editField, setEditField] = useState(null); // Track which field is being edited

    useEffect(() => {
        const userId = localStorage.getItem('userId');

        const fetchUserDetails = async () => {
            setLoading(true);
            try {
                const response = await fetch(`http://localhost:3000/api/auth/users/${userId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch user details');
                }
                const data = await response.json();
                setUserDetails(data);
                setNewEmail(data.email);
                setNewMobile(data.mobile);
                setNewAddress(data.address);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchUserDetails();
        } else {
            setError('User ID not found in local storage.');
        }
    }, []);

    const handleUpdate = async () => {
        setUpdating(true);
        const userId = localStorage.getItem('userId');
        try {
            const response = await fetch(`http://localhost:3000/api/auth/users/updateuser/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: newEmail,
                    mobile: newMobile,
                    address: newAddress,
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to update user details');
            }
            const updatedUserDetails = await response.json();
            setUserDetails(updatedUserDetails);
            // Show alert after successful update
            alert('User details updated successfully!');
        } catch (error) {
            setError(error.message);
        } finally {
            setUpdating(false);
            setEditField(null); // Reset edit field after update
            // Fetch updated user details again
            try {
                const response = await fetch(`http://localhost:3000/api/auth/users/${userId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch updated user details');
                }
                const data = await response.json();
                setUserDetails(data);
                setNewEmail(data.email);
                setNewMobile(data.mobile);
                setNewAddress(data.address);
            } catch (error) {
                setError(error.message);
            }
        }
    };
    
    

    const handleEdit = (field) => {
        switch (field) {
            case 'email':
                setEditField('email');
                break;
            case 'mobile':
                setEditField('mobile');
                break;
            case 'address':
                setEditField('address');
                break;
            default:
                break;
        }
    };

    return (
        <div>
            <Navbar></Navbar>
       
        <div style={{ backgroundColor: '#f5f5f5', minHeight: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Container maxWidth="sm">
                {loading && <CircularProgress style={{ margin: '20px auto' }} />}
                {error && <Typography variant="h6" color="error">{error}</Typography>}
                {userDetails && (
                    <Paper elevation={3} style={{ padding: 20, marginTop: 20, backgroundColor: '#e0f2f1', borderRadius: 10, boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)' }}>
                        <div style={{ textAlign: 'center', marginBottom: 20 }}>
                            <Typography variant="h5" gutterBottom style={{ color: '#388e3c' }}>Profile</Typography>
                        </div>
                        <div className="user-detail">
                            <Typography variant="subtitle1" style={{ marginBottom: 10 }}><strong>Name:</strong> {userDetails.name}</Typography>
                            <Typography variant="subtitle1" style={{ marginBottom: 10 }}><strong>Role:</strong> {userDetails.role}</Typography> {/* Display role as static text */}
                            <div style={{ marginBottom: 10, display: 'flex', alignItems: 'center' }}>
                                {editField === 'email' ? (
                                    <TextField
                                        label="Email"
                                        variant="outlined"
                                        fullWidth
                                        value={newEmail}
                                        onChange={(e) => setNewEmail(e.target.value)}
                                        style={{ marginRight: 10 }}
                                    />
                                ) : (
                                    <Typography variant="subtitle1" style={{ marginRight: 10 }}><strong>Email:</strong> {userDetails.email}</Typography>
                                )}
                                <IconButton onClick={() => handleEdit('email')}>
                                    <EditIcon />
                                </IconButton>
                            </div>
                            <div style={{ marginBottom: 10, display: 'flex', alignItems: 'center' }}>
                                {editField === 'mobile' ? (
                                    <TextField
                                        label="Mobile"
                                        variant="outlined"
                                        fullWidth
                                        value={newMobile}
                                        onChange={(e) => setNewMobile(e.target.value)}
                                        style={{ marginRight: 10 }}
                                    />
                                ) : (
                                    <Typography variant="subtitle1" style={{ marginRight: 10 }}><strong>Mobile:</strong> {userDetails.mobile}</Typography>
                                )}
                                <IconButton onClick={() => handleEdit('mobile')}>
                                    <EditIcon />
                                </IconButton>
                            </div>
                            <div style={{ marginBottom: 10, display: 'flex', alignItems: 'center' }}>
                                {editField === 'address' ? (
                                    <TextField
                                        label="Address"
                                        variant="outlined"
                                        fullWidth
                                        value={newAddress}
                                        onChange={(e) => setNewAddress(e.target.value)}
                                        style={{ marginRight: 10 }}
                                    />
                                ) : (
                                    <Typography variant="subtitle1" style={{ marginRight: 10 }}><strong>Address:</strong> {userDetails.address}</Typography>
                                )}
                                <IconButton onClick={() => handleEdit('address')}>
                                    <EditIcon />
                                </IconButton>
                            </div>
                            <div style={{ textAlign: 'center', marginTop: 10 }}> {/* Adjusted top margin */}
                                <Button variant="contained" color="primary" onClick={handleUpdate} disabled={updating}>
                                    {updating ? 'Updating...' : 'Update'}
                                </Button>
                            </div>
                        </div>
                    </Paper>
                )}
            </Container>
        </div>
        </div>
    );
}

export default UserDetailsPage;
