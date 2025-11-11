import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
	try {
		const user = await currentUser();
		if (!user) {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			);
		}

		const { searchParams } = new URL(request.url);
		const search = searchParams.get('search');
		const companyId = searchParams.get('companyId');

		const dbUser = await prisma.user.findUnique({
			where: { clerkId: user.id },
			include: { organization: true },
		});

		if (!dbUser) {
			return NextResponse.json(
				{ error: 'User not found' },
				{ status: 404 }
			);
		}

		const where: any = {
			organizationId: dbUser.organizationId,
		};

		if (companyId) {
			where.companyId = companyId;
		}

		if (search) {
			where.OR = [
				{ firstName: { contains: search, mode: 'insensitive' } },
				{ lastName: { contains: search, mode: 'insensitive' } },
				{ email: { contains: search, mode: 'insensitive' } },
			];
		}

		const contacts = await prisma.contact.findMany({
			where,
			include: {
				company: true,
				_count: {
					select: {
						deals: true,
						activities: true,
					},
				},
			},
			orderBy: { createdAt: 'desc' },
		});

		return NextResponse.json(contacts);
	} catch (error) {
		console.error('Error fetching contacts:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}

export async function POST(request: NextRequest) {
	try {
		const user = await currentUser();
		if (!user) {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			);
		}

		const dbUser = await prisma.user.findUnique({
			where: { clerkId: user.id },
			include: { organization: true },
		});

		if (!dbUser) {
			return NextResponse.json(
				{ error: 'User not found' },
				{ status: 404 }
			);
		}

		const data = await request.json();

		// Handle empty string companyId by converting to null
		const contactData = {
			...data,
			companyId: data.companyId || null,
			organizationId: dbUser.organizationId,
		};

		const contact = await prisma.contact.create({
			data: contactData,
			include: {
				company: true,
			},
		});

		return NextResponse.json(contact);
	} catch (error) {
		console.error('Error creating contact:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
