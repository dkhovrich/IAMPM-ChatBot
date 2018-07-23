import mongoose from 'mongoose';

type Action = () => Promise<any>;

abstract class BaseService {
    protected async handleConnection(action: Action): Promise<any> {
        try {
            await mongoose.connect(process.env.DB_HOST);
            return await action();
        } catch (err) {
            throw err;
        } finally {
            await mongoose.connection.close();
        }
    }
}

export default BaseService;