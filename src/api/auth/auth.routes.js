"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const uuid_1 = require("uuid");
const users_services_1 = require("../users/users.services");
const jwt_1 = require("../../utils/jwt");
const auth_services_1 = require("./auth.services");
const hashToken_1 = require("../../utils/hashToken");
const errors_1 = require("../../common/errors/errors");
const router = express_1.default.Router();
router.post('/register', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, avatars, name } = req.body;
        if (!email || !password) {
            res.status(400).send(errors_1.errorsTypes.user.NOT_PROVIDE_EMAIL_PASS);
            return;
        }
        const existingUser = yield (0, users_services_1.findUserByEmail)(email);
        if (existingUser) {
            res.status(400).send(errors_1.errorsTypes.user.USER_ALREADY_EXIST);
            return;
        }
        const user = yield (0, users_services_1.createUserByEmailAndPassword)({ email, password, avatars, name });
        const jti = (0, uuid_1.v4)();
        const { accessToken, refreshToken } = (0, jwt_1.generateTokens)(user, jti);
        yield (0, auth_services_1.addRefreshTokenToWhitelist)({ jti, refreshToken, userId: user.id });
        res.json({
            accessToken,
            refreshToken,
        });
    }
    catch (err) {
        next(err);
    }
}));
router.post('/login', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).send(errors_1.errorsTypes.user.NOT_PROVIDE_EMAIL_PASS);
            return;
        }
        const existingUser = yield (0, users_services_1.findUserByEmail)(email);
        if (!existingUser) {
            res.status(404).send(errors_1.errorsTypes.user.USER_NOT_FOUND);
            return;
        }
        const validPassword = yield bcrypt_1.default.compare(password, existingUser.password);
        if (!validPassword) {
            res.status(403).send(errors_1.errorsTypes.user.USER_INVALID_CREDENTIAL);
            return;
        }
        const jti = (0, uuid_1.v4)();
        const { accessToken, refreshToken } = (0, jwt_1.generateTokens)(existingUser, jti);
        yield (0, auth_services_1.addRefreshTokenToWhitelist)({ jti, refreshToken, userId: existingUser.id });
        res.json({
            accessToken,
            refreshToken,
        });
    }
    catch (err) {
        next(err);
    }
}));
router.post('/refreshToken', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            res.status(400).send('Missing refresh token.');
            return;
        }
        const payload = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const savedRefreshToken = yield (0, auth_services_1.findRefreshTokenById)(payload.jti);
        if (!savedRefreshToken || savedRefreshToken.revoked) {
            res.status(401).send('Unauthorized');
            return;
        }
        const hashedToken = (0, hashToken_1.hashToken)(refreshToken);
        if (hashedToken !== savedRefreshToken.hashedToken) {
            res.status(401).send('Unauthorized');
            return;
        }
        const user = yield (0, users_services_1.findUserById)(payload.userId);
        if (!user) {
            res.status(401).send('Unauthorized');
            return;
        }
        yield (0, auth_services_1.deleteRefreshToken)(savedRefreshToken.id);
        const jti = (0, uuid_1.v4)();
        const { accessToken, refreshToken: newRefreshToken } = (0, jwt_1.generateTokens)(user, jti);
        yield (0, auth_services_1.addRefreshTokenToWhitelist)({ jti, refreshToken: newRefreshToken, userId: user.id });
        res.json({
            accessToken,
            refreshToken: newRefreshToken,
        });
    }
    catch (err) {
        next(err);
    }
}));
// This endpoint is only for demo purposes.
// Move this logic where you need to revoke the tokens (for example, on password reset)
router.post('/revokeRefreshTokens', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.body;
        yield (0, auth_services_1.revokeTokens)(userId);
        res.json({ message: `Tokens revoked for user with id #${userId}` });
    }
    catch (err) {
        next(err);
    }
}));
exports.default = router;
