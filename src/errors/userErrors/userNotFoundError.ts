import BaseError from '../baseError';

class UserNotFoundError extends BaseError {
    constructor(data: string) {
        super(404, `User with id or email ${data} not found`);
    }
}

export default UserNotFoundError;