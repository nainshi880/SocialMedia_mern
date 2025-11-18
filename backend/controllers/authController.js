const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
try {
const { username, email, password } = req.body;
const existing = await User.findOne({ $or: [{ email }, { username }] });
if (existing) return res.status(400).json({ message: 'Email or username already exists' });
const hashed = await bcrypt.hash(password, 10);
const user = new User({ username, email, password: hashed });
await user.save();
res.status(201).json({ message: 'User created' });
} catch (err) {
res.status(500).json({ message: err.message });
}
};


exports.login = async (req, res) => {
try {
const { username, password } = req.body;
const user = await User.findOne({ username });
if (!user) return res.status(400).json({ message: 'Invalid credentials' });
const ok = await bcrypt.compare(password, user.password);
if (!ok) return res.status(400).json({ message: 'Invalid credentials' });
const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'verysecret', { expiresIn: '7d' });
res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
} catch (err) {
res.status(500).json({ message: err.message });
}
};


exports.forgotPassword = async (req, res) => {
try {
const { email } = req.body;
const user = await User.findOne({ email });
if (!user) return res.status(400).json({ message: 'No user with that email' });
const resetToken = user.createPasswordResetToken();
await user.save();
const resetUrl = `${req.protocol}://${req.get('host').replace(':5000', ':5173')}/reset-password/${resetToken}`;
// In production: send resetUrl by email using nodemailer / SendGrid
res.json({ message: 'Password reset token created', resetUrl });
} catch (err) {
res.status(500).json({ message: err.message });
}
};


exports.resetPassword = async (req, res) => {
try {
const { token } = req.params;
const hashed = require('crypto').createHash('sha256').update(token).digest('hex');
const user = await User.findOne({ resetPasswordToken: hashed, resetPasswordExpires: { $gt: Date.now() } });
if (!user) return res.status(400).json({ message: 'Token is invalid or expired' });
const { password } = req.body;
user.password = await bcrypt.hash(password, 10);
user.resetPasswordToken = undefined;
user.resetPasswordExpires = undefined;
await user.save();
res.json({ message: 'Password reset successful' });
} catch (err) {
res.status(500).json({ message: err.message });
}
};