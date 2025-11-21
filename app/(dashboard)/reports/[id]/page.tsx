'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ActivityList } from '@/components/activities';
import { ArrowLeft, TrendingUp, Mail, MessageSquare, Phone, FileText, DollarSign } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface WeeklyReportDetail {
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
	activities: any[];
	deals: any[];
}

export default function WeeklyReportDetailPage() {
	const router = useRouter();
	const params = useParams();
	const reportId = params.id as string;

	const [report, setReport] = useState<WeeklyReportDetail | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		fetchReport();
	}, [reportId]);

	const fetchReport = async () => {
		try {
			setIsLoading(true);
			const response = await fetch(`/api/weekly-reports/${reportId}`);
			if (response.ok) {
				const data = await response.json();
				// Parse dates in activities
				const parsedActivities = data.activities.map((activity: any) => ({
					...activity,
					scheduledDate: activity.scheduledDate
						? new Date(activity.scheduledDate)
						: undefined,
					completedDate: activity.completedDate
						? new Date(activity.completedDate)
						: undefined,
					createdAt: new Date(activity.createdAt),
				}));
				setReport({ ...data, activities: parsedActivities });
			} else {
				router.push('/reports');
			}
		} catch (error) {
			console.error('Error fetching report:', error);
			router.push('/reports');
		} finally {
			setIsLoading(false);
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
					<p className='text-gray-600'>Loading report...</p>
				</div>
			</div>
		);
	}

	if (!report) {
		return (
			<div className='space-y-6'>
				<button
					onClick={() => router.back()}
					className='flex items-center space-x-2 text-gray-600 hover:text-gray-900'
				>
					<ArrowLeft className='h-5 w-5' />
					<span>Back</span>
				</button>
				<div className='text-center py-12'>
					<p className='text-gray-500'>Report not found</p>
				</div>
			</div>
		);
	}

	const totalActivities =
		report.emailsSent +
		report.linkedinMessages +
		report.callsBooked +
		report.proposalsSent;

	return (
		<div className='space-y-6'>
			{/* Header */}
			<div className='flex items-center space-x-4'>
				<button
					onClick={() => router.back()}
					className='p-2 text-gray-400 hover:text-gray-600 touch-manipulation'
					style={{ minHeight: '44px', minWidth: '44px' }}
				>
					<ArrowLeft className='h-5 w-5' />
				</button>
				<div>
					<h1 className='text-3xl font-bold text-gray-900'>
						Weekly Report
					</h1>
					<p className='text-gray-600'>
						{formatDate(report.weekStartDate)} -{' '}
						{formatDate(report.weekEndDate)}
					</p>
				</div>
			</div>

			{/* Key Metrics */}
			<div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
				<Card>
					<CardContent className='pt-6'>
						<div className='flex items-center space-x-3'>
							<div className='p-3 bg-blue-100 rounded-lg'>
								<Mail className='h-6 w-6 text-blue-600' />
							</div>
							<div>
								<p className='text-2xl font-bold text-gray-900'>
									{report.emailsSent}
								</p>
								<p className='text-sm text-gray-600'>Emails Sent</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className='pt-6'>
						<div className='flex items-center space-x-3'>
							<div className='p-3 bg-purple-100 rounded-lg'>
								<MessageSquare className='h-6 w-6 text-purple-600' />
							</div>
							<div>
								<p className='text-2xl font-bold text-gray-900'>
									{report.linkedinMessages}
								</p>
								<p className='text-sm text-gray-600'>
									LinkedIn Messages
								</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className='pt-6'>
						<div className='flex items-center space-x-3'>
							<div className='p-3 bg-green-100 rounded-lg'>
								<Phone className='h-6 w-6 text-green-600' />
							</div>
							<div>
								<p className='text-2xl font-bold text-gray-900'>
									{report.callsBooked}
								</p>
								<p className='text-sm text-gray-600'>Calls Booked</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className='pt-6'>
						<div className='flex items-center space-x-3'>
							<div className='p-3 bg-orange-100 rounded-lg'>
								<FileText className='h-6 w-6 text-orange-600' />
							</div>
							<div>
								<p className='text-2xl font-bold text-gray-900'>
									{report.proposalsSent}
								</p>
								<p className='text-sm text-gray-600'>Proposals</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Performance Summary */}
			<Card>
				<CardHeader>
					<CardTitle>Performance Summary</CardTitle>
				</CardHeader>
				<CardContent>
					<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
						<div className='text-center p-4 bg-gray-50 rounded-lg'>
							<div className='flex items-center justify-center space-x-2 mb-2'>
								<TrendingUp className='h-5 w-5 text-blue-600' />
								<p className='text-sm font-medium text-gray-700'>
									Total Activities
								</p>
							</div>
							<p className='text-3xl font-bold text-gray-900'>
								{totalActivities}
							</p>
						</div>
						<div className='text-center p-4 bg-gray-50 rounded-lg'>
							<div className='flex items-center justify-center space-x-2 mb-2'>
								<DollarSign className='h-5 w-5 text-green-600' />
								<p className='text-sm font-medium text-gray-700'>
									Deals Closed
								</p>
							</div>
							<p className='text-3xl font-bold text-gray-900'>
								{report.dealsClosed}
							</p>
						</div>
						<div className='text-center p-4 bg-gray-50 rounded-lg'>
							<div className='flex items-center justify-center space-x-2 mb-2'>
								<DollarSign className='h-5 w-5 text-green-600' />
								<p className='text-sm font-medium text-gray-700'>
									Revenue Generated
								</p>
							</div>
							<p className='text-3xl font-bold text-green-600'>
								{formatCurrency(report.revenueGenerated)}
							</p>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Roadblocks */}
			{report.roadblocks && (
				<Card>
					<CardHeader>
						<CardTitle>Roadblocks & Challenges</CardTitle>
					</CardHeader>
					<CardContent>
						<p className='text-gray-700 whitespace-pre-wrap'>
							{report.roadblocks}
						</p>
					</CardContent>
				</Card>
			)}

			{/* Deals Closed */}
			{report.deals.length > 0 && (
				<Card>
					<CardHeader>
						<CardTitle>Deals Closed This Week</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='space-y-3'>
							{report.deals.map((deal: any) => (
								<div
									key={deal.id}
									className='flex items-center justify-between p-4 border border-gray-200 rounded-lg'
								>
									<div>
										<h4 className='font-medium text-gray-900'>
											{deal.name}
										</h4>
										<p className='text-sm text-gray-600'>
											{deal.company?.name} •{' '}
											{deal.contact?.firstName}{' '}
											{deal.contact?.lastName}
										</p>
									</div>
									<div className='text-right'>
										<p className='text-lg font-semibold text-green-600'>
											{formatCurrency(deal.value)}
										</p>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			)}

			{/* Activities */}
			<div>
				<h2 className='text-2xl font-bold text-gray-900 mb-4'>
					Activities This Week
				</h2>
				<ActivityList activities={report.activities} showFilters={true} />
			</div>
		</div>
	);
}

