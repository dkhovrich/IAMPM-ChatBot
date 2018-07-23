import mongoose from 'mongoose';
import UserService from '../services/userService';

process.on('SIGINT', () => {
    mongoose.connection.close(() => {
        console.log('Mongoose default connection is disconnected due to application termination');
        process.exit(0);
    });
});

(async () => {
    try {
        await UserService.create({
            email: process.env.ADMIN_EMAIL,
            password: process.env.ADMIN_PASSWORD
        });
    } catch (err) {
        console.log('Admin user exists');
    }
})();