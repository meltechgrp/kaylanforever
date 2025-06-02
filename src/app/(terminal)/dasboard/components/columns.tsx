'use client';

import { DataTableColumnHeader } from '@/components/shared/data-table-column-header';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns/format';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const columns: ColumnDef<any>[] = [
	{
		id: 'name',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Guest Name" />
		),
		enableSorting: false,
		enableHiding: false,
		cell({ row }) {
			const member = row.original.user;
			const name = `${member?.first_name || ''} ${member?.last_name || ''} `;
			return (
				<div className="flex space-x-2">
					<Avatar className="h-10 w-10">
						<AvatarFallback className=" uppercase">
							{member?.first_name?.charAt(0) || ''}
							{member?.last_name?.charAt(0) || ''}
						</AvatarFallback>
					</Avatar>
					<Link href={`#`} className=" hover:underline">
						<div className="text-sm font-medium capitalize text-foreground">
							{name}
						</div>
						<div className="text-sm text-foreground">
							<span className="truncate">{member.phone_number}</span>
						</div>
					</Link>
				</div>
			);
		},
		filterFn: (row, id, value) => {
			const member = row.original.user;

			const firstName = member.first_name || '';
			const lastName = member.last_name || '';
			const email = member.email || '';
			const phoneNumber = member.phone_number || '';
			const newRegex = new RegExp(value, 'ig');
			return (
				newRegex.test(firstName) ||
				newRegex.test(lastName) ||
				newRegex.test(phoneNumber) ||
				newRegex.test(email)
			);
		},
	},
	{
		accessorKey: 'created',
		header: () => <span className="hidden md:flex">Attendees</span>,
		cell({ row }) {
			const createdAt = row.original?.scan_time;
			return (
				<time className="text-sm text-foreground ml-auto hidden md:flex">
					{createdAt
						? format(new Date(createdAt), 'MMM d, yyyy,  hh:mm a')
						: 'N/A'}
				</time>
			);
		},
	},
	{
		accessorKey: 'amount',
		header: () => <span className="hidden md:flex">Protocol</span>,
		cell({ row }) {
			const amount = row.original?.purchase?.amount_spent;
			return <span className="text-sm  hidden md:flex capitalize"></span>;
		},
	},
];
