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

		const company = await prisma.company.findFirst({
			where: {
				id: id,
				organizationId: dbUser.organizationId,
			},
			include: {
				contacts: true,
				deals: {
					include: {
						contact: true,
					},
				},
				activities: {
					orderBy: { createdAt: 'desc' },
					take: 10,
				},
			},
		});

		if (!company) {
			return NextResponse.json(
				{ error: 'Company not found' },
				{ status: 404 }
			);
		}

		return NextResponse.json(company);
	} catch (error) {
		console.error('Error fetching company:', error);
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

		const company = await prisma.company.update({
			where: {
				id: id,
				organizationId: dbUser.organizationId,
			},
			data,
			include: {
				_count: {
					select: {
						contacts: true,
						deals: true,
					},
				},
			},
		});

		return NextResponse.json(company);
	} catch (error) {
		console.error('Error updating company:', error);
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

		await prisma.company.delete({
			where: {
				id: id,
				organizationId: dbUser.organizationId,
			},
		});

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error('Error deleting company:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
