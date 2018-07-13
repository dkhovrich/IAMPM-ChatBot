const mongoose = require('mongoose');
const endpoint = require('../config').databaseEndPoint;

mongoose.connect(endpoint);
mongoose.connection.on('connected', () => console.log('Mongoose default connection is opened'));
mongoose.connection.on('error', err => console.error('Mongoose default connection error', err));
mongoose.connection.on('disconnected', () => console.log('Mongoose default connection is disconnected'));

process.on('SIGINT', () => {
    mongoose.connection.close(() => {
        console.log('Mongoose default connection is disconnected due to application termination');
        process.exit(0);
    });
});