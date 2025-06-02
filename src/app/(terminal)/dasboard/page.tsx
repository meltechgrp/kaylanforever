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
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { redirect } from 'next/navigation';
import { Card } from '@/components/ui/card';
import TabsView from './components/tabs-view';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export default async function Sales() {
	const record: any = [];
	return (
		<div className=" space-y-8">
			<div className="flex flex-1 flex-col gap-8 p-4 pt-0">
				<Card className="w-full divide-y">
					<div className="p-6 flex justify-between">
						<div className="flex-1">
							<h2 className="font-medium text-lg">All Records</h2>
						</div>
						<AddGuest />
					</div>
					<TabsView data={[]} />
				</Card>
			</div>
		</div>
	);
}

export function AddGuest() {
	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button variant="outline">Add Guest</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Add a New Guest</AlertDialogTitle>
					<div>
						<div>
							<Label>First Name</Label>
							<Input placeholder="guest first name" name="first_name" />
						</div>
						<div>
							<Label>Last Name</Label>
							<Input placeholder="guest last name" name="last_name" />
						</div>
					</div>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction>Continue</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
