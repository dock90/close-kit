import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function ActivitiesPage() {
	return (
		<div className='space-y-6'>
			<div className='flex justify-between items-center'>
				<div>
					<h1 className='text-3xl font-bold text-gray-900'>
						Activities
					</h1>
					<p className='text-gray-600'>
						Track your sales activities and outreach
					</p>
				</div>
				<Link
					href='/activities/new'
					className='inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
				>
					<Plus className='h-4 w-4 mr-2' />
					Log Activity
				</Link>
			</div>

			{/* Activities Timeline */}
			<div className='space-y-4'>
				{/* Sample activity */}
				<Card>
					<CardHeader>
						<div className='flex items-center justify-between'>
							<CardTitle className='text-lg'>
								Email Sent
							</CardTitle>
							<span className='text-sm text-gray-500'>
								2 hours ago
							</span>
						</div>
					</CardHeader>
					<CardContent>
						<p className='text-sm text-gray-600 mb-2'>
							Subject: Follow up on proposal
						</p>
						<p className='text-sm text-gray-500'>
							Sent to John Doe at Acme Corp
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<div className='flex items-center justify-between'>
							<CardTitle className='text-lg'>
								LinkedIn Message
							</CardTitle>
							<span className='text-sm text-gray-500'>
								1 day ago
							</span>
						</div>
					</CardHeader>
					<CardContent>
						<p className='text-sm text-gray-600 mb-2'>
							Connected with Sarah Smith
						</p>
						<p className='text-sm text-gray-500'>
							Sent initial outreach message
						</p>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
