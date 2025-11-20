import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
	try {
		const user = await currentUser();

		if (!user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const dbUser = await prisma.user.findUnique({
			where: { clerkId: user.id },
			include: { organization: true },
		});

		if (!dbUser) {
			return NextResponse.json({ error: 'User not found' }, { status: 404 });
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
			totalDealsCount,
			wonDealsCount,
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

			// Total deals count
			prisma.deal.count({
				where: {
					organizationId: dbUser.organizationId,
				},
			}),

			// Won deals count
			prisma.deal.count({
				where: {
					organizationId: dbUser.organizationId,
					stage: 'closed_won',
				},
			}),
		]);

		// Calculate current week metrics
		const emailsSent = weeklyActivities.filter(
			(a) => a.type === 'email_sent'
		).length;
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

		// Calculate deal metrics
		const totalDeals = totalDealsCount;
		const wonDeals = wonDealsCount;
		const openDeals = activeDeals.length;

		// Transform activities for components
		const upcomingTasks = upcomingActivities.map((activity) => ({
			id: activity.id,
			type: activity.type,
			subject: activity.subject || undefined,
			notes: activity.notes || undefined,
			scheduledDate: activity.scheduledDate!,
			status: activity.status,
			company: activity.company ? { name: activity.company.name } : undefined,
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
			company: activity.company ? { name: activity.company.name } : undefined,
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

		return NextResponse.json({
			user: {
				firstName: dbUser.firstName,
				organizationName: dbUser.organization.name,
			},
			metrics: {
				totalDeals,
				openDeals,
				wonDeals,
				totalRevenue: revenue,
				emailsSent,
				linkedinMessages,
				calls,
				proposals,
			},
			currentGoal: currentGoal
				? {
						targetAmount: currentGoal.targetAmount,
						startDate: currentGoal.startDate,
						endDate: currentGoal.endDate,
				  }
				: null,
			deals: dealsData,
			upcomingTasks,
			recentActivities: recentActivityData,
			hasReportForCurrentWeek: !!currentWeekReport,
		});
	} catch (error) {
		console.error('Error fetching dashboard data:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}

