import { NextRequest, NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

// Update member role
export async function PATCH(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const user = await requireAuth();

		// Only admins can update member roles
		if (user.role !== 'admin') {
			return NextResponse.json(
				{ error: 'Only admins can update member roles' },
				{ status: 403 }
			);
		}

		const { id } = await params;
		const { role } = await request.json();

		if (!role || !['admin', 'member'].includes(role)) {
			return NextResponse.json(
				{ error: 'Invalid role' },
				{ status: 400 }
			);
		}

		// Get the member
		const member = await prisma.user.findFirst({
			where: {
				id,
				organizationId: user.organizationId,
			},
		});

		if (!member) {
			return NextResponse.json(
				{ error: 'Member not found' },
				{ status: 404 }
			);
		}

		// Update role in database
		const updatedMember = await prisma.user.update({
			where: { id },
			data: { role },
		});

		// Update role in Clerk metadata
		const client = await clerkClient();
		await client.users.updateUserMetadata(member.clerkId, {
			publicMetadata: {
				organizationId: user.organizationId,
				role: role,
			},
		});

		return NextResponse.json(updatedMember);
	} catch (error) {
		console.error('Error updating member:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}

// Remove member from organization
export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const user = await requireAuth();

		// Only admins can remove members
		if (user.role !== 'admin') {
			return NextResponse.json(
				{ error: 'Only admins can remove members' },
				{ status: 403 }
			);
		}

		const { id } = await params;

		// Get the member
		const member = await prisma.user.findFirst({
			where: {
				id,
				organizationId: user.organizationId,
			},
		});

		if (!member) {
			return NextResponse.json(
				{ error: 'Member not found' },
				{ status: 404 }
			);
		}

		// Can't remove yourself
		if (member.id === user.id) {
			return NextResponse.json(
				{ error: 'You cannot remove yourself' },
				{ status: 400 }
			);
		}

		// Delete member from database
		await prisma.user.delete({
			where: { id },
		});

		// Delete user from Clerk
		const client = await clerkClient();
		await client.users.deleteUser(member.clerkId);

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error('Error removing member:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
