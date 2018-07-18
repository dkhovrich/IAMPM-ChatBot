import mongoose from 'mongoose';
import config from '../config';
import ValidationError from '../errors/validationError';

type Action = () => Promise<any>;

abstract class BaseService {
    protected async handleConnection(action: Action): Promise<any> {
        try {
            await mongoose.connect(config.databaseEndPoint);
            return await action();
        } catch (err) {
            throw err;
        } finally {
            await mongoose.connection.close();
        }
    }

    protected isValidString(str: string): boolean {
        return str && typeof str === 'string' && str.length !== 0;
    }
}

export default BaseService;