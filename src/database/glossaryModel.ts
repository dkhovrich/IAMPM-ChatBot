import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    title: String
}, { timestamps: true });

export default mongoose.model('Glossary', schema);