import Stripe from 'stripe';

// Initialize Stripe with the secret key
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
	apiVersion: '2025-10-29.clover',
	typescript: true,
});

// Price configuration (in cents)
export const SUBSCRIPTION_PRICE = 2900; // $29.00

// Subscription product details
export const SUBSCRIPTION_PRODUCT = {
	name: 'CloseKit Pro',
	description:
		'Full access to CloseKit with unlimited users, deals, and advanced features',
};

/**
 * Get the app URL for Stripe redirects
 */
export function getAppUrl(): string {
	return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
}

/**
 * Create a checkout session for subscription
 */
export async function createCheckoutSession({
	customerEmail,
	organizationId,
	userId,
}: {
	customerEmail: string;
	organizationId: string;
	userId: string;
}): Promise<Stripe.Checkout.Session> {
	const appUrl = getAppUrl();

	return stripe.checkout.sessions.create({
		mode: 'subscription',
		payment_method_types: ['card'],
		customer_email: customerEmail,
		line_items: [
			{
				price_data: {
					currency: 'usd',
					product_data: {
						name: SUBSCRIPTION_PRODUCT.name,
						description: SUBSCRIPTION_PRODUCT.description,
					},
					unit_amount: SUBSCRIPTION_PRICE,
					recurring: {
						interval: 'month',
					},
				},
				quantity: 1,
			},
		],
		success_url: `${appUrl}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
		cancel_url: `${appUrl}/upgrade?canceled=true`,
		metadata: {
			organizationId,
			userId,
		},
	});
}

/**
 * Get subscription details by ID
 */
export async function getSubscription(
	subscriptionId: string
): Promise<Stripe.Subscription | null> {
	try {
		return await stripe.subscriptions.retrieve(subscriptionId);
	} catch (error) {
		console.error('Error retrieving subscription:', error);
		return null;
	}
}

/**
 * Cancel a subscription
 */
export async function cancelSubscription(
	subscriptionId: string
): Promise<Stripe.Subscription | null> {
	try {
		return await stripe.subscriptions.cancel(subscriptionId);
	} catch (error) {
		console.error('Error canceling subscription:', error);
		return null;
	}
}

/**
 * Create a customer portal session for managing subscription
 */
export async function createCustomerPortalSession(
	customerId: string
): Promise<string | null> {
	try {
		const appUrl = getAppUrl();
		const session = await stripe.billingPortal.sessions.create({
			customer: customerId,
			return_url: `${appUrl}/settings`,
		});
		return session.url;
	} catch (error) {
		console.error('Error creating customer portal session:', error);
		return null;
	}
}

/**
 * Map Stripe subscription status to our internal status
 */
export function mapSubscriptionStatus(
	stripeStatus: Stripe.Subscription.Status
): 'active' | 'expired' {
	switch (stripeStatus) {
		case 'active':
		case 'trialing':
			return 'active';
		case 'past_due':
		case 'unpaid':
		case 'canceled':
		case 'incomplete':
		case 'incomplete_expired':
		case 'paused':
		default:
			return 'expired';
	}
}
