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

		const { searchParams } = new URL(request.url);
		const status = searchParams.get('status');

		const where: any = {
			organizationId: dbUser.organizationId,
		};

		if (status) {
			where.status = status;
		}

		const reminders = await prisma.reminder.findMany({
			where,
			include: {
				contact: {
					select: {
						firstName: true,
						lastName: true,
					},
				},
				deal: {
					select: {
						name: true,
					},
				},
				activity: {
					select: {
						type: true,
						subject: true,
					},
				},
			},
			orderBy: { dueDate: 'asc' },
		});

		return NextResponse.json(reminders);
	} catch (error) {
		console.error('Error fetching reminders:', error);
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
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const dbUser = await prisma.user.findUnique({
			where: { clerkId: user.id },
		});

		if (!dbUser) {
			return NextResponse.json({ error: 'User not found' }, { status: 404 });
		}

		const body = await request.json();
		const {
			type,
			title,
			description,
			dueDate,
			priority,
			activityId,
			dealId,
			contactId,
		} = body;

		if (!type || !title || !dueDate) {
			return NextResponse.json(
				{ error: 'Missing required fields' },
				{ status: 400 }
			);
		}

		const reminder = await prisma.reminder.create({
			data: {
				type,
				title,
				description,
				dueDate: new Date(dueDate),
				priority: priority || 'medium',
				activityId,
				dealId,
				contactId,
				organizationId: dbUser.organizationId,
			},
		});

		return NextResponse.json(reminder, { status: 201 });
	} catch (error) {
		console.error('Error creating reminder:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
