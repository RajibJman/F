const nodemailer = require('nodemailer');
const User = require('../models/register');

// Function to generate a random password
const generateRandomPassword = () => {
    const length = 8; // You can adjust the length of the generated password
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let password = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    return password;
};

// Create a new user
exports.createUser = async (req, res) => {
    const { name, email, role } = req.body;

    try {
        // Check if user already exists with the provided email
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        // Generate a random password
        const password = generateRandomPassword();

        // Create a new user
        const user = new User({
            name,
            email: email.toLowerCase(),
            password,
            role
        });

        // Save the user to the database
        await user.save();

        // Send email with random password
        const transporter = nodemailer.createTransport({
            // Configure your email service provider here
            // Example for Gmail:
            service: 'outlook',
            auth: {
                user: 'rajib_demo@outlook.com', // Your email address
                pass: 'Rajib@123' // Your email password
            }
        });

        const mailOptions = {
            from: 'rajib_demo@outlook.com',
            to: email,
            subject: 'Your Account Details',
            text: `Hello ${name},\n\nYour account has been successfully registered.\n\nEmail: ${email}\nPassword: ${password}\n\nThank you.`
        };

        await transporter.sendMail(mailOptions);

        res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        console.error('Error getting users:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get user by ID
exports.getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error('Error getting user by ID:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Update user
exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email, role, checkreset, mobile, address } = req.body;

    console.log(req.body);

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update user data conditionally
        user.name = name || user.name;
        user.email = email || user.email;
        user.role = role || user.role;
        user.checkreset = checkreset || user.checkreset;
        // Add updates for mobile and address
        user.mobile = mobile || user.mobile;
        user.address = address || user.address;

        // Save the updated user
        const updatedUser = await user.save();

        res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};



// Delete user
exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully', user });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
