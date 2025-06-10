import Link from 'next/link';
import ScannerComponent from './component/scanner';
import { Button } from '@/components/ui/button';

export default async function Home() {
	return (
		<div className="space-y-8 max-w-7xl mx-auto pt-20">
			<div className="flex flex-1 flex-col gap-8 p-4 pt-0">
				<div className="p-6 flex  bg-[#e1d0be] justify-center">
					<h2 className="font-medium text-center flex-1 text-2xl">Check In</h2>
					<Link className="" href={'/dashboard'}>
						<Button className="h-12">Dashboard</Button>
					</Link>
				</div>
				<ScannerComponent />
			</div>
		</div>
	);
}
