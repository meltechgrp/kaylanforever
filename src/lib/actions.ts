'use server';
// import { redirect } from 'next/navigation';
// import { loginSchema, signupSchema, type SignupInput } from '@/lib/validators';

// import { cookies } from 'next/headers';
// import { validateRequest } from './validate-user';

// export interface ActionResponse<T> {
// 	fieldError?: Partial<Record<keyof T, string | undefined>>;
// 	formError?: string;
// 	data?: boolean;
// }

// export async function signup(
// 	_: any,
// 	formData: SignupInput
// ): Promise<ActionResponse<IMember>> {
// 	const parsed = signupSchema.safeParse(formData);
// 	if (!parsed.success) {
// 		const err = parsed.error.flatten();
// 		return {
// 			fieldError: {
// 				email: err.fieldErrors.email?.[0],
// 				password: err.fieldErrors.password?.[0],
// 				phone_number: err.fieldErrors.phone_number?.[0],
// 				first_name: err.fieldErrors.first_name?.[0],
// 				last_name: err.fieldErrors.last_name?.[0],
// 			},
// 		};
// 	}
// 	const { password, comfirm_password } = parsed.data;
// 	if (comfirm_password !== password) {
// 		return {
// 			fieldError: {
// 				password: 'Passwords do not match',
// 			},
// 		};
// 	}
// 	const controller = new AbortController();
// 	const id = setTimeout(() => controller.abort(), 15000);
// 	try {
// 		const res = await fetch(`${base}/auth/registration/`, {
// 			method: 'POST',
// 			headers: {
// 				'Content-Type': 'application/json',
// 			},
// 			body: JSON.stringify({ ...parsed.data }),
// 		});
// 		const data = await res.json();

// 		clearTimeout(id);
// 		console.log(data);
// 		if (data?.error) {
// 			if (data?.email) {
// 				return {
// 					formError: data?.email[0],
// 				};
// 			}
// 			if (data?.phone_number) {
// 				return {
// 					formError: data?.phone_number[0],
// 				};
// 			} else {
// 				return {
// 					formError: 'Comfirm your details',
// 				};
// 			}
// 		}

// 		const cookiesHandler = await cookies();
// 		cookiesHandler.set('userId', data.user.id, {
// 			path: '/',
// 			httpOnly: true,
// 			secure: env.NODE_ENV === 'production',
// 			maxAge: 60 * 60 * 24 * 7, // 7 days
// 		});
// 		cookiesHandler.set('token', data.token, {
// 			path: '/',
// 			httpOnly: true,
// 			secure: env.NODE_ENV === 'production',
// 			maxAge: 60 * 60 * 24 * 7, // 7 days
// 		});
// 		return {
// 			formError: 'done',
// 		};
// 	} catch (error) {
// 		console.error(error);

// 		clearTimeout(id);
// 		return {
// 			formError: 'Please try again',
// 		};
// 	}
// }

// export async function login(
// 	_: any,
// 	formData: Partial<IMember>
// ): Promise<ActionResponse<IMember>> {
// 	const parsed = loginSchema.safeParse(formData);
// 	if (!parsed.success) {
// 		const err = parsed.error.flatten();
// 		return {
// 			fieldError: {
// 				email: err.fieldErrors.email?.[0],
// 				password: err.fieldErrors.password?.[0],
// 			},
// 		};
// 	}
// 	const { email, password } = parsed.data;

// 	const res = await fetch(`${base}/auth/login/`, {
// 		method: 'POST',
// 		headers: {
// 			'Content-Type': 'application/json',
// 		},
// 		body: JSON.stringify({
// 			email: email,
// 			password: password,
// 		}),
// 	});
// 	const data = await res.json();
// 	console.log(data);
// 	if (data?.error || !data.token) {
// 		return {
// 			formError: 'Please comfirm your details',
// 		};
// 	}
// 	const cookiesHandler = await cookies();
// 	cookiesHandler.set('userId', data.user.id, {
// 		path: '/',
// 		httpOnly: true,
// 		secure: env.NODE_ENV === 'production',
// 		maxAge: 60 * 60 * 24 * 7, // 7 days
// 	});
// 	cookiesHandler.set('token', data.token, {
// 		path: '/',
// 		httpOnly: true,
// 		secure: env.NODE_ENV === 'production',
// 		maxAge: 60 * 60 * 24 * 7, // 7 days
// 	});

// 	return redirect('/');
// }

