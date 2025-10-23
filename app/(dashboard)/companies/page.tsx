import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function CompaniesPage() {
	return (
		<div className='space-y-6'>
			<div className='flex justify-between items-center'>
				<div>
					<h1 className='text-3xl font-bold text-gray-900'>
						Companies
					</h1>
					<p className='text-gray-600'>
						Manage your prospect companies
					</p>
				</div>
				<Link
					href='/companies/new'
					className='inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
				>
					<Plus className='h-4 w-4 mr-2' />
					Add Company
				</Link>
			</div>

			{/* Companies List */}
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
				{/* This will be populated with actual companies data */}
				<Card>
					<CardHeader>
						<CardTitle className='text-lg'>
							Sample Company
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className='text-sm text-gray-600 mb-2'>
							Healthcare • 50-100 employees
						</p>
						<p className='text-sm text-gray-500'>
							2 contacts • 1 deal
						</p>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
