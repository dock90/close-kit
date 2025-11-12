import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { CheckCircle2, Clock, CreditCard } from 'lucide-react';
import Link from 'next/link';

export default async function UpgradePage() {
	const user = await currentUser();

	if (!user) {
		redirect('/sign-in');
	}

	const dbUser = await prisma.user.findUnique({
		where: { clerkId: user.id },
		include: { organization: true },
	});

	if (!dbUser) {
		redirect('/onboarding');
	}

	const org = dbUser.organization;
	const trialEndsAt = org.trialEndsAt;
	const isTrialExpired = trialEndsAt && new Date() > trialEndsAt;

	// Calculate days remaining (if still in trial)
	let daysRemaining = 0;
	if (trialEndsAt && !isTrialExpired) {
		const now = new Date();
		const diffTime = trialEndsAt.getTime() - now.getTime();
		daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
	}

	return (
		<div className='min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center px-4'>
			<div className='max-w-2xl w-full'>
				{/* Trial Status Card */}
				<div className='bg-white rounded-2xl shadow-2xl p-8 md:p-12'>
					<div className='text-center mb-8'>
						<div className='inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4'>
							{isTrialExpired ? (
								<Clock className='h-8 w-8 text-yellow-600' />
							) : (
								<CreditCard className='h-8 w-8 text-indigo-600' />
							)}
						</div>
						<h1 className='text-3xl md:text-4xl font-bold text-gray-900 mb-3'>
							{isTrialExpired
								? 'Your Trial Has Ended'
								: 'Upgrade to Continue'}
						</h1>
						<p className='text-lg text-gray-600'>
							{isTrialExpired
								? 'Subscribe now to regain access to your account'
								: `You have ${daysRemaining} ${
										daysRemaining === 1 ? 'day' : 'days'
								  } remaining in your trial`}
						</p>
					</div>

					{/* Pricing Card */}
					<div className='bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl p-8 text-white mb-8'>
						<div className='text-center mb-6'>
							<div className='mb-2'>
								<span className='text-5xl font-bold'>$29</span>
								<span className='text-2xl text-indigo-100'>
									/month
								</span>
							</div>
							<p className='text-indigo-100'>
								Unlock full access to CloseKit
							</p>
						</div>

						<ul className='space-y-3 mb-8'>
							<li className='flex items-start'>
								<CheckCircle2 className='h-5 w-5 text-green-300 mr-3 mt-0.5 flex-shrink-0' />
								<span>Unlimited users</span>
							</li>
							<li className='flex items-start'>
								<CheckCircle2 className='h-5 w-5 text-green-300 mr-3 mt-0.5 flex-shrink-0' />
								<span>Unlimited companies & deals</span>
							</li>
							<li className='flex items-start'>
								<CheckCircle2 className='h-5 w-5 text-green-300 mr-3 mt-0.5 flex-shrink-0' />
								<span>Revenue goal tracking</span>
							</li>
							<li className='flex items-start'>
								<CheckCircle2 className='h-5 w-5 text-green-300 mr-3 mt-0.5 flex-shrink-0' />
								<span>Weekly reports & analytics</span>
							</li>
							<li className='flex items-start'>
								<CheckCircle2 className='h-5 w-5 text-green-300 mr-3 mt-0.5 flex-shrink-0' />
								<span>Email & LinkedIn templates</span>
							</li>
							<li className='flex items-start'>
								<CheckCircle2 className='h-5 w-5 text-green-300 mr-3 mt-0.5 flex-shrink-0' />
								<span>Priority support</span>
							</li>
						</ul>

						<button className='w-full bg-white text-indigo-600 rounded-lg py-4 px-6 font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg'>
							Subscribe Now
						</button>
					</div>

					<div className='text-center text-sm text-gray-500'>
						<p>
							By subscribing, you agree to our Terms of Service
						</p>
					</div>

					{!isTrialExpired && (
						<div className='mt-6 text-center'>
							<Link
								href='/dashboard'
								className='text-gray-600 hover:text-gray-900 text-sm'
							>
								← Back to Dashboard
							</Link>
						</div>
					)}
				</div>

				{isTrialExpired && (
					<div className='mt-6 text-center'>
						<p className='text-gray-600 text-sm'>
							Need more time to decide?{' '}
							<a
								href='mailto:support@closekit.com'
								className='text-indigo-600 hover:text-indigo-700 font-medium'
							>
								Get in touch
							</a>
						</p>
					</div>
				)}
			</div>
		</div>
	);
}

