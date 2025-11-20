import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
	try {
		const user = await currentUser();
		if (!user) {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			);
		}

		const { searchParams } = new URL(request.url);
		const type = searchParams.get('type');
		const status = searchParams.get('status');
		const limit = searchParams.get('limit');
		const contactId = searchParams.get('contactId');
		const companyId = searchParams.get('companyId');
		const dealId = searchParams.get('dealId');

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

		const where: any = {
			organizationId: dbUser.organizationId,
		};

		if (type) {
			where.type = type;
		}

		if (status) {
			where.status = status;
		}

		if (contactId) {
			where.contactId = contactId;
		}

		if (companyId) {
			where.companyId = companyId;
		}

		if (dealId) {
			where.dealId = dealId;
		}

		const activities = await prisma.activity.findMany({
			where,
			include: {
				company: true,
				contact: true,
				deal: true,
			},
			orderBy: { createdAt: 'desc' },
			take: limit ? parseInt(limit) : undefined,
		});

		return NextResponse.json(activities);
	} catch (error) {
		console.error('Error fetching activities:', error);
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

		const activity = await prisma.activity.create({
			data: {
				...data,
				organizationId: dbUser.organizationId,
			},
			include: {
				company: true,
				contact: true,
				deal: true,
			},
		});

		return NextResponse.json(activity);
	} catch (error) {
		console.error('Error creating activity:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
