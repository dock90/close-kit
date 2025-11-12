import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { stripe, mapSubscriptionStatus } from '@/lib/stripe';
import Stripe from 'stripe';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
	try {
		const body = await request.text();
		const signature = request.headers.get('stripe-signature');

		if (!signature) {
			return NextResponse.json(
				{ error: 'No signature' },
				{ status: 400 }
			);
		}

		let event: Stripe.Event;

		try {
			event = stripe.webhooks.constructEvent(
				body,
				signature,
				webhookSecret
			);
		} catch (err) {
			console.error('Webhook signature verification failed:', err);
			return NextResponse.json(
				{ error: 'Invalid signature' },
				{ status: 400 }
			);
		}

		// Handle the event
		switch (event.type) {
			case 'checkout.session.completed': {
				const session = event.data.object as Stripe.Checkout.Session;
				const organizationId = session.metadata?.organizationId;
				const subscriptionId = session.subscription as string;
				const customerId = session.customer as string;

				if (organizationId && subscriptionId) {
					await prisma.organization.update({
						where: { id: organizationId },
						data: {
							subscriptionStatus: 'active',
							subscriptionId: subscriptionId,
							stripeCustomerId: customerId,
						},
					});
					console.log(
						`Subscription activated for organization ${organizationId}`
					);
				}
				break;
			}

			case 'customer.subscription.updated': {
				const subscription = event.data.object as Stripe.Subscription;
				const subscriptionId = subscription.id;

				// Find organization by subscription ID
				const organization = await prisma.organization.findFirst({
					where: { subscriptionId },
				});

				if (organization) {
					const status = mapSubscriptionStatus(subscription.status);

					await prisma.organization.update({
						where: { id: organization.id },
						data: { subscriptionStatus: status },
					});
					console.log(
						`Subscription updated for organization ${organization.id}: ${status}`
					);
				}
				break;
			}

			case 'customer.subscription.deleted': {
				const subscription = event.data.object as Stripe.Subscription;
				const subscriptionId = subscription.id;

				// Find organization by subscription ID
				const organization = await prisma.organization.findFirst({
					where: { subscriptionId },
				});

				if (organization) {
					await prisma.organization.update({
						where: { id: organization.id },
						data: {
							subscriptionStatus: 'expired',
						},
					});
					console.log(
						`Subscription canceled for organization ${organization.id}`
					);
				}
				break;
			}

		case 'invoice.payment_failed': {
			const invoice = event.data.object as Stripe.Invoice;
			// subscription can be a string, Subscription object, or null
			const subscription = (invoice as any).subscription;
			const subscriptionId =
				typeof subscription === 'string'
					? subscription
					: subscription?.id;

			if (subscriptionId) {
				const organization = await prisma.organization.findFirst({
					where: { subscriptionId },
				});

				if (organization) {
					await prisma.organization.update({
						where: { id: organization.id },
						data: { subscriptionStatus: 'expired' },
					});
					console.log(
						`Payment failed for organization ${organization.id}`
					);
				}
			}
			break;
		}

			default:
				console.log(`Unhandled event type: ${event.type}`);
		}

		return NextResponse.json({ received: true });
	} catch (error) {
		console.error('Error processing webhook:', error);
		return NextResponse.json(
			{ error: 'Webhook processing failed' },
			{ status: 500 }
		);
	}
}

