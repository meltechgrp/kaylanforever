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
import { addUser } from '@/lib/actions';
import { toast } from 'sonner';

export function AddGuest() {
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [form, setForm] = React.useState({
		name: '',
		guests: '',
		phone: '',
		category: 'FAMILY' as CategoryType,
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
				return toast.success('Guest added successfully!');
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
				<Button variant="outline">Add Guest</Button>
			</AlertDialogTrigger>
			<AlertDialogContent className=" max-w-xl py-8 gap-6">
				<AlertDialogHeader>
					<AlertDialogTitle className="text-xl">
						Add a New Guest
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
					<AlertDialogCancel className="flex-1">Cancel</AlertDialogCancel>
					<Button className="flex-1" onClick={async () => await handleSubmit()}>
						{loading && <Loader className=" w-4 h-4 animate-spin" />}
						Save
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
