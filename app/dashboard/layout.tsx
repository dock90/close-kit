import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Sidebar } from '@/components/sidebar';
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
				<div className='p-4 lg:p-6 pb-20 lg:pb-6'>{children}</div>
			</main>
			<BottomNavigation />
		</div>
	);
}
