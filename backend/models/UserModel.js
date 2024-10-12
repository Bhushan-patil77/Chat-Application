const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String ,
    passwordHash: String,
});

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;