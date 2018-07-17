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
        await UserService.create('admin@admin.com', 'admin');
    } catch (err) {
        console.log('Admin user exists');
    }
})();