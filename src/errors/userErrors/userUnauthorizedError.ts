import BaseError from '../baseError';

class UserUnauthorizedError extends BaseError {
    constructor(email: string) {
        super(401, `User with email ${email} is not authorized`);
    }
}

export default UserUnauthorizedError;