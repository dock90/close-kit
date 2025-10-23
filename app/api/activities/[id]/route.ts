import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } }
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

		const activity = await prisma.activity.findFirst({
			where: {
				id: params.id,
				organizationId: dbUser.organizationId,
			},
			include: {
				company: true,
				contact: true,
				deal: true,
			},
		});

		if (!activity) {
			return NextResponse.json(
				{ error: 'Activity not found' },
				{ status: 404 }
			);
		}

		return NextResponse.json(activity);
	} catch (error) {
		console.error('Error fetching activity:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}

export async function PUT(
	request: NextRequest,
	{ params }: { params: { id: string } }
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

		// Check if activity exists and belongs to user's organization
		const existingActivity = await prisma.activity.findFirst({
			where: {
				id: params.id,
				organizationId: dbUser.organizationId,
			},
		});

		if (!existingActivity) {
			return NextResponse.json(
				{ error: 'Activity not found' },
				{ status: 404 }
			);
		}

		const data = await request.json();

		const activity = await prisma.activity.update({
			where: { id: params.id },
			data,
			include: {
				company: true,
				contact: true,
				deal: true,
			},
		});

		return NextResponse.json(activity);
	} catch (error) {
		console.error('Error updating activity:', error);
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

		// Check if activity exists and belongs to user's organization
		const existingActivity = await prisma.activity.findFirst({
			where: {
				id: params.id,
				organizationId: dbUser.organizationId,
			},
		});

		if (!existingActivity) {
			return NextResponse.json(
				{ error: 'Activity not found' },
				{ status: 404 }
			);
		}

		await prisma.activity.delete({
			where: { id: params.id },
		});

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error('Error deleting activity:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
