import { NextRequest, NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

// Get all pending invites for the organization
export async function GET(request: NextRequest) {
	try {
		const user = await requireAuth();

		// Only admins can view invites
		if (user.role !== 'admin') {
			return NextResponse.json(
				{ error: 'Only admins can view invites' },
				{ status: 403 }
			);
		}

		// Get all users in the organization
		const orgUsers = await prisma.user.findMany({
			where: { organizationId: user.organizationId },
			select: {
				id: true,
				email: true,
				firstName: true,
				lastName: true,
				role: true,
				createdAt: true,
			},
			orderBy: { createdAt: 'desc' },
		});

		return NextResponse.json(orgUsers);
	} catch (error) {
		console.error('Error fetching invites:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}

// Create an invite (send invitation email via Clerk)
export async function POST(request: NextRequest) {
	try {
		const user = await requireAuth();

		// Only admins can send invites
		if (user.role !== 'admin') {
			return NextResponse.json(
				{ error: 'Only admins can send invites' },
				{ status: 403 }
			);
		}

		const { email, role = 'member' } = await request.json();

		if (!email) {
			return NextResponse.json(
				{ error: 'Email is required' },
				{ status: 400 }
			);
		}

		// Check if user already exists
		const existingUser = await prisma.user.findUnique({
			where: { email },
		});

		if (existingUser) {
			return NextResponse.json(
				{ error: 'User already exists in an organization' },
				{ status: 400 }
			);
		}

		// Create an invitation using Clerk
		const client = await clerkClient();
		const invitation = await client.invitations.createInvitation({
			emailAddress: email,
			publicMetadata: {
				organizationId: user.organizationId,
				role: role,
			},
			redirectUrl: process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL || '/onboarding',
		});

		return NextResponse.json({
			success: true,
			invitation,
		});
	} catch (error) {
		console.error('Error creating invite:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
