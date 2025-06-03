'use client';
import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import React, { useState } from 'react';
import { Loader } from 'lucide-react';
import { CategoryType } from '@/lib/prisma';
import { addUser, Users } from '@/lib/actions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

type Props = {
	type: 'add' | 'edit';
	guest?: Users[0];
};

export function AddGuest({ guest, type }: Props) {
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [form, setForm] = React.useState({
		id: guest?.id,
		name: guest?.name || '',
		guests: guest?.guests.toString() || '',
		phone: guest?.phone || '',
		category: guest?.category || ('FAMILY' as CategoryType),
	});
	async function handleSubmit() {
		if (!form.name) {
			return toast.warning('Please a valid name');
		}
		try {
			setLoading(true);
			const res = await addUser({ ...form });
			if (res?.error) {
				return toast.error('Error occuried, try again!');
			} else {
				setOpen(false);
				router.refresh();
				return toast.success(
					type == 'add'
						? 'Guest added successfully!'
						: 'Guest updated successfully!'
				);
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
				<Button variant="outline">
					{type == 'add' ? 'Add Guest' : 'Edit'}
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent className=" max-w-xl py-8 gap-6">
				<AlertDialogHeader>
					<AlertDialogTitle className="text-xl">
						{type == 'add' ? 'Add a New Guest' : 'Update Guest Info'}
					</AlertDialogTitle>
					<div className="flex flex-col gap-4">
						<div className="flex-1">
							<Label>First Name</Label>
							<Input
								placeholder="Guest first name"
								value={form.name}
								onChange={(val) => setForm({ ...form, name: val.target.value })}
							/>
						</div>
						<div className="flex-1 flex gap-4">
							<div className="flex-1">
								<Label>No of Guests</Label>
								<Select
									value={form.guests}
									onValueChange={(val) => setForm({ ...form, guests: val })}>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Select a no of guests" />
									</SelectTrigger>
									<SelectContent>
										<SelectGroup>
											<SelectLabel>Chances</SelectLabel>
											<SelectItem value="1">1</SelectItem>
											<SelectItem value="2">2</SelectItem>
											<SelectItem value="3">3</SelectItem>
											<SelectItem value="4">4</SelectItem>
										</SelectGroup>
									</SelectContent>
								</Select>
							</div>
							<div className="flex-1">
								<Label>Category</Label>
								<Select
									value={form.category}
									onValueChange={(val) =>
										setForm({ ...form, category: val as CategoryType })
									}>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Select a category" />
									</SelectTrigger>
									<SelectContent>
										<SelectGroup>
											<SelectLabel>Category</SelectLabel>
											{Object.keys(CategoryType).map((val) => (
												<SelectItem key={val} value={val}>
													{val == 'FAMILY' ? 'HOTR FAMILY' : val}
												</SelectItem>
											))}
										</SelectGroup>
									</SelectContent>
								</Select>
							</div>
						</div>
						<div className="flex-1">
							<Label>Phone Number</Label>
							<Input
								placeholder="Guest phone"
								value={form.phone}
								onChange={(val) =>
									setForm({ ...form, phone: val.target.value })
								}
							/>
						</div>
					</div>
				</AlertDialogHeader>
				<AlertDialogFooter className="flex-row gap-4">
					<AlertDialogCancel className="flex-1">Close</AlertDialogCancel>
					<Button className="flex-1" onClick={async () => await handleSubmit()}>
						{loading && <Loader className=" w-4 h-4 animate-spin" />}
						{type == 'add' ? 'Save' : 'Update'}
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
