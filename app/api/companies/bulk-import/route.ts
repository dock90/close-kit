import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

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
		const { data } = body;

		if (!data || !Array.isArray(data)) {
			return NextResponse.json(
				{ error: 'Invalid data format' },
				{ status: 400 }
			);
		}

		let successCount = 0;
		let failedCount = 0;
		const errors: string[] = [];

		for (let i = 0; i < data.length; i++) {
			const row = data[i];

			try {
				// Validate required fields
				if (!row.name || typeof row.name !== 'string' || !row.name.trim()) {
					throw new Error('Company name is required');
				}

				// Create company
				await prisma.company.create({
					data: {
						name: row.name.trim(),
						website: row.website?.trim() || null,
						industry: row.industry?.trim() || null,
						employeeCount: row.employeeCount?.trim() || null,
						fundingStage: row.fundingStage?.trim() || null,
						location: row.location?.trim() || null,
						linkedinUrl: row.linkedinUrl?.trim() || null,
						notes: row.notes?.trim() || null,
						organizationId: dbUser.organizationId,
					},
				});

				successCount++;
			} catch (error: any) {
				failedCount++;
				errors.push(
					`Row ${i + 1}: ${error.message || 'Unknown error'}`
				);
			}
		}

		return NextResponse.json({
			success: successCount,
			failed: failedCount,
			errors,
		});
	} catch (error) {
		console.error('Error bulk importing companies:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
