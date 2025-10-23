import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { formatCurrency } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';

export default async function DashboardPage() {
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

	// Get dashboard stats
	const [
		totalDeals,
		openDeals,
		wonDeals,
		totalValue,
		recentActivities,
		currentGoal,
	] = await Promise.all([
		prisma.deal.count({
			where: { organizationId: dbUser.organizationId },
		}),
		prisma.deal.count({
			where: {
				organizationId: dbUser.organizationId,
				stage: { notIn: ['closed_won', 'closed_lost'] },
			},
		}),
		prisma.deal.count({
			where: {
				organizationId: dbUser.organizationId,
				stage: 'closed_won',
			},
		}),
		prisma.deal.aggregate({
			where: { organizationId: dbUser.organizationId },
			_sum: { value: true },
		}),
		prisma.activity.findMany({
			where: { organizationId: dbUser.organizationId },
			include: { company: true, contact: true, deal: true },
			orderBy: { createdAt: 'desc' },
			take: 5,
		}),
		prisma.revenueGoal.findFirst({
			where: {
				organizationId: dbUser.organizationId,
				startDate: { lte: new Date() },
				endDate: { gte: new Date() },
			},
			orderBy: { createdAt: 'desc' },
		}),
	]);

	const totalRevenue = totalValue._sum.value || 0;

	return (
		<div className='space-y-6'>
			<DashboardHeader
				totalDeals={totalDeals}
				openDeals={openDeals}
				wonDeals={wonDeals}
				totalRevenue={totalRevenue}
			/>
			<div>
				<h1 className='text-3xl font-bold text-gray-900'>Dashboard</h1>
				<p className='text-gray-600'>
					Welcome back to {dbUser.organization.name}
				</p>
			</div>

			{/* Stats Cards */}
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>
							Total Deals
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>{totalDeals}</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>
							Open Deals
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>{openDeals}</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>
							Won Deals
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>{wonDeals}</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>
							Total Revenue
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>
							{formatCurrency(totalRevenue)}
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Revenue Goal Progress */}
			{currentGoal && (
				<Card>
					<CardHeader>
						<CardTitle>Revenue Goal Progress</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='space-y-2'>
							<div className='flex justify-between text-sm'>
								<span>{formatCurrency(totalRevenue)}</span>
								<span>
									{formatCurrency(currentGoal.targetAmount)}
								</span>
							</div>
							<div className='w-full bg-gray-200 rounded-full h-2'>
								<div
									className='bg-indigo-600 h-2 rounded-full'
									style={{
										width: `${Math.min(
											(totalRevenue /
												currentGoal.targetAmount) *
												100,
											100
										)}%`,
									}}
								></div>
							</div>
						</div>
					</CardContent>
				</Card>
			)}

			{/* Recent Activities */}
			<Card>
				<CardHeader>
					<CardTitle>Recent Activities</CardTitle>
				</CardHeader>
				<CardContent>
					<div className='space-y-4'>
						{recentActivities.map((activity) => (
							<div
								key={activity.id}
								className='flex items-center space-x-4'
							>
								<div className='w-2 h-2 bg-indigo-500 rounded-full'></div>
								<div className='flex-1'>
									<p className='text-sm font-medium'>
										{activity.type.replace('_', ' ')} -{' '}
										{activity.company?.name ||
											activity.contact?.firstName}
									</p>
									<p className='text-xs text-gray-500'>
										{activity.createdAt.toLocaleDateString()}
									</p>
								</div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
