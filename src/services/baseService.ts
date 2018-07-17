import mongoose from 'mongoose';
import config from '../config';

type Action = () => Promise<any>;

abstract class BaseService {
    async handleConnection(action: Action): Promise<any> {
        try {
            await mongoose.connect(config.databaseEndPoint);
            return await action();
        } finally {
            await mongoose.connection.close();
        }
    }
}

export default BaseService;