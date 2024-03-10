"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.websocket = void 0;
const app_1 = __importDefault(require("./app"));
const http_1 = require("http");
const socket_1 = require("./api/socket");
const configService_1 = __importDefault(require("./common/config/configService"));
const port = configService_1.default.getNumber('APP_PORT', 5001);
// const httpServer = createServer(app);
app_1.default.listen(port, () => {
    console.log(`Listening: http://localhost:${port}`);
});
exports.websocket = (0, socket_1.initializeSocket)((0, http_1.createServer)(app_1.default));
