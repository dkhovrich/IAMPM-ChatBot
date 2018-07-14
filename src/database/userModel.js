const mongoose = require('mongoose');

const schema = mongoose.Schema({
    email: String,
    password: String
}, { timestamps: true });

module.exports = mongoose.model('User', schema);