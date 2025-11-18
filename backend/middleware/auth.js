const jwt = require('jsonwebtoken');
const User = require('../models/User');


module.exports = async (req, res, next) => {
try {
const header = req.header('Authorization');
if (!header) return res.status(401).json({ message: 'No token provided' });
const token = header.replace('Bearer ', '');
const decoded = jwt.verify(token, process.env.JWT_SECRET || 'verysecret');
const user = await User.findById(decoded.id).select('-password');
if (!user) return res.status(401).json({ message: 'Invalid token' });
req.user = user;
next();
} catch (err) {
res.status(401).json({ message: 'Authentication failed' });
}
};