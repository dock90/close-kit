import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	const { id } = await params;
	try {
		const user = await currentUser();
		if (!user) {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			);
		}

		const { subscriptionStatus, subscriptionId } = await request.json();

		// Verify user belongs to this organization and is admin
		const dbUser = await prisma.user.findUnique({
			where: { clerkId: user.id },
			include: { organization: true },
		});

		if (
			!dbUser ||
			dbUser.organizationId !== id ||
			dbUser.role !== 'admin'
		) {
			return NextResponse.json(
				{ error: 'Forbidden' },
				{ status: 403 }
			);
		}

		// Update organization subscription
		const organization = await prisma.organization.update({
			where: { id },
			data: {
				subscriptionStatus,
				subscriptionId: subscriptionId || undefined,
			},
		});

		return NextResponse.json(organization);
	} catch (error) {
		console.error('Error updating subscription:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}

