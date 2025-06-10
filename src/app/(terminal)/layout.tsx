import { Authorize } from './component/auth';

export default function CheckLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="w-full h-full">
			{children}
			<Authorize />
		</div>
	);
}
