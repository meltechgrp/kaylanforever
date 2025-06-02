import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { validateRequest } from '@/lib/validate-user';
import { redirect } from 'next/navigation';
import ScannerComponent from './component/scanner';
import { Card, CardContent } from '@/components/ui/card';
import { ScanBarcode, ShoppingBasket, UsersRound, Wallet } from 'lucide-react';
import { formatToNaira, greet } from '@/lib/utils';

export default async function Home() {
	return (
		<div className="space-y-8 max-w-7xl mx-auto pt-20">
			<div className="flex flex-1 flex-col gap-8 p-4 pt-0">
				<div className="hidden auto-rows-min gap-4 md:grid-cols-4">
					<Card className=" h-32 flex flex-col">
						<CardContent className="flex px-4 flex-1 flex-col py-4 gap-4 ">
							<div className="flex justify-between items-center">
								<span className="text-md font-roboto font-semibold text-foreground">
									Total Customers
								</span>
								<div className="h-12 rounded-full w-12 flex items-center justify-center bg-sky-500">
									<UsersRound className=" w-5 h-5 text-white" />
								</div>
							</div>
							<div className="flex items-center">
								<strong className="text-xl font-bold font-roboto">0</strong>
							</div>
						</CardContent>
					</Card>
					<Card className=" h-32 flex flex-col">
						<CardContent className="flex px-4 flex-1 flex-col py-4 gap-4 ">
							<div className="flex justify-between items-center">
								<span className="text-md font-roboto font-semibold text-foreground">
									Discounted Percentage
								</span>
								<div className="h-12 rounded-full w-12 flex items-center justify-center bg-green-500">
									<ScanBarcode className=" w-5 h-5 text-white" />
								</div>
							</div>
							<div className="flex items-center">
								<strong className="text-xl font-bold font-roboto"></strong>
							</div>
						</CardContent>
					</Card>
					<Card className=" h-32 flex flex-col">
						<CardContent className="flex px-4 flex-1 flex-col py-4 gap-4 ">
							<div className="flex justify-between items-center">
								<span className="text-md font-roboto font-semibold text-foreground">
									Total Orders
								</span>
								<div className="h-12 rounded-full w-12 flex items-center justify-center bg-lime-500">
									<ShoppingBasket className=" w-5 h-5 text-white" />
								</div>
							</div>
							<div className="flex items-center">
								<strong className="text-xl font-bold font-roboto"></strong>
							</div>
						</CardContent>
					</Card>
					<Card className=" h-32 flex flex-col">
						<CardContent className="flex px-4 flex-1 flex-col py-4 gap-4 ">
							<div className="flex justify-between items-center">
								<span className="text-md font-roboto font-semibold text-foreground">
									Pending Amount
								</span>
								<div className="h-12 rounded-full w-12 flex items-center justify-center bg-green-500">
									<Wallet className=" w-5 h-5 text-white" />
								</div>
							</div>
							<div className="flex items-center">
								<strong className="text-xl font-bold font-roboto"></strong>
							</div>
						</CardContent>
					</Card>
				</div>

				<ScannerComponent />
			</div>
		</div>
	);
}
