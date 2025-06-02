'use client';

import { DataTable } from '@/components/shared/data-table';
import { DataTableToolbar } from '@/components/shared/data-table-toolbar';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { columns } from './columns';
import { isToday, isYesterday } from 'date-fns';

type Props = {
	data: [];
};
export default function TabsView(props: Props) {
	return <DataTable columns={columns} data={[]} />;
}
