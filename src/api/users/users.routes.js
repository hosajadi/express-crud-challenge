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
const middlewares_1 = require("../../middlewares"); // Adjust the path as needed
const users_services_1 = require("./users.services"); // Adjust the path as needed
const socket_1 = require("../socket");
const errors_1 = require("../../common/errors/errors");
const router = express_1.default.Router();
router.get('/', middlewares_1.isAuthenticated, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield (0, users_services_1.getAllUsers)();
        res.json(users);
    }
    catch (err) {
        next(err);
    }
}));
router.get('/profile', middlewares_1.isAuthenticated, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.payload;
        const user = yield (0, users_services_1.findUserById)(userId);
        if (user) {
            res.json(user);
        }
        else {
            res.status(400).send(errors_1.errorsTypes.user.USER_NOT_FOUND);
        }
    }
    catch (err) {
        next(err);
    }
}));
router.post('/update', middlewares_1.isAuthenticated, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user = yield (0, users_services_1.findUserById)((_a = req.payload) === null || _a === void 0 ? void 0 : _a.userId);
        if (user) {
            const updatedUser = yield (0, users_services_1.updateUser)(user, req.body);
            res.json(updatedUser);
        }
        else {
            res.status(404).json(errors_1.errorsTypes.user.USER_NOT_FOUND);
        }
    }
    catch (err) {
        next(err);
    }
}));
router.post('/like/:id', middlewares_1.isAuthenticated, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { userId } = req.payload;
        if (id === userId) {
            res.status(400).json(errors_1.errorsTypes.user.USER_NOT_ALLOWED_LIKE_THEMSELVES);
        }
        const likedUser = yield (0, users_services_1.findUserById)(id);
        if (!likedUser) {
            res.status(404).json(errors_1.errorsTypes.user.USER_NOT_FOUND);
        }
        const userLike = yield (0, users_services_1.likeUser)(userId, id);
        if (!userLike) {
            res.status(400).json(errors_1.errorsTypes.user.USER_ALREADY_LIKE);
        }
        else {
            const targetSocketId = socket_1.userSockets.get(id);
            if (targetSocketId) {
                // websocket.to(targetSocketId).emit('likeNotification', { userId });
            }
            res.json({
                liked: true,
            });
        }
    }
    catch (error) {
        next(error);
    }
}));
router.post('/unlike/:id', middlewares_1.isAuthenticated, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { userId } = req.payload;
        const unlikedUser = yield (0, users_services_1.findUserById)(id);
        if (!unlikedUser) {
            res.status(404).json(errors_1.errorsTypes.user.USER_NOT_FOUND);
        }
        const userUnLike = yield (0, users_services_1.unlikeUser)(userId, id);
        if (!userUnLike) {
            res.status(400).json(errors_1.errorsTypes.user.USER_DID_NOT_LIKE);
        }
        else {
            res.json({
                unlike: true,
            });
        }
    }
    catch (error) {
        next(error);
    }
}));
exports.default = router;
