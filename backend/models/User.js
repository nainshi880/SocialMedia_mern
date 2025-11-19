const mongoose = require('mongoose');
const crypto = require('crypto');


const userSchema = new mongoose.Schema({
username: { type: String, required: true, unique: true },
email: { type: String, required: true, unique: true },
password: { type: String, required: true },
resetPasswordToken: String,
resetPasswordExpires: Date
}, { timestamps: true });


userSchema.methods.createPasswordResetToken = function() {
const token = crypto.randomBytes(32).toString('hex');
this.resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');
this.resetPasswordExpires = Date.now() + 1000 * 60 * 60;
return token;
};


module.exports = mongoose.model('User', userSchema);