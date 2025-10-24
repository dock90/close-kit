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

		const organization = await prisma.organization.findUnique({
			where: { id: id },
			include: {
				users: true,
				_count: {
					select: {
						companies: true,
						contacts: true,
						deals: true,
						activities: true,
					},
				},
			},
		});

		if (!organization) {
			return NextResponse.json(
				{ error: 'Organization not found' },
				{ status: 404 }
			);
		}

		return NextResponse.json(organization);
	} catch (error) {
		console.error('Error fetching organization:', error);
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

		// Verify user belongs to this organization
		const dbUser = await prisma.user.findUnique({
			where: { clerkId: user.id },
		});

		if (!dbUser || dbUser.organizationId !== id) {
			return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
		}

		const body = await request.json();
		const { name, slug, defaultEmailsGoal, defaultLinkedinGoal } = body;

		const updateData: any = {};
		if (name !== undefined) updateData.name = name;
		if (slug !== undefined) updateData.slug = slug;
		if (defaultEmailsGoal !== undefined)
			updateData.defaultEmailsGoal = defaultEmailsGoal;
		if (defaultLinkedinGoal !== undefined)
			updateData.defaultLinkedinGoal = defaultLinkedinGoal;

		if (Object.keys(updateData).length === 0) {
			return NextResponse.json(
				{ error: 'No fields to update' },
				{ status: 400 }
			);
		}

		const organization = await prisma.organization.update({
			where: { id: id },
			data: updateData,
		});

		return NextResponse.json(organization);
	} catch (error) {
		console.error('Error updating organization:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
