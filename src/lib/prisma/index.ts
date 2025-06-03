import { Prisma, PrismaClient } from './generated/edge';

const prisma = new PrismaClient();

export * from './generated';
export default prisma;
