import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';

export default async function ReportsPage() {
	return (
		<div className='space-y-6'>
			<div>
				<h1 className='text-3xl font-bold text-gray-900'>Reports</h1>
				<p className='text-gray-600'>
					Track your performance and weekly progress
				</p>
			</div>

			{/* Weekly Report */}
			<Card>
				<CardHeader>
					<CardTitle>This Week's Report</CardTitle>
				</CardHeader>
				<CardContent>
					<div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
						<div className='text-center'>
							<div className='text-2xl font-bold text-indigo-600'>
								12
							</div>
							<div className='text-sm text-gray-600'>
								Emails Sent
							</div>
						</div>
						<div className='text-center'>
							<div className='text-2xl font-bold text-blue-600'>
								8
							</div>
							<div className='text-sm text-gray-600'>
								LinkedIn Messages
							</div>
						</div>
						<div className='text-center'>
							<div className='text-2xl font-bold text-green-600'>
								3
							</div>
							<div className='text-sm text-gray-600'>
								Calls Booked
							</div>
						</div>
						<div className='text-center'>
							<div className='text-2xl font-bold text-purple-600'>
								2
							</div>
							<div className='text-sm text-gray-600'>
								Proposals Sent
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Revenue Performance */}
			<Card>
				<CardHeader>
					<CardTitle>Revenue Performance</CardTitle>
				</CardHeader>
				<CardContent>
					<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
						<div className='text-center'>
							<div className='text-3xl font-bold text-green-600'>
								{formatCurrency(1250000)}
							</div>
							<div className='text-sm text-gray-600'>
								Revenue Generated
							</div>
						</div>
						<div className='text-center'>
							<div className='text-3xl font-bold text-indigo-600'>
								{formatCurrency(5000000)}
							</div>
							<div className='text-sm text-gray-600'>
								Pipeline Value
							</div>
						</div>
						<div className='text-center'>
							<div className='text-3xl font-bold text-blue-600'>
								25%
							</div>
							<div className='text-sm text-gray-600'>
								Goal Progress
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Weekly Reports History */}
			<Card>
				<CardHeader>
					<CardTitle>Weekly Reports History</CardTitle>
				</CardHeader>
				<CardContent>
					<div className='space-y-4'>
						<div className='flex items-center justify-between p-4 border rounded-lg'>
							<div>
								<h4 className='font-medium'>
									Week of Dec 2-8, 2024
								</h4>
								<p className='text-sm text-gray-600'>
									12 emails • 8 LinkedIn messages • 3 calls
								</p>
							</div>
							<div className='text-right'>
								<div className='font-semibold text-green-600'>
									{formatCurrency(500000)}
								</div>
								<div className='text-sm text-gray-500'>
									Revenue
								</div>
							</div>
						</div>

						<div className='flex items-center justify-between p-4 border rounded-lg'>
							<div>
								<h4 className='font-medium'>
									Week of Nov 25-Dec 1, 2024
								</h4>
								<p className='text-sm text-gray-600'>
									8 emails • 5 LinkedIn messages • 2 calls
								</p>
							</div>
							<div className='text-right'>
								<div className='font-semibold text-green-600'>
									{formatCurrency(750000)}
								</div>
								<div className='text-sm text-gray-500'>
									Revenue
								</div>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
