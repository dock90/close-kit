import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
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
		const { status } = body;

		const reminder = await prisma.reminder.updateMany({
			where: {
				id: params.id,
				organizationId: dbUser.organizationId,
			},
			data: {
				...(status && { status }),
			},
		});

		if (reminder.count === 0) {
			return NextResponse.json(
				{ error: 'Reminder not found' },
				{ status: 404 }
			);
		}

		const updatedReminder = await prisma.reminder.findUnique({
			where: { id: params.id },
		});

		return NextResponse.json(updatedReminder);
	} catch (error) {
		console.error('Error updating reminder:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}

export async function DELETE(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
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

		const reminder = await prisma.reminder.deleteMany({
			where: {
				id: params.id,
				organizationId: dbUser.organizationId,
			},
		});

		if (reminder.count === 0) {
			return NextResponse.json(
				{ error: 'Reminder not found' },
				{ status: 404 }
			);
		}

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error('Error deleting reminder:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
