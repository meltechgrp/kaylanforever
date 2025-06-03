'use server';

import prisma, { CategoryType } from './prisma';

export async function getUsers() {
	try {
		const data = await prisma.user.findMany({
			include: {
				checkIn: true,
			},
			orderBy: {
				name: 'asc',
			},
		});
		return data;
	} catch (error) {
		console.log(error);
		return [];
	}
}

export type Users = Awaited<ReturnType<typeof getUsers>>;

export async function addUser({
	name,
	phone,
	guests,
	category,
	id,
}: {
	name: string;
	phone?: string;
	guests?: string;
	id?: string;
	category: CategoryType;
}) {
	try {
		if (id) {
			const res = await prisma.user.update({
				where: {
					id,
				},
				data: {
					name,
					phone,
					guests: Number(guests) ?? 0,
					category,
				},
			});
			if (res) {
				return {
					success: true,
				};
			}
		} else {
			const res = await prisma.user.create({
				data: {
					name,
					phone,
					guests: Number(guests) ?? 0,
					category,
				},
			});
			if (res) {
				return {
					success: true,
				};
			}
		}
	} catch (error) {
		console.log(error);
		return {
			error: 'Please try again',
		};
	}
}

export async function checkIn(id: string) {
	try {
		const data = await prisma.checkIn.findFirst({
			where: {
				userId: id,
			},
		});
		if (data) {
			return {
				error: 'Guest is already checked in...',
			};
		}
		const res = await prisma.checkIn.create({
			data: {
				user: {
					connect: { id: id },
				},
			},
			select: {
				user: {
					include: {
						checkIn: true,
					},
				},
			},
		});
		if (res) {
			return { data: res };
		} else {
			return {
				error: 'Guest Not Found',
			};
		}
	} catch (error) {
		console.log(error);
		return {
			error: 'Something went wrong!.. Try again.',
		};
	}
}

export type CheckIn = Awaited<ReturnType<typeof checkIn>>;

export async function deleteUser(id: string) {
	try {
		await prisma.user.delete({
			where: { id },
		});
		return true;
	} catch (error) {
		console.log(error);
		return false;
	}
}
