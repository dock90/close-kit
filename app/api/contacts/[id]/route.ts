import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params;
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

		const contact = await prisma.contact.findFirst({
			where: {
				id: id,
				organizationId: dbUser.organizationId,
			},
			include: {
				company: true,
				deals: {
					include: {
						company: true,
					},
				},
				activities: {
					orderBy: { createdAt: 'desc' },
					take: 10,
				},
			},
		});

		if (!contact) {
			return NextResponse.json(
				{ error: 'Contact not found' },
				{ status: 404 }
			);
		}

		return NextResponse.json(contact);
	} catch (error) {
		console.error('Error fetching contact:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}

export async function PATCH(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params;
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

		// First verify the contact belongs to the organization
		const existingContact = await prisma.contact.findFirst({
			where: {
				id: id,
				organizationId: dbUser.organizationId,
			},
		});

		if (!existingContact) {
			return NextResponse.json(
				{ error: 'Contact not found' },
				{ status: 404 }
			);
		}

		const contact = await prisma.contact.update({
			where: {
				id: id,
			},
			data,
			include: {
				company: true,
			},
		});

		return NextResponse.json(contact);
	} catch (error) {
		console.error('Error updating contact:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}

export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params;
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

		// First verify the contact belongs to the organization
		const existingContact = await prisma.contact.findFirst({
			where: {
				id: id,
				organizationId: dbUser.organizationId,
			},
		});

		if (!existingContact) {
			return NextResponse.json(
				{ error: 'Contact not found' },
				{ status: 404 }
			);
		}

		await prisma.contact.delete({
			where: {
				id: id,
			},
		});

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error('Error deleting contact:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
