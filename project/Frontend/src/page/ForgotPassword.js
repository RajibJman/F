import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Grid, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
// import './ForgotPassword.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3000/api/auth/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });
            const data = await response.json();
            // console.log(data);
            if (response.ok) {
                setMessage(data.success);
                // Update checkreset to false in the database
                const resp = await fetch(`http://localhost:3000/api/auth/users/updateuser/${data.id}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ 'checkreset': 'false' })
                });
                const data1 = await resp.json();
            console.log(data1);
                // Show alert after successfully sending email
                alert('Password reset email sent successfully.');
                // Navigate to "/" after successful submission
                navigate("/");
            } else {
                setError(data.error);
            }
        } catch (error) {
            console.error('Error:', error);
            setError('An error occurred while processing your request.');
        }
    };

    return (
        <Container maxWidth="xs">
            <Box sx={{ border: '1px solid #ccc', padding: '20px', borderRadius: '5px' }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="h5" align="center">Forgot Password</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        {error && <Typography color="error">{error}</Typography>}
                        {message && <Typography color="success">{message}</Typography>}
                        <form onSubmit={handleSubmit}>
                            <TextField
                                fullWidth
                                id="email"
                                label="Email"
                                type="email"
                                variant="outlined"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                sx={{ mt: 2 }}
                            >
                                Submit
                            </Button>
                        </form>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};

export default ForgotPassword;
