"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = exports.errorHandler = exports.notFound = void 0;
const jwt = __importStar(require("jsonwebtoken"));
function notFound(req, res, next) {
    res.status(404);
    const error = new Error(`🔍 - Not Found - ${req.originalUrl}`);
    next(error);
}
exports.notFound = notFound;
function errorHandler(err, req, res, next) {
    const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
    res.status(statusCode);
    res.json({
        message: err.message,
        // Assuming process.env.NODE_ENV is a string or undefined.
        stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
    });
}
exports.errorHandler = errorHandler;
function isAuthenticated(req, res, next) {
    const authorization = req.headers.authorization;
    if (!authorization) {
        res.status(401);
        throw new Error('🚫 Un-Authorized 🚫');
    }
    try {
        const token = authorization.split(' ')[1];
        // You need to specify the secret's type or make sure it's available in the environment variables
        const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        // You might need to extend the Request type to include payload or use any here
        req.payload = payload;
    }
    catch (err) { // Catching anything throws and treating it as any to access its properties
        res.status(401);
        if (err.name === 'TokenExpiredError') {
            throw new Error(err.name);
        }
        throw new Error('🚫 Un-Authorized 🚫');
    }
    return next();
}
exports.isAuthenticated = isAuthenticated;
