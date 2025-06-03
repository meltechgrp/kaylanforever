import { Prisma, PrismaClient } from './generated/edge';

import { withAccelerate } from '@prisma/extension-accelerate';

const prisma = new PrismaClient().$extends(withAccelerate());

export * from './generated';
export default prisma;
