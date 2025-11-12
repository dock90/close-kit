import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { TeamManagement } from '@/components/settings/TeamManagement';

export default async function TeamSettingsPage() {
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

	// Get all team members
	const teamMembers = await prisma.user.findMany({
		where: { organizationId: dbUser.organizationId },
		orderBy: { createdAt: 'desc' },
	});

	return (
		<div className='space-y-6'>
			<div>
				<h1 className='text-3xl font-bold text-gray-900'>Team Management</h1>
				<p className='mt-2 text-sm text-gray-600'>
					Manage your team members and send invitations
				</p>
			</div>

			<TeamManagement 
				currentUser={dbUser} 
				teamMembers={teamMembers} 
			/>
		</div>
	);
}
