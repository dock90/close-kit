import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { createCheckoutSession } from '@/lib/stripe';

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

		// Check if they already have an active subscription
		if (dbUser.organization.subscriptionStatus === 'active') {
			return NextResponse.json(
				{ error: 'Already subscribed' },
				{ status: 400 }
			);
		}

		// Create Stripe checkout session
		const session = await createCheckoutSession({
			customerEmail: dbUser.email,
			organizationId: dbUser.organizationId,
			userId: dbUser.id,
		});

		return NextResponse.json({ sessionId: session.id, url: session.url });
	} catch (error) {
		console.error('Error creating checkout session:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}

