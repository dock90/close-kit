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

		const today = new Date();
		today.setHours(0, 0, 0, 0);
		const tomorrow = new Date(today);
		tomorrow.setDate(tomorrow.getDate() + 1);

		const activities = await prisma.activity.findMany({
			where: {
				organizationId: dbUser.organizationId,
				scheduledDate: {
					gte: today,
					lt: tomorrow,
				},
			},
			include: {
				company: true,
				contact: true,
				deal: true,
			},
			orderBy: { scheduledDate: 'asc' },
		});

		return NextResponse.json(activities);
	} catch (error) {
		console.error('Error fetching daily activities:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
