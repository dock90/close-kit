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

		// 1. Outreach Volume (this week)
		const outreachActivities = await prisma.activity.findMany({
			where: {
				organizationId: dbUser.organizationId,
				type: {
					in: ['email_sent', 'linkedin_message'],
				},
				createdAt: {
					gte: startOfWeek,
				},
			},
		});

		const outreachVolume = outreachActivities.length;

		// 2. Pipeline Value (active deals)
		const activeDeals = await prisma.deal.findMany({
			where: {
				organizationId: dbUser.organizationId,
				stage: {
					notIn: ['closed_won', 'closed_lost'],
				},
			},
			select: {
				value: true,
				probability: true,
				createdAt: true,
				actualCloseDate: true,
			},
		});

		const pipelineValue = activeDeals.reduce(
			(sum, deal) => sum + deal.value,
			0
		);

		// 3. Weighted Pipeline
		const weightedPipeline = activeDeals.reduce(
			(sum, deal) => sum + (deal.value * deal.probability) / 100,
			0
		);

		// 4. Conversion Rate (Proposals sent → Deals closed)
		const proposalsSent = await prisma.activity.count({
			where: {
				organizationId: dbUser.organizationId,
				type: 'proposal_sent',
			},
		});

		const dealsClosedWon = await prisma.deal.count({
			where: {
				organizationId: dbUser.organizationId,
				stage: 'closed_won',
			},
		});

		const conversionRate =
			proposalsSent > 0 ? (dealsClosedWon / proposalsSent) * 100 : 0;

		// 5. Average Deal Size
		const closedWonDeals = await prisma.deal.findMany({
			where: {
				organizationId: dbUser.organizationId,
				stage: 'closed_won',
			},
			select: {
				value: true,
			},
		});

		const totalRevenue = closedWonDeals.reduce(
			(sum, deal) => sum + deal.value,
			0
		);
		const averageDealSize =
			closedWonDeals.length > 0
				? totalRevenue / closedWonDeals.length
				: 0;

		// 6. Days to Close (Average time from creation to closed-won)
		const closedDealsWithDates = await prisma.deal.findMany({
			where: {
				organizationId: dbUser.organizationId,
				stage: 'closed_won',
				actualCloseDate: {
					not: null,
				},
			},
			select: {
				createdAt: true,
				actualCloseDate: true,
			},
		});

		let averageDaysToClose = 0;
		if (closedDealsWithDates.length > 0) {
			const totalDays = closedDealsWithDates.reduce((sum, deal) => {
				const daysDiff = Math.floor(
					(deal.actualCloseDate!.getTime() -
						deal.createdAt.getTime()) /
						(1000 * 60 * 60 * 24)
				);
				return sum + daysDiff;
			}, 0);
			averageDaysToClose = Math.round(
				totalDays / closedDealsWithDates.length
			);
		}

		// 7. Activity Streak (Consecutive days of 6+ outreach actions)
		const thirtyDaysAgo = new Date(now);
		thirtyDaysAgo.setDate(now.getDate() - 30);

		const recentActivities = await prisma.activity.findMany({
			where: {
				organizationId: dbUser.organizationId,
				type: {
					in: [
						'email_sent',
						'linkedin_message',
						'linkedin_request',
						'call',
					],
				},
				createdAt: {
					gte: thirtyDaysAgo,
				},
			},
			select: {
				createdAt: true,
			},
			orderBy: {
				createdAt: 'desc',
			},
		});

		// Group activities by day and count streak
		const activityByDay = new Map<string, number>();
		recentActivities.forEach((activity) => {
			const dateKey = activity.createdAt.toISOString().split('T')[0];
			activityByDay.set(dateKey, (activityByDay.get(dateKey) || 0) + 1);
		});

		let activityStreak = 0;
		let currentDate = new Date(now);
		currentDate.setHours(0, 0, 0, 0);

		while (true) {
			const dateKey = currentDate.toISOString().split('T')[0];
			const count = activityByDay.get(dateKey) || 0;

			if (count >= 6) {
				activityStreak++;
				currentDate.setDate(currentDate.getDate() - 1);
			} else {
				break;
			}
		}

		const metrics = {
			outreachVolume,
			pipelineValue,
			weightedPipeline,
			conversionRate: Math.round(conversionRate * 10) / 10, // Round to 1 decimal
			averageDealSize,
			averageDaysToClose,
			activityStreak,
		};

		return NextResponse.json(metrics);
	} catch (error) {
		console.error('Error fetching success metrics:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
