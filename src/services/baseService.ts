import mongoose, { Model, Document } from 'mongoose';
import { Response } from '../models/responseDto';

type Action = () => Promise<any>;
type ConvertFunc<T extends Document, T1> = (source: T) => T1;

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

    protected async findWithPagination<T extends Document, T1>(model: Model<T>, condition: any, pageNumber: number, pageSize: number, convert: ConvertFunc<T, T1>): Promise<Response<T1>> {
        const skipCount = (pageNumber - 1) * pageSize;

        const [items, total] = await Promise.all([
            model.find(condition).skip(skipCount).limit(pageSize),
            model.count(condition)
        ]);

        return new Response(pageNumber, pageSize, total, items.map(convert));
    }
}

export default BaseService;