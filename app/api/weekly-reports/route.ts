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

		const reports = await prisma.weeklyReport.findMany({
			where: { organizationId: dbUser.organizationId },
			orderBy: { weekStartDate: 'desc' },
		});

		return NextResponse.json(reports);
	} catch (error) {
		console.error('Error fetching weekly reports:', error);
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

		// Check if report already exists for this week
		const existingReport = await prisma.weeklyReport.findFirst({
			where: {
				organizationId: dbUser.organizationId,
				weekStartDate: data.weekStartDate,
			},
		});

		let report;
		if (existingReport) {
			report = await prisma.weeklyReport.update({
				where: { id: existingReport.id },
				data,
			});
		} else {
			report = await prisma.weeklyReport.create({
				data: {
					...data,
					organizationId: dbUser.organizationId,
				},
			});
		}

		return NextResponse.json(report);
	} catch (error) {
		console.error('Error creating/updating weekly report:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
