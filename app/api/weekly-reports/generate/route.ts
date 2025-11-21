import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

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

		const { weekStartDate } = await request.json();

		// Calculate week start (Sunday) and end (Saturday)
		const startDate = weekStartDate ? new Date(weekStartDate) : new Date();
		startDate.setDate(startDate.getDate() - startDate.getDay());
		startDate.setHours(0, 0, 0, 0);

		const endDate = new Date(startDate);
		endDate.setDate(startDate.getDate() + 6);
		endDate.setHours(23, 59, 59, 999);

		// Check if report already exists
		const existingReport = await prisma.weeklyReport.findFirst({
			where: {
				organizationId: dbUser.organizationId,
				weekStartDate: {
					gte: startDate,
					lt: new Date(startDate.getTime() + 24 * 60 * 60 * 1000),
				},
			},
		});

		// Count activities for the week
		const emailsSent = await prisma.activity.count({
			where: {
				organizationId: dbUser.organizationId,
				type: 'email_sent',
				createdAt: {
					gte: startDate,
					lte: endDate,
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
					gte: startDate,
					lte: endDate,
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
					gte: startDate,
					lte: endDate,
				},
			},
		});

		const proposalsSent = await prisma.activity.count({
			where: {
				organizationId: dbUser.organizationId,
				type: 'proposal_sent',
				createdAt: {
					gte: startDate,
					lte: endDate,
				},
			},
		});

		// Count deals closed this week
		const dealsClosedThisWeek = await prisma.deal.findMany({
			where: {
				organizationId: dbUser.organizationId,
				stage: 'closed_won',
				updatedAt: {
					gte: startDate,
					lte: endDate,
				},
			},
			select: {
				value: true,
			},
		});

		const dealsClosed = dealsClosedThisWeek.length;
		const revenueGenerated = dealsClosedThisWeek.reduce(
			(sum, deal) => sum + deal.value,
			0
		);

		const reportData = {
			weekStartDate: startDate,
			weekEndDate: endDate,
			emailsSent,
			linkedinMessages,
			callsBooked,
			proposalsSent,
			dealsClosed,
			revenueGenerated,
			roadblocks: existingReport?.roadblocks || null,
		};

		let report;
		if (existingReport) {
			// Update existing report
			report = await prisma.weeklyReport.update({
				where: { id: existingReport.id },
				data: reportData,
			});
		} else {
			// Create new report
			report = await prisma.weeklyReport.create({
				data: {
					...reportData,
					organizationId: dbUser.organizationId,
				},
			});
		}

		return NextResponse.json(report);
	} catch (error) {
		console.error('Error generating weekly report:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}

