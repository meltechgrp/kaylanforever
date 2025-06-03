'use client';

import { DataTable } from '@/components/shared/data-table';
import { DataTableToolbar } from '@/components/shared/data-table-toolbar';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMemo, useState } from 'react';
import { columns } from './columns';
import { Users } from '@/lib/actions';

type Props = {
	data: Users;
};
const tabs = ['All', 'IN-CITY', 'IN-HOUSE', 'HOTR-FAMILY'];
export default function TabsView(props: Props) {
	const { data } = props;
	const [tab, setTab] = useState('All');

	const users = useMemo(() => {
		return data.filter((user) => {
			if (tab === 'IN-CITY') return user.category == 'CITY';
			if (tab === 'HOTR-FAMILY') return user.category == 'FAMILY';
			if (tab === 'IN-HOUSE') return user.category == 'HOUSE';
			return true;
		});
	}, [tab, data]);
	return (
		<Tabs defaultValue={tab} onValueChange={setTab} className="w-full">
			<DataTable
				columns={columns}
				data={users}
				HeaderComponent={({ table }) => (
					<div className="py-2 overflow-auto px-4 md:px-6 border-b flex justify-between space-x-4">
						<TabsList className="  shadow-custom-2 h-12 border border-slate-200">
							{tabs.map((tab, index) => {
								return (
									<TabsTrigger
										key={index}
										className="data-[state=active]:bg-slate-200 text-xs md:text-sm capitalize md:uppercase h-full"
										value={tab}>
										{tab.toLowerCase()}
									</TabsTrigger>
								);
							})}
						</TabsList>
						<DataTableToolbar table={table as any} />
					</div>
				)}
			/>
		</Tabs>
	);
}
