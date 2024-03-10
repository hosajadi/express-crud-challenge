"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorsTypes = void 0;
function errorFormatter(type, englishMessage, auxiliaryFields = {}) {
    return Object.assign({ type, message_en: englishMessage }, auxiliaryFields);
}
exports.errorsTypes = {
    user: {
        USER_ALREADY_EXIST: errorFormatter('user.USER_ALREADY_EXIST', 'This user with this email already exist!'),
        NOT_PROVIDE_EMAIL_PASS: errorFormatter('user.NOT_PROVIDE_EMAIL_PASS', 'You must provide an email and a password.'),
        USER_INVALID_CREDENTIAL: errorFormatter('user.USER_INVALID_CREDENTIAL', 'username or password are incorrect'),
        USER_NOT_ALLOWED_LIKE_THEMSELVES: errorFormatter('user.USER_NOT_ALLOWED_LIKE_THEMSELVES', 'Users cannot liked themselves!'),
        USER_ALREADY_LIKE: errorFormatter('user.USER_ALREADY_LIKE', 'You have already like this user!'),
        USER_DID_NOT_LIKE: errorFormatter('user.USER_DID_NOT_LIKE', 'You have not liked this user!'),
        USER_NOT_FOUND: errorFormatter('user.USER_NOT_FOUND', 'The user not found!'),
    },
};
