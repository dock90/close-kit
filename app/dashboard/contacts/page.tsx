import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function ContactsPage() {
	return (
		<div className='space-y-6'>
			<div className='flex justify-between items-center'>
				<div>
					<h1 className='text-3xl font-bold text-gray-900'>
						Contacts
					</h1>
					<p className='text-gray-600'>
						Manage your prospect contacts
					</p>
				</div>
				<Link
					href='/contacts/new'
					className='inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
				>
					<Plus className='h-4 w-4 mr-2' />
					Add Contact
				</Link>
			</div>

			{/* Contacts List */}
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
				{/* Sample contact card */}
				<Card>
					<CardHeader>
						<CardTitle className='text-lg'>John Doe</CardTitle>
					</CardHeader>
					<CardContent>
						<p className='text-sm text-gray-600 mb-2'>
							CEO at Acme Corp
						</p>
						<p className='text-sm text-gray-500 mb-2'>
							john@acme.com
						</p>
						<p className='text-sm text-gray-500'>
							2 deals • 5 activities
						</p>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