// export interface MemberProfile {
// 	user_info: IMember;
// 	total_attendance_count: number;
// 	services_attended: {
// 		service_name: string;
// 		service_start_time: string;
// 		service_end_time: string;
// 	}[];
// 	purchase_info: {
// 		id: number;
// 		amount_spent: number;
// 		flat_percentage_rate: number;
// 		reward_amount: number;
// 		transaction_time: string;
// 	};
// }

// export async function memberProfile(email: string): Promise<{
// 	data?: MemberProfile['user_info'];
// 	error?: string;
// }> {
// 	try {
// 		const { userId } = await validateRequest();
// 		if (!userId) {
// 			return {
// 				error: 'Authorized access',
// 			};
// 		}
// 		if (!email) {
// 			return {
// 				error: 'Email is required',
// 			};
// 		}
// 		const res = await fetch(`${base}/userinfo/`, {
// 			method: 'POST',
// 			headers: {
// 				'Content-Type': 'application/json',
// 			},
// 			body: JSON.stringify({
// 				email: email,
// 			}),
// 		});
// 		const data = await res.json();
// 		console.log(data);
// 		if (data?.error) {
// 			return {
// 				error: data?.error || 'Invalid email',
// 			};
// 		}
// 		return {
// 			data: data.user_info,
// 		};
// 	} catch (error) {
// 		console.log(error);
// 		return {
// 			error: 'Error occurred',
// 		};
// 	}
// }
// export async function updatePurchase(
// 	email: string,
// 	name: string
// ): Promise<{
// 	data?: MemberProfile;
// 	error?: string;
// }> {
// 	try {
// 		const { userId } = await validateRequest();
// 		if (!userId) {
// 			return {
// 				error: 'Authorized access',
// 			};
// 		}
// 		const res = await fetch(`${base}/qr-code/attendance-info/`, {
// 			method: 'POST',
// 			headers: {
// 				'Content-Type': 'application/json',
// 			},
// 			body: JSON.stringify({
// 				terminal_id: userId,
// 				terminal_name: name,
// 				email: email,
// 			}),
// 		});
// 		const data = await res.json();
// 		console.log(data);
// 		if (data?.error) {
// 			return {
// 				error: data?.error || 'Invalid amount',
// 			};
// 		}
// 		return {
// 			data: data,
// 		};
// 	} catch (error) {
// 		console.log(error);
// 		return {
// 			error: 'Error occurred',
// 		};
// 	}
// }
// export async function comfirmPayment(id: string): Promise<{
// 	data?: MemberProfile;
// 	error?: string;
// }> {
// 	try {
// 		const { userId } = await validateRequest();
// 		if (!userId) {
// 			return {
// 				error: 'Authorized access',
// 			};
// 		}
// 		const res = await fetch(`${base}/payment/update/${id}`);
// 		const data = await res.json();
// 		console.log(data);
// 		if (data?.error) {
// 			return {
// 				error: data?.error || 'Invalid amount',
// 			};
// 		}
// 		return {
// 			data: data,
// 		};
// 	} catch (error) {
// 		console.log(error);
// 		return {
// 			error: 'Error occurred',
// 		};
// 	}
// }
// export async function logout(): Promise<{ error: string | null }> {
// 	try {
// 		const cookie = await cookies();
// 		const userId = cookie.get('userId')?.value ?? null;
// 		if (!userId)
// 			return {
// 				error: 'User id not found',
// 			};

// 		const cookiesHandler = await cookies();
// 		cookiesHandler.set('userId', '', {
// 			path: '/',
// 			httpOnly: true,
// 			secure: env.NODE_ENV === 'production',
// 			maxAge: -1,
// 		});
// 		cookiesHandler.set('token', '', {
// 			path: '/',
// 			httpOnly: true,
// 			secure: env.NODE_ENV === 'production',
// 			maxAge: -1,
// 		});
// 		return redirect('/login');
// 	} catch (error) {
// 		console.log(error);
// 		return { error: '' };
// 	}
// }
// export async function updateProfile(
// 	_: any,
// 	formData: Partial<IMember>
// ): Promise<ActionResponse<Partial<IMember>>> {
// 	try {
// 		const { userId } = await validateRequest();
// 		if (!userId)
// 			return {
// 				formError: 'User not found',
// 			};
// 		// Create a FormData object to handle file upload
// 		const formDataObj = new FormData();

// 		// Append form data
// 		(Object.keys(formData) as (keyof typeof formData)[]).forEach((key) => {
// 			const value = formData[key];
// 			if (value !== undefined) {
// 				formDataObj.append(key, value as any);
// 			}
// 		});
// 		console.log(formDataObj);

