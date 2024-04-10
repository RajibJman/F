// middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const User = require('../models/register');

const adminAuth = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];

    // Check if token exists
    if (token) {
        // Verify JWT token
        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
            if (err) {
                console.error('JWT verification error:', err);
                res.status(401).json({ message: 'Unauthorized' });
            } else {
                // Fetch user details from database based on decoded token
                const user = await User.findById(decodedToken.userId);
                if (!user) {
                    return res.status(401).json({ message: 'Unauthorized' });
                }

                // Check if user role is admin
                if (user.role !== 'admin') {
                    return res.status(403).json({ message: 'Forbidden. Only admin can access this resource.' });
                }

                req.user = user; // Set user object in request for further use
                next(); // Proceed to next middleware or route handler
            }
        });
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
};

module.exports = { adminAuth };
