/**
 * Script to check subscription status for an organization
 * Usage: npx tsx scripts/check-subscription-status.ts
 */

import { prisma } from '../lib/prisma';

async function checkSubscriptionStatus() {
	try {
		console.log('Checking subscription statuses...\n');

		const orgs = await prisma.organization.findMany({
			select: {
				id: true,
				name: true,
				subscriptionStatus: true,
				subscriptionId: true,
				trialEndsAt: true,
			},
		});

		if (orgs.length === 0) {
			console.log('No organizations found.');
			return;
		}

		for (const org of orgs) {
			console.log(`Organization: ${org.name}`);
			console.log(`  ID: ${org.id}`);
			console.log(`  Status: ${org.subscriptionStatus}`);
			console.log(`  Subscription ID: ${org.subscriptionId || 'None'}`);
			console.log(
				`  Trial Ends: ${org.trialEndsAt ? org.trialEndsAt.toISOString() : 'N/A'}`
			);
			console.log('---\n');
		}
	} catch (error) {
		console.error('Error checking subscription status:', error);
	} finally {
		await prisma.$disconnect();
	}
}

checkSubscriptionStatus();

