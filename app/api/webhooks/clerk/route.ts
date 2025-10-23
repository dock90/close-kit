import { NextRequest, NextResponse } from 'next/server';
import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
	const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

	if (!WEBHOOK_SECRET) {
		throw new Error('Please add CLERK_WEBHOOK_SECRET to .env');
	}

	// Get the headers
	const headerPayload = await headers();
	const svix_id = headerPayload.get('svix-id');
	const svix_timestamp = headerPayload.get('svix-timestamp');
	const svix_signature = headerPayload.get('svix-signature');

	// If there are no headers, error out
	if (!svix_id || !svix_timestamp || !svix_signature) {
		return NextResponse.json(
			{ error: 'Missing svix headers' },
			{ status: 400 }
		);
	}

	// Get the body
	const payload = await req.json();
	const body = JSON.stringify(payload);

	// Create a new Svix instance with your secret
	const wh = new Webhook(WEBHOOK_SECRET);

	let evt: any;

	// Verify the payload with the headers
	try {
		evt = wh.verify(body, {
			'svix-id': svix_id,
			'svix-timestamp': svix_timestamp,
			'svix-signature': svix_signature,
		}) as any;
	} catch (err) {
		console.error('Error verifying webhook:', err);
		return NextResponse.json(
			{ error: 'Webhook verification failed' },
			{ status: 400 }
		);
	}

	// Handle the webhook
	const eventType = evt.type;

	if (eventType === 'user.created') {
		const { id, email_addresses, first_name, last_name, public_metadata } =
			evt.data;

		// Check if user already exists
		const existingUser = await prisma.user.findUnique({
			where: { clerkId: id },
		});

		if (!existingUser) {
			// If user has organizationId in metadata (invited user), create them with org
			if (public_metadata?.organizationId) {
				await prisma.user.create({
					data: {
						clerkId: id,
						email: email_addresses[0]?.email_address || '',
						firstName: first_name || null,
						lastName: last_name || null,
						organizationId: public_metadata.organizationId as string,
						role: public_metadata.role || 'member',
					},
				});
			}
			// Otherwise, user will create org during onboarding
		}
	}

	if (eventType === 'user.updated') {
		const { id, email_addresses, first_name, last_name, public_metadata } =
			evt.data;

		const existingUser = await prisma.user.findUnique({
			where: { clerkId: id },
		});

		if (existingUser) {
			await prisma.user.update({
				where: { clerkId: id },
				data: {
					email: email_addresses[0]?.email_address || existingUser.email,
					firstName: first_name || existingUser.firstName,
					lastName: last_name || existingUser.lastName,
				},
			});
		}
	}

	if (eventType === 'user.deleted') {
		const { id } = evt.data;
		await prisma.user.delete({
			where: { clerkId: id },
		});
	}

	return NextResponse.json({ success: true });
}
