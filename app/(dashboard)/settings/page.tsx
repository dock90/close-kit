import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function SettingsPage() {
	return (
		<div className='space-y-6'>
			<div>
				<h1 className='text-3xl font-bold text-gray-900'>Settings</h1>
				<p className='text-gray-600'>
					Manage your account and organization settings
				</p>
			</div>

			<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
				{/* Profile Settings */}
				<Card>
					<CardHeader>
						<CardTitle>Profile Settings</CardTitle>
					</CardHeader>
					<CardContent className='space-y-4'>
						<div>
							<label
								htmlFor='firstName'
								className='block text-sm font-medium text-gray-700'
							>
								First Name
							</label>
							<input
								type='text'
								id='firstName'
								className='mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
							/>
						</div>
						<div>
							<label
								htmlFor='lastName'
								className='block text-sm font-medium text-gray-700'
							>
								Last Name
							</label>
							<input
								type='text'
								id='lastName'
								className='mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
							/>
						</div>
						<div>
							<label
								htmlFor='email'
								className='block text-sm font-medium text-gray-700'
							>
								Email
							</label>
							<input
								type='email'
								id='email'
								className='mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
							/>
						</div>
						<button className='w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'>
							Update Profile
						</button>
					</CardContent>
				</Card>

				{/* Organization Settings */}
				<Card>
					<CardHeader>
						<CardTitle>Organization Settings</CardTitle>
					</CardHeader>
					<CardContent className='space-y-4'>
						<div>
							<label
								htmlFor='orgName'
								className='block text-sm font-medium text-gray-700'
							>
								Organization Name
							</label>
							<input
								type='text'
								id='orgName'
								className='mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
							/>
						</div>
						<div>
							<label
								htmlFor='orgSlug'
								className='block text-sm font-medium text-gray-700'
							>
								Organization URL
							</label>
							<input
								type='text'
								id='orgSlug'
								className='mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
							/>
						</div>
						<button className='w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'>
							Update Organization
						</button>
					</CardContent>
				</Card>

				{/* Revenue Goal */}
				<Card>
					<CardHeader>
						<CardTitle>Revenue Goal</CardTitle>
					</CardHeader>
					<CardContent className='space-y-4'>
						<div>
							<label
								htmlFor='targetAmount'
								className='block text-sm font-medium text-gray-700'
							>
								Target Amount ($)
							</label>
							<input
								type='number'
								id='targetAmount'
								className='mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
								placeholder='100000'
							/>
						</div>
						<div className='grid grid-cols-2 gap-4'>
							<div>
								<label
									htmlFor='startDate'
									className='block text-sm font-medium text-gray-700'
								>
									Start Date
								</label>
								<input
									type='date'
									id='startDate'
									className='mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
								/>
							</div>
							<div>
								<label
									htmlFor='endDate'
									className='block text-sm font-medium text-gray-700'
								>
									End Date
								</label>
								<input
									type='date'
									id='endDate'
									className='mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
								/>
							</div>
						</div>
						<button className='w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'>
							Set Revenue Goal
						</button>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
