'use client';

import { useEffect, useState } from 'react';
import { formatCurrency } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DailyOutreachTracker } from '@/components/outreach';
import { SuccessMetrics } from '@/components/dashboard';
import {
	DashboardHeader,
	WeekMetrics,
	RevenueProgress,
	MiniDealPipeline,
	UpcomingTasks,
	ActivityTimeline,
	WeeklyReportWidget,
} from '@/components/dashboard';
import { DashboardSkeleton } from './DashboardSkeleton';

interface DashboardData {
	user: {
		firstName: string | null;
		organizationName: string;
	};
	metrics: {
		totalDeals: number;
		openDeals: number;
		wonDeals: number;
		totalRevenue: number;
		emailsSent: number;
		linkedinMessages: number;
		calls: number;
		proposals: number;
	};
	currentGoal: {
		targetAmount: number;
		startDate: Date;
		endDate: Date;
	} | null;
	deals: Array<{
		id: string;
		name: string;
		value: number;
		stage: string;
		company?: { name: string };
	}>;
	upcomingTasks: Array<{
		id: string;
		type: string;
		subject?: string;
		notes?: string;
		scheduledDate: Date;
		status: string;
		company?: { name: string };
		contact?: { firstName: string; lastName: string };
		deal?: { name: string };
	}>;
	recentActivities: Array<{
		id: string;
		type: string;
		subject?: string;
		notes?: string;
		scheduledDate?: string;
		completedDate?: string;
		status: string;
		company?: { name: string };
		contact?: { firstName: string; lastName: string };
		deal?: { name: string };
	}>;
	hasReportForCurrentWeek: boolean;
}

export function DashboardPageClient() {
	const [data, setData] = useState<DashboardData | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		fetchDashboardData();
	}, []);

	const fetchDashboardData = async () => {
		try {
			setIsLoading(true);
			const response = await fetch('/api/dashboard');
			if (response.ok) {
				const dashboardData = await response.json();
				setData(dashboardData);
			}
		} catch (error) {
			console.error('Error fetching dashboard data:', error);
		} finally {
			setIsLoading(false);
		}
	};

	if (isLoading || !data) {
		return <DashboardSkeleton />;
	}

	const { user, metrics, currentGoal, deals, upcomingTasks, recentActivities, hasReportForCurrentWeek } = data;

	return (
		<div className='space-y-6'>
			<DashboardHeader
				totalDeals={metrics.totalDeals}
				openDeals={metrics.openDeals}
				wonDeals={metrics.wonDeals}
				totalRevenue={metrics.totalRevenue}
			/>
			<div>
				<h1 className='text-3xl font-bold text-gray-900'>
					{user.firstName ? `Welcome back, ${user.firstName}!` : 'Dashboard'}
				</h1>
				<p className='text-gray-600 mt-1'>{user.organizationName}</p>
			</div>

			{/* Daily Outreach Tracker */}
			<DailyOutreachTracker />
			{/* Success Metrics */}
			<SuccessMetrics />

			{/* Stats Cards */}
			<div>
				<h2 className='text-xl font-semibold text-gray-900 mb-4'>
					Deal Overview
				</h2>
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
					<Card>
						<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
							<CardTitle className='text-sm font-medium'>
								Total Deals
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className='text-2xl font-bold'>{metrics.totalDeals}</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
							<CardTitle className='text-sm font-medium'>
								Open Deals
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className='text-2xl font-bold'>{metrics.openDeals}</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
							<CardTitle className='text-sm font-medium'>
								Won Deals
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className='text-2xl font-bold'>{metrics.wonDeals}</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
							<CardTitle className='text-sm font-medium'>
								Total Revenue
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className='text-2xl font-bold'>
								{formatCurrency(metrics.totalRevenue)}
							</div>
						</CardContent>
					</Card>
				</div>
			</div>

			{/* Top Section - Metrics */}
			<div className='space-y-4'>
				<h2 className='text-xl font-semibold text-gray-900'>
					This Week's Activity
				</h2>
				<WeekMetrics
					emailsSent={metrics.emailsSent}
					linkedinMessages={metrics.linkedinMessages}
					calls={metrics.calls}
					proposals={metrics.proposals}
				/>
			</div>

			{/* Revenue Progress */}
			{currentGoal && (
				<RevenueProgress
					currentRevenue={metrics.totalRevenue}
					targetRevenue={currentGoal.targetAmount}
					period='Current Goal'
					startDate={currentGoal.startDate}
					endDate={currentGoal.endDate}
				/>
			)}

			{/* Middle Section - Pipeline */}
			<div className='space-y-4'>
				<h2 className='text-xl font-semibold text-gray-900'>Deal Pipeline</h2>
				<MiniDealPipeline deals={deals} />
			</div>

			{/* Bottom Section - Split View */}
			<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
				{/* Left: Upcoming Activities */}
				<div className='space-y-4'>
					<h2 className='text-xl font-semibold text-gray-900'>
						Upcoming Activities
					</h2>
					<UpcomingTasks tasks={upcomingTasks} limit={7} />
				</div>

				{/* Right: Recent Activity Timeline */}
				<div className='space-y-4'>
					<h2 className='text-xl font-semibold text-gray-900'>
						Recent Activity
					</h2>
					<ActivityTimeline activities={recentActivities} limit={10} />
				</div>
			</div>

			{/* Floating Widget - Weekly Report Prompt */}
			<WeeklyReportWidget hasReportForCurrentWeek={hasReportForCurrentWeek} />
		</div>
	);
}

