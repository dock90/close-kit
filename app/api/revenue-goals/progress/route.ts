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

		const currentDate = new Date();

		const currentGoal = await prisma.revenueGoal.findFirst({
			where: {
				organizationId: dbUser.organizationId,
				startDate: { lte: currentDate },
				endDate: { gte: currentDate },
			},
			orderBy: { createdAt: 'desc' },
		});

		if (!currentGoal) {
			return NextResponse.json(
				{ error: 'No current revenue goal found' },
				{ status: 404 }
			);
		}

		// Calculate revenue generated in the goal period
		const wonDeals = await prisma.deal.findMany({
			where: {
				organizationId: dbUser.organizationId,
				stage: 'closed_won',
				actualCloseDate: {
					gte: currentGoal.startDate,
					lte: currentGoal.endDate,
				},
			},
			select: { value: true },
		});

		const revenueGenerated = wonDeals.reduce(
			(sum, deal) => sum + deal.value,
			0
		);
		const progress = (revenueGenerated / currentGoal.targetAmount) * 100;

		return NextResponse.json({
			goal: currentGoal,
			revenueGenerated,
			targetAmount: currentGoal.targetAmount,
			progress: Math.round(progress * 100) / 100,
			remaining: currentGoal.targetAmount - revenueGenerated,
		});
	} catch (error) {
		console.error('Error fetching revenue goal progress:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
