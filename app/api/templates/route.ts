import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
	try {
		const user = await currentUser();
		if (!user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const dbUser = await prisma.user.findUnique({
			where: { clerkId: user.id },
		});

		if (!dbUser) {
			return NextResponse.json({ error: 'User not found' }, { status: 404 });
		}

		const templates = await prisma.template.findMany({
			where: { organizationId: dbUser.organizationId },
			orderBy: { createdAt: 'desc' },
		});

		return NextResponse.json(templates);
	} catch (error) {
		console.error('Error fetching templates:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}

export async function POST(request: NextRequest) {
	try {
		const user = await currentUser();
		if (!user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const dbUser = await prisma.user.findUnique({
			where: { clerkId: user.id },
		});

		if (!dbUser) {
			return NextResponse.json({ error: 'User not found' }, { status: 404 });
		}

		const body = await request.json();
		const { name, type, subject, body: templateBody, category } = body;

		if (!name || !type || !templateBody) {
			return NextResponse.json(
				{ error: 'Missing required fields' },
				{ status: 400 }
			);
		}

		const template = await prisma.template.create({
			data: {
				name,
				type,
				subject,
				body: templateBody,
				category,
				organizationId: dbUser.organizationId,
			},
		});

		return NextResponse.json(template, { status: 201 });
	} catch (error) {
		console.error('Error creating template:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
