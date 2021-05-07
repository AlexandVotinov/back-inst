const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true,
    },
    name: {
        type: String,
        required: true,
        maxlength: 40
    },
    nickname: {
        type: String,
        unique: true,
        required: true,
        maxlength: 15
    },
    password: {
        type: String,
        required: true,
    },
    token: {
        type: String,
        required: false,
    },
    registrationDate: { 
        type: Date, 
        default: Date.now
    },
})


module.exports = mongoose.model('users', userSchema);