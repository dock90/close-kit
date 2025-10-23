import { NextRequest, NextResponse } from 'next/server';
import { currentUser, clerkClient } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
	try {
		const user = await currentUser();
		if (!user) {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			);
		}

		// Handle both JSON and form data
		let name, slug;

		const contentType = request.headers.get('content-type');
		if (contentType?.includes('application/json')) {
			const data = await request.json();
			name = data.name;
			slug = data.slug;
		} else {
			const formData = await request.formData();
			name = formData.get('name') as string;
			slug = formData.get('slug') as string;
		}

		if (!name) {
			return NextResponse.json(
				{ error: 'Organization name is required' },
				{ status: 400 }
			);
		}

		// Create organization and user
		const organization = await prisma.organization.create({
			data: {
				name,
				slug,
				users: {
					create: {
						clerkId: user.id,
						email: user.emailAddresses[0]?.emailAddress || '',
						firstName: user.firstName || null,
						lastName: user.lastName || null,
						role: 'admin',
					},
				},
			},
		});

		// Update Clerk user metadata with organizationId
		const client = await clerkClient();
		await client.users.updateUserMetadata(user.id, {
			publicMetadata: {
				organizationId: organization.id,
				role: 'admin',
			},
		});

		return NextResponse.json(organization);
	} catch (error) {
		console.error('Error creating organization:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
