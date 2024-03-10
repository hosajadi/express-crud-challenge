"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_routes_1 = __importDefault(require("./auth/auth.routes")); // Adjust the path as needed
const users_routes_1 = __importDefault(require("./users/users.routes")); // Adjust the path as needed
const router = express_1.default.Router();
router.get('/', (req, res) => {
    res.json({
        message: 'API - 👋🌎🌍🌏'
    });
});
router.use('/auth', auth_routes_1.default);
router.use('/users', users_routes_1.default);
exports.default = router;
