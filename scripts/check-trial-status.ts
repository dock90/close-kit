/**
 * Check trial status for all organizations
 * Run with: npx tsx scripts/check-trial-status.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkTrialStatus() {
	console.log('Checking trial status for all organizations...\n');

	try {
		const organizations = await prisma.organization.findMany({
			select: {
				id: true,
				name: true,
				slug: true,
				trialEndsAt: true,
				subscriptionStatus: true,
				createdAt: true,
			},
		});

		console.log(`Found ${organizations.length} organizations:\n`);

		const now = new Date();

		for (const org of organizations) {
			console.log(`Organization: ${org.name}`);
			console.log(`  ID: ${org.id}`);
			console.log(`  Slug: ${org.slug}`);
			console.log(`  Created: ${org.createdAt.toISOString()}`);
			console.log(
				`  Trial Ends: ${org.trialEndsAt?.toISOString() || 'NOT SET'}`
			);
			console.log(`  Subscription Status: ${org.subscriptionStatus}`);

			if (org.trialEndsAt) {
				const daysRemaining = Math.ceil(
					(org.trialEndsAt.getTime() - now.getTime()) /
						(1000 * 60 * 60 * 24)
				);
				console.log(`  Days Remaining: ${daysRemaining}`);
				console.log(
					`  Trial Expired: ${now > org.trialEndsAt ? 'YES' : 'NO'}`
				);
			}

			console.log('');
		}
	} catch (error) {
		console.error('Error checking trial status:', error);
		throw error;
	} finally {
		await prisma.$disconnect();
	}
}

checkTrialStatus();
