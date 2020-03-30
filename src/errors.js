'use strict';

function InvalidInputError(message) {
    if (!(this instanceof InvalidInputError)) {
        return new InvalidInputError(message);
    }

    this.name = 'InvalidInputError';
    this.message = message;
    this.status = 400;
}
InvalidInputError.prototype = Object.create(Error.prototype);
InvalidInputError.prototype.constructor = InvalidInputError;

/**
 *
 */
function UnauthorizedError(message) {
    if (!(this instanceof UnauthorizedError)) {
        return new UnauthorizedError(message);
    }

    this.name = 'UnauthorizedError';
    this.message = message;
    this.status = 401;
}
UnauthorizedError.prototype = Object.create(Error.prototype);
UnauthorizedError.prototype.constructor = UnauthorizedError;

/**
 *
 */
function Forbidden(message) {
    if (!(this instanceof Forbidden)) {
        return new Forbidden(message);
    }

    this.name = 'Forbidden';
    this.message = message;
    this.status = 403;
}
Forbidden.prototype = Object.create(Error.prototype);
Forbidden.prototype.constructor = Forbidden;
/**
 *
 */
function InvalidToken(message) {
    if (!(this instanceof InvalidToken)) {
        return new InvalidToken(message);
    }

    this.name = 'InvalidToken';
    this.message = message;
    this.status = 403;
}
InvalidToken.prototype = Object.create(Error.prototype);
InvalidToken.prototype.constructor = InvalidToken;

/**
 *
 */
function NotFoundError(message) {
    if (!(this instanceof NotFoundError)) {
        return new NotFoundError(message);
    }

    this.name = 'NotFoundError';
    this.message = message;
    this.status = 404;
}
NotFoundError.prototype = Object.create(Error.prototype);
NotFoundError.prototype.constructor = NotFoundError;

/**
 *
 */
function NotAllowedError(message) {
    if (!(this instanceof NotAllowedError)) {
        return new NotAllowedError(message);
    }

    this.name = 'NotAllowedError';
    this.message = message;
    this.status = 405;
}
NotAllowedError.prototype = Object.create(Error.prototype);
NotAllowedError.prototype.constructor = NotAllowedError;

function InternalServerError(message) {
    if (!(this instanceof InternalServerError)) {
        return new InternalServerError(message);
    }

    this.name = 'InternalServerError';
    this.message = message;
    this.status = 500;
}
InternalServerError.prototype = Object.create(Error.prototype);
InternalServerError.prototype.constructor = InternalServerError;

module.exports.InvalidInputError = InvalidInputError;
module.exports.UnauthorizedError = UnauthorizedError;
module.exports.InvalidToken = InvalidToken;
module.exports.NotFoundError = NotFoundError;
module.exports.NotAllowedError = NotAllowedError;
module.exports.InternalServerError = InternalServerError;
module.exports.Forbidden = Forbidden;

module.exports.wrap = function (handler) {
    return function (...args) {
        handler(...args).catch(args[args.length - 1]);
    };
};
