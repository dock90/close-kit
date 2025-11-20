'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';

interface ReportMetrics {
	currentWeek: {
		emailsSent: number;
		linkedinMessages: number;
		callsBooked: number;
		proposalsSent: number;
	};
	revenue: {
		revenueGenerated: number;
		pipelineValue: number;
		goalProgress: number;
		goalTarget: number;
	};
	weeklyReports: Array<{
		id: string;
		weekStartDate: string;
		weekEndDate: string;
		emailsSent: number;
		linkedinMessages: number;
		callsBooked: number;
		proposalsSent: number;
		dealsClosed: number;
		revenueGenerated: number;
		roadblocks?: string;
	}>;
}

export default function ReportsPage() {
	const [metrics, setMetrics] = useState<ReportMetrics | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchMetrics = async () => {
			try {
				setIsLoading(true);
				const response = await fetch('/api/metrics');
				if (!response.ok) {
					throw new Error('Failed to fetch metrics');
				}
				const data = await response.json();
				setMetrics(data);
			} catch (error) {
				console.error('Error fetching report metrics:', error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchMetrics();
	}, []);

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
		});
	};

	if (isLoading) {
		return (
			<div className='flex items-center justify-center py-12'>
				<div className='text-center'>
					<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
					<p className='text-gray-600'>Loading reports...</p>
				</div>
			</div>
		);
	}

	if (!metrics) {
		return (
			<div className='text-center py-12'>
				<p className='text-gray-500'>
					Failed to load report metrics. Please try again.
				</p>
			</div>
		);
	}

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
								{metrics.currentWeek.emailsSent}
							</div>
							<div className='text-sm text-gray-600'>
								Emails Sent
							</div>
						</div>
						<div className='text-center'>
							<div className='text-2xl font-bold text-blue-600'>
								{metrics.currentWeek.linkedinMessages}
							</div>
							<div className='text-sm text-gray-600'>
								LinkedIn Messages
							</div>
						</div>
						<div className='text-center'>
							<div className='text-2xl font-bold text-green-600'>
								{metrics.currentWeek.callsBooked}
							</div>
							<div className='text-sm text-gray-600'>
								Calls Booked
							</div>
						</div>
						<div className='text-center'>
							<div className='text-2xl font-bold text-purple-600'>
								{metrics.currentWeek.proposalsSent}
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
							{formatCurrency(
								metrics.revenue.revenueGenerated
							)}
						</div>
							<div className='text-sm text-gray-600'>
								Revenue Generated
							</div>
						</div>
						<div className='text-center'>
							<div className='text-3xl font-bold text-indigo-600'>
								{formatCurrency(
									metrics.revenue.pipelineValue / 100
								)}
							</div>
							<div className='text-sm text-gray-600'>
								Pipeline Value
							</div>
						</div>
						<div className='text-center'>
							<div className='text-3xl font-bold text-blue-600'>
								{metrics.revenue.goalProgress.toFixed(1)}%
							</div>
							<div className='text-sm text-gray-600'>
								Goal Progress
								{metrics.revenue.goalTarget > 0 && (
									<span className='block text-xs text-gray-500 mt-1'>
										Target:{' '}
										{formatCurrency(
											metrics.revenue.goalTarget / 100
										)}
									</span>
								)}
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
					{metrics.weeklyReports.length === 0 ? (
						<div className='text-center py-8'>
							<p className='text-gray-500'>
								No weekly reports yet. Start tracking your
								progress!
							</p>
						</div>
					) : (
						<div className='space-y-4'>
							{metrics.weeklyReports.map((report) => (
								<div
									key={report.id}
									className='flex items-center justify-between p-4 border rounded-lg'
								>
									<div>
										<h4 className='font-medium'>
											Week of{' '}
											{formatDate(report.weekStartDate)} -{' '}
											{formatDate(report.weekEndDate)}
										</h4>
										<p className='text-sm text-gray-600'>
											{report.emailsSent} emails •{' '}
											{report.linkedinMessages} LinkedIn
											messages • {report.callsBooked}{' '}
											calls
											{report.proposalsSent > 0 &&
												` • ${report.proposalsSent} proposals`}
										</p>
										{report.dealsClosed > 0 && (
											<p className='text-sm text-green-600 mt-1'>
												{report.dealsClosed} deals
												closed
											</p>
										)}
									</div>
								<div className='text-right'>
									<div className='font-semibold text-green-600'>
										{formatCurrency(
											report.revenueGenerated
										)}
									</div>
										<div className='text-sm text-gray-500'>
											Revenue
										</div>
									</div>
								</div>
							))}
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
