import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
	try {
		const user = await currentUser();
		if (!user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const dbUser = await prisma.user.findUnique({
			where: { clerkId: user.id },
		});

		if (!dbUser) {
			return NextResponse.json({ error: 'User not found' }, { status: 404 });
		}

		// Get today's date at midnight
		const today = new Date();
		today.setHours(0, 0, 0, 0);

		// Check if goal exists for today
		let dailyGoal = await prisma.dailyGoal.findUnique({
			where: {
				organizationId_date: {
					organizationId: dbUser.organizationId,
					date: today,
				},
			},
		});

		// If no goal exists, create one with defaults
		if (!dailyGoal) {
			dailyGoal = await prisma.dailyGoal.create({
				data: {
					date: today,
					emailsGoal: 8,
					linkedinGoal: 8,
					emailsSent: 0,
					linkedinSent: 0,
					organizationId: dbUser.organizationId,
				},
			});
		}

		// Count today's activities
		const tomorrow = new Date(today);
		tomorrow.setDate(tomorrow.getDate() + 1);

		const emailsSent = await prisma.activity.count({
			where: {
				organizationId: dbUser.organizationId,
				type: 'email_sent',
				status: 'completed',
				completedDate: {
					gte: today,
					lt: tomorrow,
				},
			},
		});

		const linkedinSent = await prisma.activity.count({
			where: {
				organizationId: dbUser.organizationId,
				type: 'linkedin_message',
				status: 'completed',
				completedDate: {
					gte: today,
					lt: tomorrow,
				},
			},
		});

		// Update the counts
		dailyGoal = await prisma.dailyGoal.update({
			where: {
				organizationId_date: {
					organizationId: dbUser.organizationId,
					date: today,
				},
			},
			data: {
				emailsSent,
				linkedinSent,
			},
		});

		return NextResponse.json(dailyGoal);
	} catch (error) {
		console.error('Error fetching daily goal:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
