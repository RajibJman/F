import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


import './PasswordResetForm.css';
import Navbar from '../component/Navbar';


function PasswordResetForm() {
    const [email, setEmail] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const navigate = useNavigate(); // Access to navigate function

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Basic validation
        if (!email || !newPassword) {
            alert('Please fill in all fields.');
            return;
        }

        try {
            // Send a POST request to reset the password
            const response = await fetch('http://localhost:3000/api/auth/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, oldPassword, newPassword })
            });

            if (response.status === 200) {
                navigate('/userdashboard');
                // alert('Password reset successful!');
                // Navigate to the user dashboard after successful password reset
            } else if (response.status === 500) {
                alert('Password did not match.');
            } else {
                alert('Password reset failed. Please try again later.');
            }
        } catch (error) {
            console.error('Error occurred during password reset:', error);
            alert('Password reset failed. Please try again later.');
        }
    };

    return (
        <div>
            <Navbar></Navbar>
        <div className="password-reset-container">
            <div className="password-reset-form">
                <h2>Password Reset</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="oldPassword">Old Password:</label>
                        <input type="password" id="oldPassword" name="oldPassword" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="newPassword">New Password:</label>
                        <input type="password" id="newPassword" name="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <button type="submit">Reset Password</button>
                    </div>
                </form>
            </div>
        </div>
        </div>
    );
}

export default PasswordResetForm;
