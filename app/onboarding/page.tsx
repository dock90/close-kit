import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { OnboardingForm } from '@/components/onboarding-form';

export default async function OnboardingPage() {
	const user = await currentUser();

	if (!user) {
		redirect('/sign-in');
	}

	// Check if user already has an organization
	const existingUser = await prisma.user.findUnique({
		where: { clerkId: user.id },
		include: { organization: true },
	});

	if (existingUser) {
		redirect('/dashboard');
	}

	return (
		<div className='min-h-screen flex items-center justify-center bg-gray-50'>
			<div className='max-w-md w-full space-y-8'>
				<div className='text-center'>
					<h1 className='text-3xl font-bold text-gray-900'>
						Welcome to CloseKit!
					</h1>
					<p className='mt-2 text-sm text-gray-600'>
						Let's set up your organization to get started
					</p>
				</div>

				<div className='bg-white py-8 px-6 shadow rounded-lg'>
					<OnboardingForm />
				</div>
			</div>
		</div>
	);
}
