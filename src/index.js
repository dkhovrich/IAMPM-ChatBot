const express = require('express');
const mongoose = require('mongoose');

const port = 3000;
const app = express();

mongoose.connect('mongodb://localhost/chatbot');
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));

app.use(express.json());
app.use('/glossaries', require('./routers/glossaryRouter'));

app.listen(port, () => console.log(`Server is listening on port ${port}`));