import { PrismaClient } from '@/lib/prisma';
import guests from '@/assets/grouped_guests_by_source.json';
const prisma = new PrismaClient();

async function main() {
	const categories = { CITY: 'CITY', HOUSE: 'HOUSE', FAMILY: 'FAMILY' };

	for (const category in categories) {
		for (const guest of guests[category as keyof typeof categories] ?? []) {
			await prisma.user.create({
				data: {
					name: guest.name,
					phone: guest.phone ?? '',
					guests: guest.guests?.length ?? 0,
					category: category as any,
				},
			});
		}
	}
}

main()
	.then(() => console.log('Seed completed'))
	.catch(console.error)
	.finally(() => prisma.$disconnect());
