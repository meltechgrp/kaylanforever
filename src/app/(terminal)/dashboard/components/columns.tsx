'use client';

import { DataTableColumnHeader } from '@/components/shared/data-table-column-header';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns/format';
import { deleteUser, UnCheck, Users } from '@/lib/actions';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { QRCodeCanvas } from 'qrcode.react';
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from '@/components/ui/drawer';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useMemo, useRef, useState } from 'react';
import { AddGuest } from './add-guest';
import { useRouter } from 'next/navigation';
import { Loader } from 'lucide-react';
import { toast } from 'sonner';

export const columns: ColumnDef<Users[0]>[] = [
	{
		id: 'name',
		header: ({ column }) => (
			<DataTableColumnHeader
				column={column}
				className="px-2 md:px-4 text-nowrap"
				title="Guest Name"
			/>
		),
		enableSorting: false,
		enableHiding: false,
		cell({ row }) {
			const member = row.original;
			const name = member.name;
			return (
				<div className="flex flex-col space-x-2 px-2 md:px-4">
					<div className="text-sm text-nowrap font-medium capitalize text-foreground">
						{name}
					</div>
					<div className="text-xs text-nowrap text-foreground">
						<span className="">{member?.phone ?? 'N/A'}</span>
					</div>
				</div>
			);
		},
		filterFn: (row, id, value) => {
			const member = row.original;

			const name = member.name || '';
			const phone = member.phone || '';
			const newRegex = new RegExp(value, 'ig');
			return newRegex.test(name) || newRegex.test(phone);
		},
	},
	{
		accessorKey: 'guests',
		header: () => <span className="text-nowrap">No of Guests</span>,
		cell({ row }) {
			const count = row.original.guests;
			return <span>{count}</span>;
		},
	},
	{
		accessorKey: 'category',
		header: () => <span>Category</span>,
		cell({ row }) {
			const cat = { CITY: 'IN-CITY', HOUSE: 'IN-HOUSE', FAMILY: 'HOTR-FAMILY' };
			const category = row.original.category;
			return <span className="text-sm  capitalize">{cat[category]}</span>;
		},
	},
	{
		accessorKey: 'check',
		header: () => <span className="text-nowrap">Checked In</span>,
		cell({ row }) {
			const check = row.original?.checkIn;
			return (
				<span
					className={cn(
						'text-sm text-nowrap capitalize text-center',
						check ? 'text-green-500' : 'text-yellow-500'
					)}>
					{check ? 'Checked' : 'Not yet'}
				</span>
			);
		},
	},
	{
		accessorKey: 'created',
		header: () => <span className="text-nowrap">Created At</span>,
		cell({ row }) {
			const createdAt = row.original.createdAt;
			return (
				<time className="text-xs md:text-sm text-nowrap ml-auto text-foreground ">
					{createdAt
						? format(new Date(createdAt), 'MMM d, yyyy,  hh:mm a')
						: 'N/A'}
				</time>
			);
		},
	},
	{
		id: 'action',
		cell: ({ row }) => {
			const user = row.original;
			return (
				<div className="flex gap-4">
					<UserQRCode id={user.id} name={user.name} />
					<AddGuest type="edit" guest={user} />
					<DeleteGuest id={user.id} />
					<Check {...user} />
				</div>
			);
		},
	},
];

export function UserQRCode({ name, id }: { name: string; id: string }) {
	const [loading, setLoading] = useState(false);
	const qrRef = useRef<HTMLDivElement | null>(null);
	const downloadQRCode = async () => {
		setLoading(true);
		try {
			const canvas = qrRef.current?.querySelector('canvas');
			if (!canvas) throw new Error('Canvas not found');

			const imgData = canvas.toDataURL('image/png');
			const link = document.createElement('a');
			link.href = imgData;
			link.download = `${name}-qrcode.jpg`;
			link.click();
		} catch (error) {
			console.error('Error generating QR PDF:', error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Drawer>
			<DrawerTrigger asChild>
				<Button>QR Code</Button>
			</DrawerTrigger>
			<DrawerContent>
				<div className="mx-auto w-full max-w-sm flex flex-col items-center">
					<DrawerHeader className="items-center">
						<DrawerTitle className="text-center text-xl">
							Guest QR Code
						</DrawerTitle>
						<DrawerDescription>You can download and share.</DrawerDescription>
					</DrawerHeader>
					<div>
						<div
							ref={qrRef}
							className="p-4 bg-white rounded shadow w-fit flex flex-col items-center">
							<QRCodeCanvas
								value={id}
								size={220}
								bgColor="#ffffff"
								fgColor="#000000"
								level="H"
							/>
							<p className="text-base capitalize text-black font-bold text-center mt-3 w-full">
								{name}
							</p>
						</div>
					</div>
					<DrawerFooter className="w-full flex-row gap-4">
						<DrawerClose asChild>
							<Button variant="outline" className="flex-1">
								Close
							</Button>
						</DrawerClose>
						<Button
							onClick={downloadQRCode}
							disabled={loading}
							className="flex-1">
							{loading ? 'Downloading...' : 'Download'}
						</Button>
					</DrawerFooter>
				</div>
			</DrawerContent>
		</Drawer>
	);
}

export function DeleteGuest({ id }: { id: string }) {
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	async function handleSubmit() {
		if (!id) {
			return toast.warning('Please a valid id');
		}
		try {
			setLoading(true);
			const res = await deleteUser(id);
			if (!res) {
				return toast.error('Error occuried, try again!');
			} else {
				setOpen(false);
				router.refresh();
				return toast.success('Guest deleted successfully!');
			}
		} catch (error: any) {
			console.error('Failed request:', error);
			return toast.error('Error occuried, try again!');
		} finally {
			setLoading(false);
		}
	}
	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger asChild>
				<Button variant="destructive" className="text-white">
					Delete
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. This will permanently delete guest
						data from our servers.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter className="flex-row gap-4">
					<AlertDialogCancel className="flex-1">Close</AlertDialogCancel>
					<Button className="flex-1" onClick={async () => await handleSubmit()}>
						{loading && <Loader className=" w-4 h-4 animate-spin" />}
						Continue
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
export function Check({ id, checkIn }: Users[0]) {
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	async function handleSubmit() {
		if (!id) {
			return toast.warning('Please a valid id');
		}
		try {
			setLoading(true);
			const res = await UnCheck(id, checkIn?.id);
			if (!res) {
				return toast.error('Error occuried, try again!');
			} else {
				setOpen(false);
				router.refresh();
				return toast.success('Guest deleted successfully!');
			}
		} catch (error: any) {
			console.error('Failed request:', error);
			return toast.error('Error occuried, try again!');
		} finally {
			setLoading(false);
		}
	}
	const isChecked = useMemo(() => (checkIn?.id ? true : false), [checkIn]);
	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger asChild>
				<Button variant="outline" disabled={!isChecked} className="">
					Un-check
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription>
						This action will un check this user from this checked list.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter className="flex-row gap-4">
					<AlertDialogCancel className="flex-1">Close</AlertDialogCancel>
					<Button className="flex-1" onClick={async () => await handleSubmit()}>
						{loading && <Loader className=" w-4 h-4 animate-spin" />}
						Continue
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
