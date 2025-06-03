'use client';

import { Button } from '@/components/ui/button';
import { Users } from '@/lib/actions';
import { QRCodeCanvas } from 'qrcode.react';
import { useRef, useState, useEffect } from 'react';
import { saveAs } from 'file-saver'; // optional but useful
import 'file-saver';
import JSZip from 'jszip';

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
			const zip = new JSZip();

			for (const { id, name } of data) {
				const canvas = refs.current[id]?.querySelector('canvas');
				if (!canvas) {
					console.warn(`Canvas not found for ${name}`);
					continue;
				}

				const qrSize = canvas.width + 10;
				const fontSize = 24;
				const padding = 20;
				const totalHeight = qrSize + padding + fontSize + 14;

				const combinedCanvas = document.createElement('canvas');
				combinedCanvas.width = qrSize;
				combinedCanvas.height = totalHeight;

				const ctx = combinedCanvas.getContext('2d');
				if (!ctx) continue;

				ctx.fillStyle = '#ffffff';
				ctx.fillRect(0, 0, qrSize, totalHeight);
				ctx.drawImage(canvas, 0, 0);
				ctx.fillStyle = '#000000';
				ctx.font = `bold ${fontSize}px sans-serif`;
				ctx.textAlign = 'center';
				ctx.fillText(name.toUpperCase(), qrSize / 2, qrSize + fontSize);

				const dataUrl = combinedCanvas.toDataURL('image/png');
				const base64 = dataUrl.replace(/^data:image\/(png|jpg);base64,/, '');

				zip.file(`${name}-qrcode.png`, base64, { base64: true });
			}

			const blob = await zip.generateAsync({ type: 'blob' });
			saveAs(blob, 'qr-codes.zip');
		} catch (error) {
			console.error('Error creating ZIP:', error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div>
			{/* Hidden QR codes used only for canvas rendering */}
			<div style={{ position: 'absolute', left: '-900px' }} aria-hidden="true">
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
