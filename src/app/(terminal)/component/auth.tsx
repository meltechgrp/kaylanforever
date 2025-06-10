'use client';
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { toast } from 'sonner';

const password = process.env.NEXT_PUBLIC_PASSWORD;

export function Authorize() {
	const [isOpen, setIsOpen] = useState(true);
	const [text, setText] = useState('');
	function handleCheck() {
		if (text.trim() === password) {
			setIsOpen(false);
			toast.success('Welcome');
		} else {
			toast.error('Incorrect password, try again!', {
				duration: 4000,
			});
		}
	}
	return (
		<AlertDialog open={isOpen} onOpenChange={setIsOpen}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Authorization Password</AlertDialogTitle>
					<AlertDialogDescription>
						Enter authorization password to continue.
					</AlertDialogDescription>
					<div className=" space-y-6 mt-4">
						<Input
							value={text}
							className=" h-12"
							onChange={(val) => setText(val.target.value)}
							placeholder="Enter password"
						/>
						<Button className="w-full h-12" onClick={handleCheck}>
							Continue
						</Button>
					</div>
				</AlertDialogHeader>
			</AlertDialogContent>
		</AlertDialog>
	);
}
