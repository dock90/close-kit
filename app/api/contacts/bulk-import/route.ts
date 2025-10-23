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
				if (
					!row.firstName ||
					typeof row.firstName !== 'string' ||
					!row.firstName.trim()
				) {
					throw new Error('First name is required');
				}
				if (
					!row.lastName ||
					typeof row.lastName !== 'string' ||
					!row.lastName.trim()
				) {
					throw new Error('Last name is required');
				}
				if (
					!row.companyName ||
					typeof row.companyName !== 'string' ||
					!row.companyName.trim()
				) {
					throw new Error('Company name is required');
				}

				// Find or create company
				let company = await prisma.company.findFirst({
					where: {
						name: row.companyName.trim(),
						organizationId: dbUser.organizationId,
					},
				});

				if (!company) {
					company = await prisma.company.create({
						data: {
							name: row.companyName.trim(),
							organizationId: dbUser.organizationId,
						},
					});
				}

				// Create contact
				await prisma.contact.create({
					data: {
						firstName: row.firstName.trim(),
						lastName: row.lastName.trim(),
						email: row.email?.trim() || null,
						phone: row.phone?.trim() || null,
						title: row.title?.trim() || null,
						linkedinUrl: row.linkedinUrl?.trim() || null,
						companyId: company.id,
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
		console.error('Error bulk importing contacts:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
