import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { formatCurrency } from '@/lib/utils';
import {
	WeekMetrics,
	RevenueProgress,
	MiniDealPipeline,
	UpcomingTasks,
	ActivityTimeline,
	WeeklyReportWidget,
} from '@/components/dashboard';

export default async function DashboardPage() {
	const user = await currentUser();

	if (!user) {
		return null;
	}

	const dbUser = await prisma.user.findUnique({
		where: { clerkId: user.id },
		include: { organization: true },
	});

	if (!dbUser) {
		return null;
	}

	// Get current week start and end
	const now = new Date();
	const weekStart = new Date(now);
	weekStart.setDate(now.getDate() - now.getDay());
	weekStart.setHours(0, 0, 0, 0);
	const weekEnd = new Date(weekStart);
	weekEnd.setDate(weekStart.getDate() + 7);

	// Get next 7 days
	const sevenDaysFromNow = new Date(now);
	sevenDaysFromNow.setDate(now.getDate() + 7);

	// Fetch all dashboard data in parallel
	const [
		currentGoal,
		totalRevenue,
		weeklyActivities,
		activeDeals,
		upcomingActivities,
		recentActivities,
		currentWeekReport,
	] = await Promise.all([
		// Current revenue goal
		prisma.revenueGoal.findFirst({
			where: {
				organizationId: dbUser.organizationId,
				startDate: { lte: now },
				endDate: { gte: now },
			},
			orderBy: { createdAt: 'desc' },
		}),

		// Total revenue
		prisma.deal.aggregate({
			where: {
				organizationId: dbUser.organizationId,
				stage: 'closed_won',
			},
			_sum: { value: true },
		}),

		// Current week activities by type
		prisma.activity.findMany({
			where: {
				organizationId: dbUser.organizationId,
				completedDate: {
					gte: weekStart,
					lt: weekEnd,
				},
				status: 'completed',
			},
			select: { type: true },
		}),

		// Active deals (not closed)
		prisma.deal.findMany({
			where: {
				organizationId: dbUser.organizationId,
				stage: { notIn: ['closed_won', 'closed_lost'] },
			},
			include: { company: true, contact: true },
			orderBy: { createdAt: 'desc' },
		}),

		// Upcoming activities (next 7 days)
		prisma.activity.findMany({
			where: {
				organizationId: dbUser.organizationId,
				status: 'scheduled',
				scheduledDate: {
					gte: now,
					lte: sevenDaysFromNow,
				},
			},
			include: { company: true, contact: true, deal: true },
			orderBy: { scheduledDate: 'asc' },
		}),

		// Recent activities (last 10)
		prisma.activity.findMany({
			where: {
				organizationId: dbUser.organizationId,
				status: 'completed',
			},
			include: { company: true, contact: true, deal: true },
			orderBy: { completedDate: 'desc' },
			take: 10,
		}),

		// Check if there's a report for current week
		prisma.weeklyReport.findFirst({
			where: {
				organizationId: dbUser.organizationId,
				weekStartDate: { gte: weekStart, lt: weekEnd },
			},
		}),
	]);

	// Calculate current week metrics
	const emailsSent = weeklyActivities.filter((a) => a.type === 'email_sent')
		.length;
	const linkedinMessages = weeklyActivities.filter(
		(a) => a.type === 'linkedin_message' || a.type === 'linkedin_request'
	).length;
	const calls = weeklyActivities.filter(
		(a) => a.type === 'call' || a.type === 'meeting'
	).length;
	const proposals = weeklyActivities.filter(
		(a) => a.type === 'proposal_sent'
	).length;

	const revenue = totalRevenue._sum.value || 0;

	// Transform activities for components
	const upcomingTasks = upcomingActivities.map((activity) => ({
		id: activity.id,
		type: activity.type,
		subject: activity.subject || undefined,
		notes: activity.notes || undefined,
		scheduledDate: activity.scheduledDate!,
		status: activity.status,
		company: activity.company
			? { name: activity.company.name }
			: undefined,
		contact: activity.contact
			? {
					firstName: activity.contact.firstName,
					lastName: activity.contact.lastName,
			  }
			: undefined,
		deal: activity.deal ? { name: activity.deal.name } : undefined,
	}));

	const recentActivityData = recentActivities.map((activity) => ({
		id: activity.id,
		type: activity.type,
		subject: activity.subject || undefined,
		notes: activity.notes || undefined,
		scheduledDate: activity.scheduledDate?.toISOString(),
		completedDate: activity.completedDate?.toISOString(),
		status: activity.status,
		company: activity.company
			? { name: activity.company.name }
			: undefined,
		contact: activity.contact
			? {
					firstName: activity.contact.firstName,
					lastName: activity.contact.lastName,
			  }
			: undefined,
		deal: activity.deal ? { name: activity.deal.name } : undefined,
	}));

	const dealsData = activeDeals.map((deal) => ({
		id: deal.id,
		name: deal.name,
		value: deal.value,
		stage: deal.stage,
		company: deal.company ? { name: deal.company.name } : undefined,
	}));

	return (
		<div className='space-y-8'>
			{/* Header */}
			<div>
				<h1 className='text-3xl font-bold text-gray-900'>Dashboard</h1>
				<p className='text-gray-600 mt-1'>
					Welcome back to {dbUser.organization.name}
				</p>
			</div>

			{/* Top Section - Metrics */}
			<div className='space-y-4'>
				<h2 className='text-xl font-semibold text-gray-900'>
					This Week's Activity
				</h2>
				<WeekMetrics
					emailsSent={emailsSent}
					linkedinMessages={linkedinMessages}
					calls={calls}
					proposals={proposals}
				/>
			</div>

		{/* Revenue Progress */}
		{currentGoal && (
			<RevenueProgress
				currentRevenue={revenue}
				targetRevenue={currentGoal.targetAmount}
				period='Current Goal'
				startDate={currentGoal.startDate}
				endDate={currentGoal.endDate}
			/>
		)}

			{/* Middle Section - Pipeline */}
			<div className='space-y-4'>
				<h2 className='text-xl font-semibold text-gray-900'>
					Deal Pipeline
				</h2>
				<MiniDealPipeline deals={dealsData} />
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
					<ActivityTimeline
						activities={recentActivityData}
						limit={10}
					/>
				</div>
			</div>

			{/* Floating Widget - Weekly Report Prompt */}
			<WeeklyReportWidget
				hasReportForCurrentWeek={!!currentWeekReport}
			/>
		</div>
	);
}
