import { prisma } from "./prisma"

export const cleanupExpiredToken = async () => {
    const deleted = await prisma.blacklistedToken.deleteMany({
        where: {expiresAt: {lt: new Date()}},
    });
    console.log(`Cleaned up ${deleted.count} expired tokens`);
};