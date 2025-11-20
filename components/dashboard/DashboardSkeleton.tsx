'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function DashboardSkeleton() {
	return (
		<div className='space-y-6'>
			{/* Header Skeleton */}
			<div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
				<Card>
					<CardHeader className='pb-2'>
						<Skeleton className='h-4 w-24' />
					</CardHeader>
					<CardContent>
						<Skeleton className='h-8 w-16' />
					</CardContent>
				</Card>
				<Card>
					<CardHeader className='pb-2'>
						<Skeleton className='h-4 w-24' />
					</CardHeader>
					<CardContent>
						<Skeleton className='h-8 w-16' />
					</CardContent>
				</Card>
				<Card>
					<CardHeader className='pb-2'>
						<Skeleton className='h-4 w-24' />
					</CardHeader>
					<CardContent>
						<Skeleton className='h-8 w-16' />
					</CardContent>
				</Card>
				<Card>
					<CardHeader className='pb-2'>
						<Skeleton className='h-4 w-24' />
					</CardHeader>
					<CardContent>
						<Skeleton className='h-8 w-20' />
					</CardContent>
				</Card>
			</div>

			{/* Welcome Section Skeleton */}
			<div>
				<Skeleton className='h-8 w-64 mb-2' />
				<Skeleton className='h-5 w-40' />
			</div>

			{/* Daily Outreach Tracker Skeleton */}
			<Card>
				<CardHeader>
					<Skeleton className='h-6 w-48' />
				</CardHeader>
				<CardContent>
					<div className='space-y-3'>
						<Skeleton className='h-4 w-full' />
						<Skeleton className='h-4 w-full' />
						<Skeleton className='h-4 w-3/4' />
					</div>
				</CardContent>
			</Card>

			{/* Success Metrics Skeleton */}
			<Card>
				<CardHeader>
					<Skeleton className='h-6 w-48' />
				</CardHeader>
				<CardContent>
					<div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
						<div>
							<Skeleton className='h-4 w-20 mb-2' />
							<Skeleton className='h-8 w-16' />
						</div>
						<div>
							<Skeleton className='h-4 w-20 mb-2' />
							<Skeleton className='h-8 w-16' />
						</div>
						<div>
							<Skeleton className='h-4 w-20 mb-2' />
							<Skeleton className='h-8 w-16' />
						</div>
						<div>
							<Skeleton className='h-4 w-20 mb-2' />
							<Skeleton className='h-8 w-16' />
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Deal Overview Skeleton */}
			<div>
				<Skeleton className='h-7 w-40 mb-4' />
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
					<Card>
						<CardHeader className='pb-2'>
							<Skeleton className='h-4 w-24' />
						</CardHeader>
						<CardContent>
							<Skeleton className='h-8 w-12' />
						</CardContent>
					</Card>
					<Card>
						<CardHeader className='pb-2'>
							<Skeleton className='h-4 w-24' />
						</CardHeader>
						<CardContent>
							<Skeleton className='h-8 w-12' />
						</CardContent>
					</Card>
					<Card>
						<CardHeader className='pb-2'>
							<Skeleton className='h-4 w-24' />
						</CardHeader>
						<CardContent>
							<Skeleton className='h-8 w-12' />
						</CardContent>
					</Card>
					<Card>
						<CardHeader className='pb-2'>
							<Skeleton className='h-4 w-32' />
						</CardHeader>
						<CardContent>
							<Skeleton className='h-8 w-24' />
						</CardContent>
					</Card>
				</div>
			</div>

			{/* Week Metrics Skeleton */}
			<div className='space-y-4'>
				<Skeleton className='h-7 w-48' />
				<div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
					<Card>
						<CardContent className='pt-6'>
							<Skeleton className='h-10 w-10 mx-auto mb-2' />
							<Skeleton className='h-8 w-12 mx-auto mb-1' />
							<Skeleton className='h-4 w-20 mx-auto' />
						</CardContent>
					</Card>
					<Card>
						<CardContent className='pt-6'>
							<Skeleton className='h-10 w-10 mx-auto mb-2' />
							<Skeleton className='h-8 w-12 mx-auto mb-1' />
							<Skeleton className='h-4 w-20 mx-auto' />
						</CardContent>
					</Card>
					<Card>
						<CardContent className='pt-6'>
							<Skeleton className='h-10 w-10 mx-auto mb-2' />
							<Skeleton className='h-8 w-12 mx-auto mb-1' />
							<Skeleton className='h-4 w-20 mx-auto' />
						</CardContent>
					</Card>
					<Card>
						<CardContent className='pt-6'>
							<Skeleton className='h-10 w-10 mx-auto mb-2' />
							<Skeleton className='h-8 w-12 mx-auto mb-1' />
							<Skeleton className='h-4 w-20 mx-auto' />
						</CardContent>
					</Card>
				</div>
			</div>

			{/* Deal Pipeline Skeleton */}
			<div className='space-y-4'>
				<Skeleton className='h-7 w-32' />
				<Card>
					<CardContent className='pt-6'>
						<div className='space-y-4'>
							<div className='flex gap-2'>
								<Skeleton className='h-32 flex-1' />
								<Skeleton className='h-32 flex-1' />
								<Skeleton className='h-32 flex-1' />
								<Skeleton className='h-32 flex-1' />
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Upcoming & Recent Activities Skeleton */}
			<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
				<div className='space-y-4'>
					<Skeleton className='h-7 w-48' />
					<Card>
						<CardContent className='pt-6'>
							<div className='space-y-3'>
								<Skeleton className='h-16 w-full' />
								<Skeleton className='h-16 w-full' />
								<Skeleton className='h-16 w-full' />
							</div>
						</CardContent>
					</Card>
				</div>
				<div className='space-y-4'>
					<Skeleton className='h-7 w-40' />
					<Card>
						<CardContent className='pt-6'>
							<div className='space-y-3'>
								<Skeleton className='h-16 w-full' />
								<Skeleton className='h-16 w-full' />
								<Skeleton className='h-16 w-full' />
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}

