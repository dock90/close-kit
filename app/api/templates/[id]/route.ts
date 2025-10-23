import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
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
		});

		if (!dbUser) {
			return NextResponse.json(
				{ error: 'User not found' },
				{ status: 404 }
			);
		}

		const body = await request.json();
		const { name, type, subject, body: templateBody, category } = body;
		const { id } = await params;

		const template = await prisma.template.updateMany({
			where: {
				id: id,
				organizationId: dbUser.organizationId,
			},
			data: {
				...(name !== undefined && { name }),
				...(type !== undefined && { type }),
				...(subject !== undefined && { subject }),
				...(templateBody !== undefined && { body: templateBody }),
				...(category !== undefined && { category }),
			},
		});

		if (template.count === 0) {
			return NextResponse.json(
				{ error: 'Template not found' },
				{ status: 404 }
			);
		}

		const updatedTemplate = await prisma.template.findUnique({
			where: { id: id },
		});

		return NextResponse.json(updatedTemplate);
	} catch (error) {
		console.error('Error updating template:', error);
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
		const user = await currentUser();
		if (!user) {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			);
		}

		const dbUser = await prisma.user.findUnique({
			where: { clerkId: user.id },
		});

		if (!dbUser) {
			return NextResponse.json(
				{ error: 'User not found' },
				{ status: 404 }
			);
		}

		const { id } = await params;

		const template = await prisma.template.deleteMany({
			where: {
				id: id,
				organizationId: dbUser.organizationId,
			},
		});

		if (template.count === 0) {
			return NextResponse.json(
				{ error: 'Template not found' },
				{ status: 404 }
			);
		}

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error('Error deleting template:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
