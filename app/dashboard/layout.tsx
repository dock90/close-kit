import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Sidebar } from '@/components/sidebar';
import { QuickActionButton } from '@/components/quick-actions';
import { ReminderBell } from '@/components/reminders';
import { BottomNavigation } from '@/components/ui/bottom-navigation';

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

	return (
		<div className='flex h-screen bg-gray-100'>
			<Sidebar />
			<main className='flex-1 overflow-auto'>
				{/* Header with Reminder Bell */}
				<div className='bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-end'>
					<ReminderBell />
				</div>
				<div className='p-6'>{children}</div>
			</main>
			{/* Quick Action Floating Button */}
			<QuickActionButton />
      <BottomNavigation />
		</div>
	);
}