// 		// Make the PUT request with FormData
// 		const res = await fetch(`${base}/users/${userId}/`, {
// 			method: 'PUT',
// 			body: formDataObj,
// 		});
// 		const data = await res.json();
// 		console.log(data);

// 		if (data?.error) {
// 			return {
// 				formError: data.error,
// 			};
// 		}
// 		return { data: data?.user };
// 	} catch (error) {
// 		console.log(error);
// 		return { formError: 'something went wrong' };
// 	}
// }

// type uploadProps = {
// 	user: IMember;
// 	image: File;
// };
// export async function uploadImage({ user, image }: uploadProps) {
// 	try {
// 		if (!user || !user.id) {
// 			return { error: 'User not found' };
// 		}
// 		const formData = new FormData();
// 		const imagefileFieldName =
// 			image.name.replace(' ', '-').slice(0, image.name.lastIndexOf('.')) +
// 			new Date(Date.now()) +
// 			'.webp';
// 		// Append the image file
// 		formData.append('profile_image', image, imagefileFieldName);

// 		Object.keys(user).forEach((key) => {
// 			if (
// 				key === 'id' ||
// 				key === 'profile_image' ||
// 				key === 'created_at' ||
// 				key === 'updated_at' ||
// 				key === 'category' ||
// 				key === 'graduation_year' ||
// 				key === 'birthdate'
// 			)
// 				return;
// 			const value = user[key as keyof IMember];
// 			if (value !== undefined) {
// 				formData.append(key, value as any);
// 			}
// 		});
// 		const res = await fetch(`${base}/users/${user.id}/`, {
// 			method: 'PUT',
// 			body: formData,
// 		});
// 		const data = await res.json();
// 		console.log(data);

// 		if (data?.error) {
// 			return {
// 				error: data?.detail || 'Please try again or provide another image',
// 			};
// 		}
// 		return { success: true };
// 	} catch (error) {
// 		console.log(error);
// 		return { error: 'Something went wrong' };
// 	}
// }

// export async function getUser(userId?: string): Promise<IMember | null> {
// 	try {
// 		if (!userId) {
// 			return null;
// 		}
// 		const res = await fetch(`${base}/users/${userId}/`);
// 		if (!res.ok) {
// 			return null;
// 		}
// 		const data = await res.json();
// 		return data || null;
// 	} catch (error) {
// 		console.log(error);
// 		return null;
// 	}
// }

// export interface ScansProps {
// 	id: string;
// 	user: {
// 		id: string;
// 		first_name: string;
// 		last_name: string;
// 		email: string;
// 		phone_number: string;
// 		gender: 'M' | 'F';
// 		profile_image: string;
// 	};
// 	address: string;
// 	terminal_id: string;
// 	terminal_name: string;
// 	scan_time: string;
// 	purchase: {
// 		id: string;
// 		user: string;
// 		amount_spent: number;
// 		flat_percentage_rate: number;
// 		reward_amount: number;
// 	};
// }

// export async function getScans(userId?: string): Promise<ScansProps[]> {
// 	try {
// 		if (!userId) {
// 			return [];
// 		}
// 		const res = await fetch(`${base}/terminal/${userId}/scans/`);
// 		if (!res.ok) {
// 			return [];
// 		}
// 		const data = await res.json();
// 		return data || [];
// 	} catch (error) {
// 		console.log(error);
// 		return [];
// 	}
// }
// interface StatsProps {
// 	total_scans: number;
// 	total_purchase: number;
// 	total_reward: number;
// }

// export async function getStat(userId?: string): Promise<StatsProps | null> {
// 	try {
// 		if (!userId) {
// 			return null;
// 		}
// 		const res = await fetch(`${base}/terminal/${userId}/stats/`);
// 		if (!res.ok) {
// 			return null;
// 		}
// 		const data = await res.json();
// 		return data || null;
// 	} catch (error) {
// 		console.log(error);
// 		return null;
// 	}
// }

// interface IPercentage {
// 	id: string;
// 	name: string;
// 	rate: string;
// 	start_date: string;
// 	end_date: string;
// }

// export async function getPercentage(): Promise<IPercentage[]> {
// 	try {
// 		const res = await fetch(`${base}/percentage-rates/`);
// 		if (!res.ok) {
// 			return [];
// 		}
// 		const data = await res.json();
// 		return data || [];
// 	} catch (error) {
// 		console.log(error);
// 		return [];
// 	}
// }
