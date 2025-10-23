import { ActivityList } from '@/components/activities';
import { ActivitiesPageClient } from './ActivitiesPageClient';
import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export default async function ActivitiesPage() {
	const user = await currentUser();

	if (!user) {
		return null;
	}

	const dbUser = await prisma.user.findUnique({
		where: { clerkId: user.id },
		include: { organization: true },
	});

	if (!dbUser) {
		return null;
	}

	// Fetch activities
	const activitiesRaw = await prisma.activity.findMany({
		where: {
			organizationId: dbUser.organizationId,
		},
		include: {
			company: true,
			contact: true,
			deal: true,
		},
		orderBy: { createdAt: 'desc' },
	});

	// Serialize dates for client component
	const activities = activitiesRaw.map((activity) => ({
		id: activity.id,
		type: activity.type,
		subject: activity.subject ?? undefined,
		notes: activity.notes ?? undefined,
		scheduledDate: activity.scheduledDate ?? undefined,
		completedDate: activity.completedDate ?? undefined,
		status: activity.status,
		companyId: activity.companyId ?? undefined,
		contactId: activity.contactId ?? undefined,
		dealId: activity.dealId ?? undefined,
		company: activity.company ?? undefined,
		contact: activity.contact ?? undefined,
		deal: activity.deal ?? undefined,
		createdAt: activity.createdAt,
	}));

	// Fetch companies, contacts, and deals for the form
	const companies = await prisma.company.findMany({
		where: { organizationId: dbUser.organizationId },
		orderBy: { name: 'asc' },
		select: {
			id: true,
			name: true,
		},
	});

	const contacts = await prisma.contact.findMany({
		where: { organizationId: dbUser.organizationId },
		orderBy: { firstName: 'asc' },
		select: {
			id: true,
			firstName: true,
			lastName: true,
			companyId: true,
		},
	});

	const deals = await prisma.deal.findMany({
		where: { organizationId: dbUser.organizationId },
		orderBy: { name: 'asc' },
		select: {
			id: true,
			name: true,
			companyId: true,
		},
	});

	return (
		<ActivitiesPageClient
			initialActivities={activities}
			companies={companies}
			contacts={contacts}
			deals={deals}
		/>
	);
}
