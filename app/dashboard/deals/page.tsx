import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';

const stages = [
	{ id: 'lead', name: 'Lead', color: 'bg-gray-100' },
	{ id: 'contacted', name: 'Contacted', color: 'bg-blue-100' },
	{ id: 'discovery', name: 'Discovery', color: 'bg-yellow-100' },
	{ id: 'proposal', name: 'Proposal', color: 'bg-orange-100' },
	{ id: 'negotiation', name: 'Negotiation', color: 'bg-purple-100' },
	{ id: 'closed_won', name: 'Closed Won', color: 'bg-green-100' },
	{ id: 'closed_lost', name: 'Closed Lost', color: 'bg-red-100' },
];

export default async function DealsPage() {
	return (
		<div className='space-y-6'>
			<div className='flex justify-between items-center'>
				<div>
					<h1 className='text-3xl font-bold text-gray-900'>
						Deals Pipeline
					</h1>
					<p className='text-gray-600'>
						Track your deals through the sales process
					</p>
				</div>
				<Link
					href='/deals/new'
					className='inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
				>
					<Plus className='h-4 w-4 mr-2' />
					Add Deal
				</Link>
			</div>

			{/* Kanban Board */}
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-6'>
				{stages.map((stage) => (
					<div key={stage.id} className='space-y-4'>
						<div className='flex items-center space-x-2'>
							<div
								className={`w-3 h-3 rounded-full ${stage.color}`}
							></div>
							<h3 className='font-medium text-gray-900'>
								{stage.name}
							</h3>
						</div>

						<div className='space-y-3'>
							{/* Sample deal card */}
							<Card className='hover:shadow-md transition-shadow'>
								<CardHeader className='pb-2'>
									<CardTitle className='text-sm'>
										Sample Deal
									</CardTitle>
								</CardHeader>
								<CardContent className='pt-0'>
									<p className='text-sm text-gray-600 mb-2'>
										Acme Corp
									</p>
									<p className='text-lg font-semibold text-green-600'>
										{formatCurrency(5000000)}
									</p>
									<p className='text-xs text-gray-500'>
										Expected: Dec 2024
									</p>
								</CardContent>
							</Card>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
