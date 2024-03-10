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
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Seeding...');
        const seedUser = yield prisma.user.findFirst({
            where: {
                email: 'example@example.com',
            },
        });
        if (!seedUser) {
            yield prisma.user.create({
                data: {
                    name: 'John',
                    email: 'example@example.com',
                    bio: "test Bio",
                    password: '$2a$09$Jrj0JK9efB6TPpsmHG8yp.hVc3Qe1d4IYpMRpPh5RT8sIBRR.DgNS', // examplePass
                    createdAt: new Date(Date.now()),
                },
            });
        }
    });
}
main()
    .catch((e) => console.error(e))
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}));
