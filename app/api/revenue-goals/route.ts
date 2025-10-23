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

		return NextResponse.json(currentGoal);
	} catch (error) {
		console.error('Error fetching revenue goal:', error);
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

		const goal = await prisma.revenueGoal.create({
			data: {
				...data,
				organizationId: dbUser.organizationId,
			},
		});

		return NextResponse.json(goal);
	} catch (error) {
		console.error('Error creating revenue goal:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
