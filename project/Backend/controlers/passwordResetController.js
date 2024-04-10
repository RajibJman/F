const User = require('../models/register');

exports.resetPassword = async (req, res) => {
    const { email,oldPassword, newPassword } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ email });
        console.log(user)
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update user's password
        if(user.password==oldPassword)
        {
            user.password = newPassword;

            user.checkreset=true;  
            await user.save();

        res.status(200).json({ message: 'Password reset successfully' });
        }
        else{
            res.status(500).json({ message: 'Password didnot matched' });
        }

        
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
