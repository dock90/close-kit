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
		const stage = searchParams.get('stage');

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

		if (stage) {
			where.stage = stage;
		}

		const deals = await prisma.deal.findMany({
			where,
			include: {
				company: true,
				contact: true,
				_count: {
					select: {
						activities: true,
					},
				},
			},
			orderBy: { createdAt: 'desc' },
		});

		return NextResponse.json(deals);
	} catch (error) {
		console.error('Error fetching deals:', error);
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

		// Filter out null values and empty strings
		const cleanData: any = {};
		Object.entries(data).forEach(([key, value]) => {
			if (value !== null && value !== '') {
				// Convert date strings to Date objects if they exist
				if ((key === 'expectedCloseDate' || key === 'actualCloseDate') && typeof value === 'string') {
					cleanData[key] = new Date(value);
				} else {
					cleanData[key] = value;
				}
			}
		});

		const deal = await prisma.deal.create({
			data: {
				...cleanData,
				organizationId: dbUser.organizationId,
			},
			include: {
				company: true,
				contact: true,
			},
		});

		return NextResponse.json(deal);
	} catch (error) {
		console.error('Error creating deal:', error);
		console.error('Error details:', error instanceof Error ? error.message : String(error));
		return NextResponse.json(
			{
				error: 'Internal server error',
				details: error instanceof Error ? error.message : String(error)
			},
			{ status: 500 }
		);
	}
}
