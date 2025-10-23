import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

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

		const remindersCreated = {
			noResponse: 0,
			proposalPending: 0,
			discoveryCalls: 0,
		};

		const now = new Date();

		// 1. No response after 5 days on email
		const fiveDaysAgo = new Date(now);
		fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

		const emailsWithoutResponse = await prisma.activity.findMany({
			where: {
				organizationId: dbUser.organizationId,
				type: 'email_sent',
				status: 'completed',
				completedDate: {
					lte: fiveDaysAgo,
					gte: new Date(fiveDaysAgo.getTime() - 24 * 60 * 60 * 1000), // Only check emails from 5 days ago (not older)
				},
			},
			include: {
				contact: true,
				company: true,
				deal: true,
			},
		});

		for (const email of emailsWithoutResponse) {
			// Check if there's a follow-up activity after this email
			const hasFollowUp = await prisma.activity.findFirst({
				where: {
					organizationId: dbUser.organizationId,
					contactId: email.contactId,
					createdAt: {
						gt: email.completedDate || email.createdAt,
					},
					type: {
						in: ['email_sent', 'linkedin_message', 'call', 'meeting'],
					},
				},
			});

			// Check if reminder already exists
			const existingReminder = await prisma.reminder.findFirst({
				where: {
					organizationId: dbUser.organizationId,
					activityId: email.id,
					type: 'no_response_email',
					status: 'active',
				},
			});

			if (!hasFollowUp && !existingReminder) {
				await prisma.reminder.create({
					data: {
						type: 'no_response_email',
						title: `Follow up: No response from ${email.contact?.firstName} ${email.contact?.lastName}`,
						description: `It's been 5 days since you sent an email to ${email.contact?.firstName} ${email.contact?.lastName} at ${email.company?.name}. Consider following up.`,
						dueDate: now,
						priority: 'high',
						activityId: email.id,
						contactId: email.contactId,
						dealId: email.dealId,
						organizationId: dbUser.organizationId,
					},
				});
				remindersCreated.noResponse++;
			}
		}

		// 2. Proposal sent > 3 days ago without response
		const threeDaysAgo = new Date(now);
		threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

		const proposalsWithoutResponse = await prisma.activity.findMany({
			where: {
				organizationId: dbUser.organizationId,
				type: 'proposal_sent',
				status: 'completed',
				completedDate: {
					lte: threeDaysAgo,
					gte: new Date(threeDaysAgo.getTime() - 24 * 60 * 60 * 1000),
				},
			},
			include: {
				contact: true,
				company: true,
				deal: true,
			},
		});

		for (const proposal of proposalsWithoutResponse) {
			// Check if there's a follow-up activity after this proposal
			const hasFollowUp = await prisma.activity.findFirst({
				where: {
					organizationId: dbUser.organizationId,
					dealId: proposal.dealId,
					createdAt: {
						gt: proposal.completedDate || proposal.createdAt,
					},
					type: {
						in: ['email_sent', 'linkedin_message', 'call', 'meeting'],
					},
				},
			});

			// Check if deal was closed
			const deal = proposal.dealId
				? await prisma.deal.findUnique({
						where: { id: proposal.dealId },
				  })
				: null;

			// Check if reminder already exists
			const existingReminder = await prisma.reminder.findFirst({
				where: {
					organizationId: dbUser.organizationId,
					activityId: proposal.id,
					type: 'proposal_pending',
					status: 'active',
				},
			});

			if (
				!hasFollowUp &&
				!existingReminder &&
				deal &&
				!['closed_won', 'closed_lost'].includes(deal.stage)
			) {
				await prisma.reminder.create({
					data: {
						type: 'proposal_pending',
						title: `Follow up on proposal: ${deal.name}`,
						description: `It's been 3 days since you sent a proposal for ${deal.name}. Consider following up with ${proposal.contact?.firstName} ${proposal.contact?.lastName}.`,
						dueDate: now,
						priority: 'high',
						activityId: proposal.id,
						contactId: proposal.contactId,
						dealId: proposal.dealId,
						organizationId: dbUser.organizationId,
					},
				});
				remindersCreated.proposalPending++;
			}
		}

		// 3. Discovery call scheduled for tomorrow
		const tomorrow = new Date(now);
		tomorrow.setDate(tomorrow.getDate() + 1);
		tomorrow.setHours(0, 0, 0, 0);
		const dayAfterTomorrow = new Date(tomorrow);
		dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

		const upcomingDiscoveryCalls = await prisma.activity.findMany({
			where: {
				organizationId: dbUser.organizationId,
				type: 'meeting',
				status: 'scheduled',
				scheduledDate: {
					gte: tomorrow,
					lt: dayAfterTomorrow,
				},
			},
			include: {
				contact: true,
				company: true,
				deal: true,
			},
		});

		for (const call of upcomingDiscoveryCalls) {
			// Check if reminder already exists
			const existingReminder = await prisma.reminder.findFirst({
				where: {
					organizationId: dbUser.organizationId,
					activityId: call.id,
					type: 'discovery_call_tomorrow',
					status: 'active',
				},
			});

			if (!existingReminder) {
				await prisma.reminder.create({
					data: {
						type: 'discovery_call_tomorrow',
						title: `Prepare for call: ${call.contact?.firstName} ${call.contact?.lastName}`,
						description: `You have a discovery call scheduled tomorrow with ${call.contact?.firstName} ${call.contact?.lastName} at ${call.company?.name}. Make sure you're prepared!`,
						dueDate: tomorrow,
						priority: 'medium',
						activityId: call.id,
						contactId: call.contactId,
						dealId: call.dealId,
						organizationId: dbUser.organizationId,
					},
				});
				remindersCreated.discoveryCalls++;
			}
		}

		return NextResponse.json({
			success: true,
			remindersCreated,
		});
	} catch (error) {
		console.error('Error auto-generating reminders:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
