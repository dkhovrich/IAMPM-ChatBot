import BaseError from '../baseError';

class UserAlreadyExistsError extends BaseError {
    constructor(email: string) {
        super(409, `User with email ${email} already exists`);
    }
}

export default UserAlreadyExistsError;
