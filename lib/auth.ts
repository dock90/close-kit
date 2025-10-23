import { currentUser } from '@clerk/nextjs/server';
import { prisma } from './prisma';

export async function getCurrentUserWithOrg() {
	const clerkUser = await currentUser();
	
	if (!clerkUser) {
		return null;
	}

	const dbUser = await prisma.user.findUnique({
		where: { clerkId: clerkUser.id },
		include: { organization: true },
	});

	return dbUser;
}

export async function requireAuth() {
	const user = await getCurrentUserWithOrg();
	
	if (!user) {
		throw new Error('Unauthorized');
	}

	return user;
}

export async function getOrganizationId() {
	const user = await requireAuth();
	return user.organizationId;
}
