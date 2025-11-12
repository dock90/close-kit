import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { stripe, getAppUrl } from '@/lib/stripe';

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

		// Check if user is admin
		if (dbUser.role !== 'admin') {
			return NextResponse.json(
				{ error: 'Only admins can manage billing' },
				{ status: 403 }
			);
		}

		// Check if organization has an active subscription
		if (
			!dbUser.organization.subscriptionId ||
			dbUser.organization.subscriptionStatus !== 'active'
		) {
			return NextResponse.json(
				{ error: 'No active subscription found' },
				{ status: 400 }
			);
		}

		// Get the subscription to retrieve the customer ID
		const subscription = await stripe.subscriptions.retrieve(
			dbUser.organization.subscriptionId
		);

		if (!subscription.customer) {
			return NextResponse.json(
				{ error: 'No customer found for subscription' },
				{ status: 400 }
			);
		}

		const appUrl = getAppUrl();

		// Create a customer portal session
		const session = await stripe.billingPortal.sessions.create({
			customer: subscription.customer as string,
			return_url: `${appUrl}/settings/billing`,
		});

		return NextResponse.json({ url: session.url });
	} catch (error) {
		console.error('Error creating billing portal session:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
