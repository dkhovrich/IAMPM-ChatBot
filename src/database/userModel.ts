import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    email: String,
    password: String
}, { timestamps: true });

export default mongoose.model('User', schema);