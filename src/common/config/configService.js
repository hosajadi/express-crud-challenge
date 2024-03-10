"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ConfigService {
    constructor() {
        this.envConfig = Object.keys(process.env).reduce((acc, key) => {
            const value = process.env[key];
            if (typeof value === 'string') {
                acc[key] = value;
            }
            return acc;
        }, {});
    }
    get(key) {
        const value = this.envConfig[key];
        if (!value) {
            throw new Error(`Config error - missing env.${key}`);
        }
        return value;
    }
    getWithDefault(key, defaultValue) {
        const value = this.envConfig[key] || defaultValue;
        if (!value) {
            throw new Error(`Config error - missing env.${key}`);
        }
        return value;
    }
    getNumber(key, defaultValue) {
        const value = Number(this.envConfig[key] || defaultValue);
        if (!value) {
            throw new Error(`Config error - missing env.${key}`);
        }
        return value;
    }
}
const configService = new ConfigService();
exports.default = configService;
