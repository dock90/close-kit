import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
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

		const { id } = await params;

		const report = await prisma.weeklyReport.findFirst({
			where: {
				id,
				organizationId: dbUser.organizationId,
			},
		});

		if (!report) {
			return NextResponse.json(
				{ error: 'Report not found' },
				{ status: 404 }
			);
		}

		// Fetch activities for the report week
		const activities = await prisma.activity.findMany({
			where: {
				organizationId: dbUser.organizationId,
				createdAt: {
					gte: new Date(report.weekStartDate),
					lte: new Date(report.weekEndDate),
				},
			},
			include: {
				company: true,
				contact: true,
			},
			orderBy: {
				createdAt: 'desc',
			},
		});

		// Fetch deals closed that week
		const dealsClosedThisWeek = await prisma.deal.findMany({
			where: {
				organizationId: dbUser.organizationId,
				stage: 'closed_won',
				updatedAt: {
					gte: new Date(report.weekStartDate),
					lte: new Date(report.weekEndDate),
				},
			},
			include: {
				company: true,
				contact: true,
			},
		});

		return NextResponse.json({
			...report,
			activities,
			deals: dealsClosedThisWeek,
		});
	} catch (error) {
		console.error('Error fetching weekly report:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
