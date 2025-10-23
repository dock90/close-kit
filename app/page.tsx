import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs/server';

export default async function HomePage() {
	const user = await currentUser();

	if (user) {
		redirect('/dashboard');
	}

	return (
		<div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100'>
			<div className='max-w-md w-full space-y-8'>
				<div className='text-center'>
					<h1 className='text-4xl font-bold text-gray-900 mb-2'>
						CloseKit
					</h1>
					<p className='text-lg text-gray-600 mb-8'>
						Sales Pipeline CRM for Freelancers & Agencies
					</p>
				</div>

				<div className='space-y-4'>
					<a
						href='/sign-up'
						className='w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
					>
						Get Started
					</a>

					<a
						href='/sign-in'
						className='w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
					>
						Sign In
					</a>
				</div>
			</div>
		</div>
	);
}
