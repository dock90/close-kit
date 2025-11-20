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

		const salesVision = await prisma.salesVision.findUnique({
			where: {
				organizationId: dbUser.organizationId,
			},
		});

		return NextResponse.json(salesVision);
	} catch (error) {
		console.error('Error fetching sales vision:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}

export async function POST(request: NextRequest) {
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

		const data = await request.json();

		const salesVision = await prisma.salesVision.upsert({
			where: {
				organizationId: dbUser.organizationId,
			},
			update: {
				q1Vision: data.q1Vision,
				twelveMonthGoal: data.twelveMonthGoal,
				bigProblem: data.bigProblem,
				approach: data.approach,
				whatNotToDo: data.whatNotToDo,
				strategyStatement: data.strategyStatement,
				q1Focus1: data.q1Focus1,
				q1Focus2: data.q1Focus2,
				q1Focus3: data.q1Focus3,
				weeklyCadence1: data.weeklyCadence1,
				weeklyCadence2: data.weeklyCadence2,
				weeklyCadence3: data.weeklyCadence3,
				metric: data.metric,
			},
			create: {
				organizationId: dbUser.organizationId,
				q1Vision: data.q1Vision,
				twelveMonthGoal: data.twelveMonthGoal,
				bigProblem: data.bigProblem,
				approach: data.approach,
				whatNotToDo: data.whatNotToDo,
				strategyStatement: data.strategyStatement,
				q1Focus1: data.q1Focus1,
				q1Focus2: data.q1Focus2,
				q1Focus3: data.q1Focus3,
				weeklyCadence1: data.weeklyCadence1,
				weeklyCadence2: data.weeklyCadence2,
				weeklyCadence3: data.weeklyCadence3,
				metric: data.metric,
			},
		});

		return NextResponse.json(salesVision);
	} catch (error) {
		console.error('Error saving sales vision:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}

