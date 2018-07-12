const BaseError = require('../errors/BaseError');

module.exports = function () {
    return function (err, req, res, next) {
        if (res.headersSent) {
            return next(err);
        }

        console.error(err.message);
        console.error(err.stack);

        const statusCode = err instanceof BaseError ? err.statusCode : 500;
        res.status(statusCode).send(err.message);
    };
};