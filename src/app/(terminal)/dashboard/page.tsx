import { Card } from '@/components/ui/card';
import TabsView from './components/tabs-view';
import { AddGuest } from './components/add-guest';
import { getUsers } from '@/lib/actions';

export const dynamic = 'force-dynamic'; // disables cache
export const fetchCache = 'force-no-store';
export default async function Dashboard() {
	const data = await getUsers();
	return (
		<div className="  py-8">
			<div className="flex gap-8 px-2 md:px-4">
				<Card className="w-full min-w-md mx-auto divide-y">
					<div className="p-4 md:p-6 flex justify-between">
						<div className="flex-1">
							<h2 className="font-medium text-lg">Total Records</h2>
							<div className="flex gap-4">
								<div className="text-sm">
									<span className="text-xs">Total INVITEES: </span>
									<span>{data.length}</span>
								</div>
								<div className="text-sm">
									<span className="text-xs">Total ACCOMPANIED: </span>
									<span>
										{data.reduce((acc, user) => acc + user.guests, 0)}
									</span>
								</div>
							</div>
						</div>
						<AddGuest type="add" />
					</div>
					<TabsView data={data} />
				</Card>
			</div>
		</div>
	);
}
