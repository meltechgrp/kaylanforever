'use client';

import { Button } from '@/components/ui/button';
import { Users } from '@/lib/actions';
import { QRCodeCanvas } from 'qrcode.react';
import { useRef, useState, useEffect } from 'react';

interface Props {
	data: Users;
}

export function Download({ data }: Props) {
	const [loading, setLoading] = useState(false);
	const refs = useRef<Record<string, HTMLDivElement | null>>({});

	// Populate refs for all users
	useEffect(() => {
		data.forEach(({ id }) => {
			refs.current[id] = null;
		});
	}, [data]);

	const downloadQRCode = async () => {
		setLoading(true);
		try {
			await Promise.all(
				data.map(({ id, name }) => {
					const canvas = refs.current[id]?.querySelector('canvas');
					if (!canvas) throw new Error(`Canvas not found for ${name}`);

					// Create a new canvas with room for name
					const qrSize = canvas.width + 10;
					const fontSize = 24;
					const padding = 20;
					const totalHeight = qrSize + padding + fontSize + 14;

					const combinedCanvas = document.createElement('canvas');
					combinedCanvas.width = qrSize;
					combinedCanvas.height = totalHeight;

					const ctx = combinedCanvas.getContext('2d');
					if (!ctx) throw new Error('Canvas context is null');

					// Draw QR code onto new canvas
					ctx.fillStyle = '#ffffff';
					ctx.fillRect(0, 0, qrSize, totalHeight);
					ctx.drawImage(canvas, 0, 0);

					// Draw the name
					ctx.fillStyle = '#000000';
					ctx.font = `bold ${fontSize}px sans-serif`;
					ctx.textAlign = 'center';
					ctx.fillText(name.toUpperCase(), qrSize / 1.8, qrSize + fontSize);

					// Export
					const imgData = combinedCanvas.toDataURL('image/png');
					const link = document.createElement('a');
					link.href = imgData;
					link.download = `${name}-qrcode.png`;
					link.click();
				})
			);
		} catch (error) {
			console.error('Error downloading QR codes:', error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div>
			{/* Hidden QR codes used only for canvas rendering */}
			<div
				style={{ visibility: 'hidden', position: 'absolute', left: '-9999px' }}
				aria-hidden="true">
				{data.map(({ id, name }) => (
					<div
						key={id}
						ref={(el) => {
							if (el) refs.current[id] = el;
						}}
						className="p-8 bg-white rounded shadow w-fit flex flex-col items-center">
						<div className="p-4 rounded shadow w-fit flex flex-col items-center">
							<QRCodeCanvas
								value={id}
								size={220}
								bgColor="#ffffff"
								fgColor="#000000"
								level="H"
							/>
							<p className="text-base capitalize m-2 text-black font-bold text-center mt-3 w-full">
								{name}
							</p>
						</div>
					</div>
				))}
			</div>

			<Button onClick={downloadQRCode} disabled={loading}>
				{loading ? 'Downloading...' : 'Download QrCodes'}
			</Button>
		</div>
	);
}
