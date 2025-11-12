import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { BillingManagement } from '@/components/settings/BillingManagement';

export default async function BillingSettingsPage() {
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

	return (
		<BillingManagement
			organization={{
				id: dbUser.organization.id,
				name: dbUser.organization.name,
				subscriptionStatus: dbUser.organization.subscriptionStatus,
				subscriptionId: dbUser.organization.subscriptionId,
				stripeCustomerId: dbUser.organization.stripeCustomerId,
				trialEndsAt:
					dbUser.organization.trialEndsAt?.toISOString() || null,
			}}
			isAdmin={dbUser.role === 'admin'}
		/>
	);
}
