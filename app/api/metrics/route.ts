import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
	try {
		const user = await currentUser();
		if (!user) {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			);
		}

		const dbUser = await prisma.user.findUnique({
			where: { clerkId: user.id },
			include: { organization: true },
		});

		if (!dbUser) {
			return NextResponse.json(
				{ error: 'User not found' },
				{ status: 404 }
			);
		}

		// Date calculations
		const now = new Date();
		const startOfWeek = new Date(now);
		startOfWeek.setDate(now.getDate() - now.getDay());
		startOfWeek.setHours(0, 0, 0, 0);

		// 1. This week's activities
		const emailsSent = await prisma.activity.count({
			where: {
				organizationId: dbUser.organizationId,
				type: 'email_sent',
				createdAt: {
					gte: startOfWeek,
				},
			},
		});

		const linkedinMessages = await prisma.activity.count({
			where: {
				organizationId: dbUser.organizationId,
				type: {
					in: ['linkedin_message', 'linkedin_request'],
				},
				createdAt: {
					gte: startOfWeek,
				},
			},
		});

		const callsBooked = await prisma.activity.count({
			where: {
				organizationId: dbUser.organizationId,
				type: {
					in: ['call', 'meeting'],
				},
				createdAt: {
					gte: startOfWeek,
				},
			},
		});

		const proposalsSent = await prisma.activity.count({
			where: {
				organizationId: dbUser.organizationId,
				type: 'proposal_sent',
				createdAt: {
					gte: startOfWeek,
				},
			},
		});

		// 2. Revenue performance
		const closedWonDeals = await prisma.deal.findMany({
			where: {
				organizationId: dbUser.organizationId,
				stage: 'closed_won',
			},
			select: {
				value: true,
			},
		});

		const revenueGenerated = closedWonDeals.reduce(
			(sum, deal) => sum + deal.value,
			0
		);

		// Pipeline value (active deals)
		const activeDeals = await prisma.deal.findMany({
			where: {
				organizationId: dbUser.organizationId,
				stage: {
					notIn: ['closed_won', 'closed_lost'],
				},
			},
			select: {
				value: true,
			},
		});

		const pipelineValue = activeDeals.reduce(
			(sum, deal) => sum + deal.value,
			0
		);

		// Get revenue goal for progress calculation
		const activeGoal = await prisma.revenueGoal.findFirst({
			where: {
				organizationId: dbUser.organizationId,
				startDate: {
					lte: now,
				},
				endDate: {
					gte: now,
				},
			},
			orderBy: {
				createdAt: 'desc',
			},
		});

		const goalProgress = activeGoal
			? (revenueGenerated / activeGoal.targetAmount) * 100
			: 0;

		// 3. Weekly reports history
		const weeklyReports = await prisma.weeklyReport.findMany({
			where: {
				organizationId: dbUser.organizationId,
			},
			orderBy: {
				weekStartDate: 'desc',
			},
			take: 10,
		});

		const metrics = {
			currentWeek: {
				emailsSent,
				linkedinMessages,
				callsBooked,
				proposalsSent,
			},
			revenue: {
				revenueGenerated,
				pipelineValue,
				goalProgress: Math.round(goalProgress * 10) / 10,
				goalTarget: activeGoal?.targetAmount || 0,
			},
			weeklyReports: weeklyReports.map((report) => ({
				id: report.id,
				weekStartDate: report.weekStartDate,
				weekEndDate: report.weekEndDate,
				emailsSent: report.emailsSent,
				linkedinMessages: report.linkedinMessages,
				callsBooked: report.callsBooked,
				proposalsSent: report.proposalsSent,
				dealsClosed: report.dealsClosed,
				revenueGenerated: report.revenueGenerated,
				roadblocks: report.roadblocks,
			})),
		};

		return NextResponse.json(metrics);
	} catch (error) {
		console.error('Error fetching report metrics:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
