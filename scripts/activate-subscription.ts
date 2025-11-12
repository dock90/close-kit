/**
 * Script to manually activate subscription for testing
 * Usage: npx tsx scripts/activate-subscription.ts <organization-id>
 */

import { prisma } from '../lib/prisma';

async function activateSubscription() {
	const orgId = process.argv[2];

	if (!orgId) {
		console.error('Usage: npx tsx scripts/activate-subscription.ts <organization-id>');
		process.exit(1);
	}

	try {
		console.log(`Activating subscription for organization ${orgId}...\n`);

		const org = await prisma.organization.findUnique({
			where: { id: orgId },
		});

		if (!org) {
			console.error(`Organization ${orgId} not found.`);
			process.exit(1);
		}

		console.log('Current status:');
		console.log(`  Name: ${org.name}`);
		console.log(`  Status: ${org.subscriptionStatus}`);
		console.log(`  Subscription ID: ${org.subscriptionId || 'None'}`);

		const updated = await prisma.organization.update({
			where: { id: orgId },
			data: {
				subscriptionStatus: 'active',
				subscriptionId: org.subscriptionId || 'manual_activation_test',
			},
		});

		console.log('\n✅ Updated status:');
		console.log(`  Status: ${updated.subscriptionStatus}`);
		console.log(`  Subscription ID: ${updated.subscriptionId}`);
		console.log('\nSubscription activated! Refresh your browser to see the changes.');
	} catch (error) {
		console.error('Error activating subscription:', error);
	} finally {
		await prisma.$disconnect();
	}
}

activateSubscription();

