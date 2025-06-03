'use client';
import { Card } from '@/components/ui/card';
import { Scanner } from '@yudiel/react-qr-scanner';
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { checkIn, Users } from '@/lib/actions';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const useVoice = () => {
	const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);

	useEffect(() => {
		const fetchVoices = () => {
			const voices = speechSynthesis.getVoices();
			const femaleVoice = voices.find((voice) =>
				voice.name.toLowerCase().includes('female')
			);
			setVoice(femaleVoice || voices[0] || null);
		};

		if (speechSynthesis.getVoices().length > 0) {
			fetchVoices();
		} else {
			speechSynthesis.addEventListener('voiceschanged', fetchVoices);
		}

		return () => {
			speechSynthesis.removeEventListener('voiceschanged', fetchVoices);
		};
	}, []);

	return voice;
};

export default function ScannerComponent() {
	const [isProcessing, setIsProcessing] = useState(false);
	const [guest, setGuest] = useState<Users[0] | null>(null);
	const [error, setError] = useState('');
	const voice = useVoice();
	const router = useRouter();

	// Ref to prevent duplicate calls
	const lastScannedValue = useRef<string | null>(null);

	const speakMessage = useCallback(
		(message: string) => {
			if (!message) return;
			const utterance = new SpeechSynthesisUtterance(message);
			if (voice) {
				utterance.voice = voice;
			}
			speechSynthesis.speak(utterance);
		},
		[voice]
	);
	const handleCheck = async (id: string) => {
		try {
			setGuest(null);
			setError('');
			setIsProcessing(true);
			const res = await checkIn(id);
			if (res.error) {
				speakMessage(res.error);
				setError(res.error);
				toast.error(res.error);
			} else if (res.data) {
				setGuest(res.data.user);
				speakMessage('Check In successfully');
			}
		} catch (error) {
			console.error('Error', error);
			speakMessage('Please try again.');
		} finally {
			setIsProcessing(false);
			router.refresh();
			lastScannedValue.current = null;
		}
	};
	const handleScan = useCallback(
		(result: any) => {
			const scannedValue = result?.[0]?.rawValue;
			if (
				!isProcessing &&
				scannedValue &&
				lastScannedValue.current !== scannedValue
			) {
				lastScannedValue.current = scannedValue;
				handleCheck(scannedValue);
			}
		},
		[isProcessing, handleCheck]
	);

	useEffect(() => {
		if (guest) {
			const timer = setTimeout(() => {
				setIsProcessing(false);
				// window.location.reload();
				lastScannedValue.current = null;
				setGuest(null);
				setError('');
			}, 15000);
			return () => clearTimeout(timer);
		}
	}, [guest]);
	return (
		<div className=" space-y-6">
			<div className="grid gap-6 md:grid-cols-2 items-start">
				<div className=" relative max-w-sm sm:max-w-lg  mr-auto  w-full  bg-gray-100 dark:bg-black/80">
					<Scanner
						allowMultiple={true} // Ensures single scan at a time
						constraints={{ facingMode: 'user' }}
						onScan={handleScan}
						scanDelay={1000}
						styles={{
							container: {
								// width: "100%",
								// height: "100%",
								backgroundColor: 'transparent',
								borderRadius: '0',
								border: 'none',
							},
						}}
					/>
				</div>
				<Card
					className={cn(
						'py-2 h-full min-h-40 w-full border-2 px-4',
						error && 'border-red-500',
						guest && 'border-green-500'
					)}>
					{guest && (
						<div className="flex h-full flex-col justify-center items-center gap-6">
							<span className="text-base flex gap-2 font-roboto md:text-2xl lg:text-3xl xl:text-4xl font-bold">
								{guest.name}
							</span>
							<span className=" text-md flex gap-1 items-center">
								Number of Guests
								<span className=" text-2xl font-bold">{guest.guests || 0}</span>
							</span>
						</div>
					)}
					{!guest && error ? (
						<div className=" flex h-full justify-center items-center">
							<p className=" text-xl text-red-500 font-bold md:text-3xl text-center">
								{error}
							</p>
						</div>
					) : (
						<div className=" flex h-full justify-center items-center">
							<p className=" text-2xl font-bold md:text-3xl text-center">
								Scan to display Guest
							</p>
						</div>
					)}
				</Card>
			</div>
		</div>
	);
}
