import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Sidebar } from '@/components/sidebar';
import { BottomNavigation } from '@/components/ui/bottom-navigation';
import { TrialBanner } from '@/components/trial-banner';
import { SubscriptionSuccessHandler } from '@/components/SubscriptionSuccessHandler';
import { QuickActionButton } from '@/components/quick-actions';
import { ReminderBell } from '@/components/reminders';

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const user = await currentUser();

	if (!user) {
		redirect('/sign-in');
	}

	// Check if user exists in database and has organization
	const dbUser = await prisma.user.findUnique({
		where: { clerkId: user.id },
		include: { organization: true },
	});

	if (!dbUser) {
		redirect('/onboarding');
	}

	// Check trial status
	const org = dbUser.organization;
	const trialEndsAt = org.trialEndsAt;
	const now = new Date();

	// If trial has ended and subscription is not active, redirect to upgrade page
	if (
		trialEndsAt &&
		now > trialEndsAt &&
		org.subscriptionStatus !== 'active'
	) {
		redirect('/upgrade');
	}

	// Calculate days remaining in trial
	let daysRemaining = 0;
	let showTrialBanner = false;
	if (
		trialEndsAt &&
		now <= trialEndsAt &&
		org.subscriptionStatus === 'trial'
	) {
		const diffTime = trialEndsAt.getTime() - now.getTime();
		daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		showTrialBanner = true;
	}

	return (
		<div className='flex h-screen bg-gray-100'>
			<Sidebar />
			<main className='flex-1 overflow-auto'>
				{/* Sticky Header Container */}
				<div className='sticky top-0 z-50 bg-white'>
					{/* Top Header Bar */}
					<div className='border-b border-gray-200 px-4 lg:px-6 py-3'>
						<div className='flex items-center justify-between'>
							<div className='flex items-center space-x-4'>
								<h1 className='text-xl font-semibold text-gray-900'>
									{dbUser.firstName} {dbUser.lastName}
								</h1>
							</div>
							<div className='flex items-center space-x-2'>
								<ReminderBell />
							</div>
						</div>
					</div>
				</div>

				<div className='p-4 lg:p-6 pb-20 lg:pb-6'>
					{/* Trial Banner */}
					{showTrialBanner && trialEndsAt && (
						<div className='mb-6'>
							<TrialBanner
								daysRemaining={daysRemaining}
								trialEndsAt={trialEndsAt.toISOString()}
							/>
						</div>
					)}
					{children}
				</div>
			</main>
			<BottomNavigation />
			<QuickActionButton />
			<SubscriptionSuccessHandler />
		</div>
	);
}
