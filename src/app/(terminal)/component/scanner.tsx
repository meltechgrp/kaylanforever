'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from '@/components/ui/card';
import { Scanner } from '@yudiel/react-qr-scanner';
import { format } from 'date-fns';
import {
	Calendar,
	Dna,
	Loader,
	Loader2,
	Mail,
	Percent,
	Phone,
	ShoppingBag,
} from 'lucide-react';
import React, {
	useEffect,
	useState,
	useCallback,
	useRef,
	useMemo,
} from 'react';
import { useRouter } from 'next/navigation';

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

export default function ScannerComponent({ terminal }: { terminal?: any }) {
	const [isProcessing, setIsProcessing] = useState(false);
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
	const member = null;
	// const handleCheck = async (email: string) => {
	// 	try {
	// 		setIsProcessing(true);
	// 		const res = await updatePurchase(email, fullName);

	// 		if (res.error) {
	// 			speakMessage(res.error);
	// 			toast.error(res.error);
	// 		} else if (res.data) {
	// 			setMemberData(res.data.user_info);
	// 			speakMessage('Scanned successfully');
	// 		}
	// 	} catch (error) {
	// 		console.error('Error checking member:', error);
	// 		speakMessage('Please try again.');
	// 	} finally {
	// 		setIsProcessing(false);
	// 		router.refresh();
	// 		lastScannedValue.current = null;
	// 	}
	// };
	// const handleScan = useCallback(
	// 	(result: any) => {
	// 		const scannedValue = result?.[0]?.rawValue;
	// 		if (
	// 			!isProcessing &&
	// 			scannedValue &&
	// 			lastScannedValue.current !== scannedValue
	// 		) {
	// 			lastScannedValue.current = scannedValue;
	// 			handleCheck(scannedValue);
	// 		}
	// 	},
	// 	[isProcessing, handleCheck]
	// );
	// useEffect(() => {
	// 	if (member) {
	// 		const timer = setTimeout(() => {
	// 			setIsProcessing(false);
	// 			window.location.reload();
	// 			lastScannedValue.current = null;
	// 			setMemberData(undefined);
	// 		}, 15000);
	// 		return () => clearTimeout(timer);
	// 	}
	// }, [member]);
	return (
		<div className=" space-y-6">
			<div className="grid gap-6 md:grid-cols-2 items-start">
				<div className=" relative max-w-sm sm:max-w-lg  mr-auto  w-full  bg-gray-100 dark:bg-black/80">
					<Scanner
						allowMultiple={true} // Ensures single scan at a time
						constraints={{ facingMode: 'user' }}
						onScan={() => {}}
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
				<Card className="py-2 h-full w-full  px-4">
					{member ? (
						<div>
							<div className="flex justify-between gap-3 border-b  px-4 py-3 rounded-md ">
								<div className=" flex  gap-3">
									<div className="flex flex-col gap-6">
										<span className="text-base flex gap-2 font-roboto md:text-xl lg:text-2xl font-bold">
											Humphrey
										</span>
										{/* <span className=" text-md flex gap-1 items-center">
                      Church Record:
                      <span className=" text-xl font-bold">
                        {memberData?.total_attendance_count || 0}
                      </span>
                    </span> */}
									</div>
								</div>
								{/* <TotalAmount
                  setPurchase={setPurchase}
                  name={fullName}
                  email={member.email}
                /> */}
							</div>
							<CardHeader className="py-6 px-4 flex flex-row justify-between items-center">
								<h1 className="text-md text-foreground/80 font-bold">
									Member Infomation
								</h1>
							</CardHeader>
						</div>
					) : (
						<div className=" flex h-full justify-center items-center">
							<p className=" text-2xl font-bold md:text-3xl text-center">
								Scan to display guest profile
							</p>
						</div>
					)}
				</Card>
			</div>
		</div>
	);
}

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
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { formatToNaira } from '@/lib/utils';
