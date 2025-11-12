'use client';

import { Clock, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface TrialBannerProps {
	daysRemaining: number;
	trialEndsAt: string;
}

export function TrialBanner({ daysRemaining, trialEndsAt }: TrialBannerProps) {
	const [dismissed, setDismissed] = useState(false);

	if (dismissed) {
		return null;
	}

	const formatDate = (dateString: string) => {
		return new Intl.DateTimeFormat('en-US', {
			month: 'long',
			day: 'numeric',
			year: 'numeric',
		}).format(new Date(dateString));
	};

	return (
		<div className='bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-lg shadow-sm relative z-40'>
			<div className='flex items-start justify-between'>
				<div className='flex items-start'>
					<Clock className='h-5 w-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0' />
					<div>
						<h3 className='text-sm font-semibold text-gray-900'>
							{daysRemaining === 0
								? 'Your trial ends today!'
								: daysRemaining === 1
								? '1 day left in your trial'
								: `${daysRemaining} days left in your trial`}
						</h3>
						<p className='text-sm text-gray-700 mt-1'>
							Your trial expires on {formatDate(trialEndsAt)}.
							Subscribe now to keep full access to your account.
						</p>
						<Link
							href='/upgrade'
							className='inline-flex items-center mt-2 text-sm font-medium text-indigo-600 hover:text-indigo-700'
						>
							Upgrade to continue →
						</Link>
					</div>
				</div>
				<button
					onClick={() => setDismissed(true)}
					className='ml-4 text-gray-400 hover:text-gray-600 transition-colors'
					aria-label='Dismiss'
				>
					<X className='h-5 w-5' />
				</button>
			</div>
		</div>
	);
}

