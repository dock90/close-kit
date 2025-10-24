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
		const industry = searchParams.get('industry');
		const search = searchParams.get('search');
		const includeArchived = searchParams.get('includeArchived') === 'true';

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

		// By default, exclude archived companies unless explicitly requested
		if (!includeArchived) {
			where.archived = false;
		}

		if (industry) {
			where.industry = industry;
		}

		if (search) {
			where.OR = [
				{ name: { contains: search, mode: 'insensitive' } },
				{ website: { contains: search, mode: 'insensitive' } },
			];
		}

		const companies = await prisma.company.findMany({
			where,
			include: {
				_count: {
					select: {
						contacts: true,
						deals: true,
					},
				},
			},
			orderBy: { createdAt: 'desc' },
		});

		return NextResponse.json(companies);
	} catch (error) {
		console.error('Error fetching companies:', error);
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

		const company = await prisma.company.create({
			data: {
				...data,
				organizationId: dbUser.organizationId,
			},
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
		console.error('Error creating company:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
