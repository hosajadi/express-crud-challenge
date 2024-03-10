"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Seeding...');
    const seedUser = await prisma.user.findFirst({
        where: {
            email: 'example@example.com',
        },
    });
    if (!seedUser) {
        await prisma.user.create({
            data: {
                name: 'John',
                email: 'example@example.com',
                bio: "test Bio",
                password: '$2a$09$Jrj0JK9efB6TPpsmHG8yp.hVc3Qe1d4IYpMRpPh5RT8sIBRR.DgNS', // examplePass
                createdAt: new Date(Date.now()),
            },
        });
    }
}
main()
    .catch((e) => console.error(e))
    .finally(async () => {
    await prisma.$disconnect();
});
