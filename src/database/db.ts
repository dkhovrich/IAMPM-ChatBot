import mongoose from 'mongoose';
import config from '../config';
import UserService from '../services/userService';

mongoose.connect(config.databaseEndPoint);
mongoose.connection.on('connected', async () => {
    console.log('Mongoose default connection is opened');
    await seedUsers();
});
mongoose.connection.on('error', err => console.error('Mongoose default connection error', err));
mongoose.connection.on('disconnected', () => console.log('Mongoose default connection is disconnected'));

process.on('SIGINT', () => {
    mongoose.connection.close(() => {
        console.log('Mongoose default connection is disconnected due to application termination');
        process.exit(0);
    });
});

async function seedUsers(): Promise<void> {
    try {
        await UserService.create('admin@admin.com', 'admin');
    } catch (err) {
        console.log('Admin user exists');
    }
}