/**
 * Backfill script to set trial end dates for existing organizations
 * Run with: npx tsx scripts/backfill-trial-dates.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function backfillTrialDates() {
	console.log('Starting backfill of trial dates...');

	try {
		// Find all organizations without a trial end date
		const organizations = await prisma.organization.findMany({
			where: {
				trialEndsAt: null,
			},
		});

		console.log(
			`Found ${organizations.length} organizations without trial end dates`
		);

		for (const org of organizations) {
			// Set trial to end 14 days from the organization's creation date
			const trialEndsAt = new Date(org.createdAt);
			trialEndsAt.setDate(trialEndsAt.getDate() + 14);

			await prisma.organization.update({
				where: { id: org.id },
				data: {
					trialEndsAt,
					subscriptionStatus: 'trial',
				},
			});

			console.log(
				`Updated organization ${org.name} (${org.id}) - trial ends ${trialEndsAt.toISOString()}`
			);
		}

		console.log('Backfill completed successfully!');
	} catch (error) {
		console.error('Error during backfill:', error);
		throw error;
	} finally {
		await prisma.$disconnect();
	}
}

backfillTrialDates();

