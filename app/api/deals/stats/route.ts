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

		const deals = await prisma.deal.findMany({
			where: { organizationId: dbUser.organizationId },
			select: {
				value: true,
				stage: true,
				probability: true,
			},
		});

		const stats = {
			totalValue: deals.reduce((sum, deal) => sum + deal.value, 0),
			weightedValue: deals.reduce(
				(sum, deal) => sum + (deal.value * deal.probability) / 100,
				0
			),
			byStage: deals.reduce((acc, deal) => {
				acc[deal.stage] = (acc[deal.stage] || 0) + 1;
				return acc;
			}, {} as Record<string, number>),
			totalDeals: deals.length,
			wonDeals: deals.filter((d) => d.stage === 'closed_won').length,
			lostDeals: deals.filter((d) => d.stage === 'closed_lost').length,
			openDeals: deals.filter(
				(d) => !['closed_won', 'closed_lost'].includes(d.stage)
			).length,
		};

		return NextResponse.json(stats);
	} catch (error) {
		console.error('Error fetching deal stats:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
