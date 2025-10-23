import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const user = await currentUser();
		if (!user) {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			);
		}

		const organization = await prisma.organization.findUnique({
			where: { id: params.id },
			include: {
				users: true,
				_count: {
					select: {
						companies: true,
						contacts: true,
						deals: true,
						activities: true,
					},
				},
			},
		});

		if (!organization) {
			return NextResponse.json(
				{ error: 'Organization not found' },
				{ status: 404 }
			);
		}

		return NextResponse.json(organization);
	} catch (error) {
		console.error('Error fetching organization:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}

export async function PATCH(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const user = await currentUser();
		if (!user) {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			);
		}

		const { name, slug } = await request.json();

		const organization = await prisma.organization.update({
			where: { id: params.id },
			data: { name, slug },
		});

		return NextResponse.json(organization);
	} catch (error) {
		console.error('Error updating organization:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
