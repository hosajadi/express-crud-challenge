class ConfigService {
    private readonly envConfig: { [key: string]: string };

    constructor() {
        this.envConfig = Object.keys(process.env).reduce((acc, key) => {
            const value = process.env[key];
            if (typeof value === 'string') {
                acc[key] = value;
            }
            return acc;
        }, {} as { [key: string]: string });
    }

    get(key: string): string {
        const value  = this.envConfig[key];
        if (!value) {
            throw new Error(`Config error - missing env.${key}`);
        }
        return value;
    }
    getWithDefault(key: string, defaultValue: string): string {
        const value = this.envConfig[key] || defaultValue;
        if (!value) {
            throw new Error(`Config error - missing env.${key}`);
        }
        return value;
    }
    getNumber(key: string, defaultValue: number): number {
        const value = Number(this.envConfig[key] || defaultValue);
        if (!value) {
            throw new Error(`Config error - missing env.${key}`);
        }
        return value;
    }
}

const configService = new ConfigService();
export default configService;
