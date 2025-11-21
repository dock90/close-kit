'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { Plus, RefreshCw } from 'lucide-react';

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
	const router = useRouter();
	const [metrics, setMetrics] = useState<ReportMetrics | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isGenerating, setIsGenerating] = useState(false);

	useEffect(() => {
		fetchMetrics();
	}, []);

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

	const handleGenerateReport = async () => {
		try {
			setIsGenerating(true);
			const response = await fetch('/api/weekly-reports/generate', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({}),
			});

			if (response.ok) {
				// Refresh metrics to show the new report
				await fetchMetrics();
				alert('Weekly report generated successfully!');
			} else {
				throw new Error('Failed to generate report');
			}
		} catch (error) {
			console.error('Error generating report:', error);
			alert('Failed to generate report. Please try again.');
		} finally {
			setIsGenerating(false);
		}
	};

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
			<div className='flex justify-between items-start'>
				<div>
					<h1 className='text-3xl font-bold text-gray-900'>Weekly Reports</h1>
					<p className='text-gray-600'>
						Track your performance and weekly progress
					</p>
				</div>
				<button
					onClick={handleGenerateReport}
					disabled={isGenerating}
					className='inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation'
					style={{ minHeight: '44px' }}
				>
					{isGenerating ? (
						<>
							<RefreshCw className='h-4 w-4 mr-2 animate-spin' />
							Generating...
						</>
					) : (
						<>
							<Plus className='h-4 w-4 mr-2' />
							Generate This Week's Report
						</>
					)}
				</button>
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
								metrics.revenue.pipelineValue
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
										metrics.revenue.goalTarget
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
							<p className='text-gray-500 mb-4'>
								No weekly reports yet. Generate your first report!
							</p>
							<button
								onClick={handleGenerateReport}
								disabled={isGenerating}
								className='inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed'
							>
								{isGenerating ? (
									<>
										<RefreshCw className='h-4 w-4 mr-2 animate-spin' />
										Generating...
									</>
								) : (
									<>
										<Plus className='h-4 w-4 mr-2' />
										Generate First Report
									</>
								)}
							</button>
						</div>
					) : (
						<div className='space-y-4'>
							{metrics.weeklyReports.map((report) => (
								<div
									key={report.id}
									onClick={() => router.push(`/reports/${report.id}`)}
									className='flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors'
								>
									<div>
										<h4 className='font-medium text-blue-600 hover:text-blue-700'>
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
