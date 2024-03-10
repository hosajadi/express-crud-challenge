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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unlikeUser = exports.likeUser = exports.updateUser = exports.getAllUsers = exports.createUserByEmailAndPassword = exports.findUserById = exports.findUserByEmail = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const db_1 = require("../../utils/db"); // Adjust the path as needed
// Assuming `email` is a string and the function returns a Promise of a User or null
function findUserByEmail(email) {
    return db_1.db.user.findUnique({
        where: {
            email,
        },
    });
}
exports.findUserByEmail = findUserByEmail;
function createUserByEmailAndPassword(payload) {
    const hashedPassword = bcrypt_1.default.hashSync(payload.password, 9);
    const userData = {};
    userData.name = payload.name;
    userData.email = payload.email;
    userData.password = hashedPassword;
    if (payload.avatars && payload.avatars.length > 0) {
        const data = [];
        for (const avatar of payload.avatars) {
            data.push({
                original: avatar,
            });
        }
        userData.avatars = {
            createMany: {
                data: data,
            },
        };
    }
    return db_1.db.user.create({
        data: Object.assign({}, userData),
    });
}
exports.createUserByEmailAndPassword = createUserByEmailAndPassword;
function findUserById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield db_1.db.user.findUnique({
            where: {
                id,
            },
        });
        if (user) {
            const { password } = user, withoutPassword = __rest(user, ["password"]);
            return withoutPassword;
        }
        return user;
    });
}
exports.findUserById = findUserById;
function updateUser(user, data) {
    return __awaiter(this, void 0, void 0, function* () {
        const { name, bio, latitude, longitude } = data;
        const updatedUser = yield db_1.db.user.update({
            where: {
                id: user.id,
            },
            data: {
                name: name !== null && name !== void 0 ? name : user.name,
                bio,
                latitude,
                longitude,
            },
            include: {
                avatars: true,
            },
        });
        const { password } = updatedUser, withoutPassword = __rest(updatedUser, ["password"]);
        return withoutPassword;
    });
}
exports.updateUser = updateUser;
function getAllUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        const users = yield db_1.db.user.findMany();
        const finalResult = [];
        for (const user of users) {
            const { password } = user, withoutPassword = __rest(user, ["password"]);
            finalResult.push(withoutPassword);
        }
        return finalResult;
    });
}
exports.getAllUsers = getAllUsers;
function likeUser(likerId, likedId) {
    return __awaiter(this, void 0, void 0, function* () {
        const userLike = yield db_1.db.userLike.findFirst({
            where: {
                liker_id: likerId,
                user_id: likedId,
            }
        });
        if (userLike) {
            return false;
        }
        yield db_1.db.userLike.create({
            data: {
                liker: {
                    connect: {
                        id: likerId,
                    },
                },
                user: {
                    connect: {
                        id: likedId,
                    },
                },
            },
        });
        return true;
    });
}
exports.likeUser = likeUser;
function unlikeUser(likerId, likedId) {
    return __awaiter(this, void 0, void 0, function* () {
        const userLike = yield db_1.db.userLike.findFirst({
            where: {
                liker_id: likerId,
                user_id: likedId,
            }
        });
        if (!userLike) {
            return false;
        }
        yield db_1.db.userLike.delete({
            where: {
                id: userLike.id,
            }
        });
        return true;
    });
}
exports.unlikeUser = unlikeUser;
