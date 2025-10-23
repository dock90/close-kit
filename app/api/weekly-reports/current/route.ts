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

		// Get current week start and end dates
		const now = new Date();
		const currentWeekStart = new Date(now);
		currentWeekStart.setDate(now.getDate() - now.getDay()); // Start of week (Sunday)
		currentWeekStart.setHours(0, 0, 0, 0);

		const currentWeekEnd = new Date(currentWeekStart);
		currentWeekEnd.setDate(currentWeekStart.getDate() + 6); // End of week (Saturday)
		currentWeekEnd.setHours(23, 59, 59, 999);

		const currentReport = await prisma.weeklyReport.findFirst({
			where: {
				organizationId: dbUser.organizationId,
				weekStartDate: currentWeekStart,
			},
		});

		return NextResponse.json(currentReport);
	} catch (error) {
		console.error('Error fetching current weekly report:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
