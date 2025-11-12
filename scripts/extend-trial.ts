/**
 * Extend trial for a specific organization
 * Run with: npx tsx scripts/extend-trial.ts <organization-slug> <days>
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function extendTrial() {
	const slug = process.argv[2];
	const days = parseInt(process.argv[3] || '14');

	if (!slug) {
		console.error('Usage: npx tsx scripts/extend-trial.ts <organization-slug> [days]');
		process.exit(1);
	}

	try {
		const org = await prisma.organization.findUnique({
			where: { slug },
		});

		if (!org) {
			console.error(`Organization with slug "${slug}" not found`);
			process.exit(1);
		}

		// Set new trial end date
		const newTrialEndsAt = new Date();
		newTrialEndsAt.setDate(newTrialEndsAt.getDate() + days);

		const updated = await prisma.organization.update({
			where: { slug },
			data: {
				trialEndsAt: newTrialEndsAt,
				subscriptionStatus: 'trial',
			},
		});

		console.log(`✅ Extended trial for "${org.name}"`);
		console.log(`   New trial end date: ${newTrialEndsAt.toISOString()}`);
		console.log(`   Days from now: ${days}`);
	} catch (error) {
		console.error('Error extending trial:', error);
		throw error;
	} finally {
		await prisma.$disconnect();
	}
}

extendTrial();

