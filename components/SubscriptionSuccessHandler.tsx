'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle2, X } from 'lucide-react';
import {
	Toast,
	ToastDescription,
	ToastProvider,
	ToastTitle,
	ToastViewport,
} from '@/components/ui/toast';

export function SubscriptionSuccessHandler() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const [open, setOpen] = useState(false);

	useEffect(() => {
		const sessionId = searchParams.get('session_id');
		if (sessionId) {
			setOpen(true);
			// Clean up URL
			const url = new URL(window.location.href);
			url.searchParams.delete('session_id');
			router.replace(url.pathname);
		}
	}, [searchParams, router]);

	return (
		<ToastProvider>
			<Toast
				open={open}
				onOpenChange={setOpen}
				duration={5000}
				className='bg-green-50 border-green-200'
			>
				<div className='flex items-start gap-3'>
					<CheckCircle2 className='h-5 w-5 text-green-600 mt-0.5' />
					<div className='flex-1'>
						<ToastTitle className='text-green-900'>
							Subscription Activated!
						</ToastTitle>
						<ToastDescription className='text-green-800'>
							Welcome to CloseKit Pro. Your subscription is now active.
						</ToastDescription>
					</div>
					<button
						onClick={() => setOpen(false)}
						className='text-green-600 hover:text-green-800'
					>
						<X className='h-4 w-4' />
					</button>
				</div>
			</Toast>
			<ToastViewport />
		</ToastProvider>
	);
}

