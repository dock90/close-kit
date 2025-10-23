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

		const deal = await prisma.deal.findFirst({
			where: {
				id: params.id,
				organizationId: dbUser.organizationId,
			},
			include: {
				company: true,
				contact: true,
				activities: {
					orderBy: { createdAt: 'desc' },
				},
			},
		});

		if (!deal) {
			return NextResponse.json(
				{ error: 'Deal not found' },
				{ status: 404 }
			);
		}

		return NextResponse.json(deal);
	} catch (error) {
		console.error('Error fetching deal:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}

export async function PATCH(
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

		const data = await request.json();

		const deal = await prisma.deal.update({
			where: {
				id: params.id,
				organizationId: dbUser.organizationId,
			},
			data,
			include: {
				company: true,
				contact: true,
			},
		});

		return NextResponse.json(deal);
	} catch (error) {
		console.error('Error updating deal:', error);
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

		await prisma.deal.delete({
			where: {
				id: params.id,
				organizationId: dbUser.organizationId,
			},
		});

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error('Error deleting deal:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
