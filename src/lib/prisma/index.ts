import { Prisma, PrismaClient } from './generated';

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
	prisma = new PrismaClient({
		log: ['error'],
	});
} else {
	// @ts-expect-error @typescript-eslint/ban-ts-comment
	if (!global.prisma) {
		// @ts-expect-error @typescript-eslint/ban-ts-comment
		global.prisma = new PrismaClient({
			log: ['error'],
		});
	} // @ts-expect-error @typescript-eslint/ban-ts-comment
	prisma = global.prisma;
}

export * from './generated';
export default prisma;
