// Import necessary modules
const express = require('express');
const router = express.Router();
const User = require('../models/register'); // Assuming you have a User model
const nodemailer = require('nodemailer');

// Route for forgot password page
// router.get('/forgot-password', showForgotPasswordPage);



// Function to render the forgot password page
// async function showForgotPasswordPage(req, res) {
//     res.render('forgot-password');
// }

// Function to handle forgot password form submission
async function handleForgotPasswordSubmission(req, res) {
    try {
        const { email } = req.body;

        // Look up the user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: 'No user found with that email address.' });
        }

        // Generate a random password
        const newPassword = generateRandomPassword();

        // Update user's password in the database
        user.password = newPassword; // Assuming your user schema has a field called 'password'
        await user.save();

        // Send email to the user with the new password
        // await sendNewPasswordEmail(user.email, newPassword);

        return res.status(200).json({ success: 'An email has been sent with your new password.','id':user._id });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'An error occurred while processing your request.' });
    }
}


// Function to generate random password
function generateRandomPassword() {
    const length = 10;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let newPassword = "";
    for (let i = 0; i < length; i++) {
        newPassword += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    console.log(newPassword);
    return newPassword;
}

// Function to send new password email
async function sendNewPasswordEmail(email, newPassword) {
    try {
        const transporter = nodemailer.createTransport({
            // Configure your email service provider here
            // Example for Outlook:
            service: 'outlook',
            auth: {
                user: 'rajib_demo@outlook.com', // Your email address
                pass: 'Rajib@123' // Your email password
            }
        });

        const mailOptions = {
            from: 'rajib_demo@outlook.com',
            to: email,
            subject: 'Your New Password',
            text: `Your new password: ${newPassword}`,
            html: `<b>Your new password: ${newPassword}</b>`
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId);
    } catch (error) {
        console.error('Error occurred while sending email:', error);
    }
}

module.exports = handleForgotPasswordSubmission;
