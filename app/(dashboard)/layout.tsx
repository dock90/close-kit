import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Sidebar } from '@/components/sidebar';
import { BottomNavigation } from '@/components/ui/bottom-navigation';
import { TrialBanner } from '@/components/trial-banner';
import { SubscriptionSuccessHandler } from '@/components/SubscriptionSuccessHandler';

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
				<div className='p-4 lg:p-6 pb-20 lg:pb-6'>
					{showTrialBanner && trialEndsAt && (
						<div className='relative z-50 mb-6'>
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
			<SubscriptionSuccessHandler />
		</div>
	);
}
