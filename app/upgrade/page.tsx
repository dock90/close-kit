import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import UpgradePageClient from './UpgradePageClient';

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
		<UpgradePageClient
			isTrialExpired={isTrialExpired}
			daysRemaining={daysRemaining}
		/>
	);
}

