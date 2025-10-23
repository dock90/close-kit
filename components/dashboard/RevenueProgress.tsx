import React from 'react';
import { Card } from '@/components/ui/card';

interface RevenueProgressProps {
	currentRevenue: number;
	targetRevenue: number;
	period: string;
	startDate: Date;
	endDate: Date;
}

export function RevenueProgress({
	currentRevenue,
	targetRevenue,
	period,
	startDate,
	endDate,
}: RevenueProgressProps) {
	const progressPercentage = Math.min(
		(currentRevenue / targetRevenue) * 100,
		100
	);
	const remainingRevenue = Math.max(targetRevenue - currentRevenue, 0);

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			minimumFractionDigits: 0,
			maximumFractionDigits: 0,
		}).format(amount);
	};

	const getDaysRemaining = () => {
		const now = new Date();
		const end = new Date(endDate);
		const diffTime = end.getTime() - now.getTime();
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		return Math.max(diffDays, 0);
	};

	const getProgressColor = () => {
		if (progressPercentage >= 100) return 'bg-green-500';
		if (progressPercentage >= 75) return 'bg-blue-500';
		if (progressPercentage >= 50) return 'bg-yellow-500';
		return 'bg-red-500';
	};

	return (
		<Card className='p-6'>
			<div className='space-y-4'>
				<div className='flex items-center justify-between'>
					<h3 className='text-lg font-semibold text-gray-900'>
						Revenue Goal
					</h3>
					<span className='text-sm text-gray-500'>{period}</span>
				</div>

				<div className='space-y-2'>
					<div className='flex justify-between text-sm'>
						<span className='text-gray-600'>Progress</span>
						<span className='font-medium'>
							{progressPercentage.toFixed(1)}%
						</span>
					</div>

					<div className='w-full bg-gray-200 rounded-full h-3'>
						<div
							className={`h-3 rounded-full transition-all duration-300 ${getProgressColor()}`}
							style={{ width: `${progressPercentage}%` }}
						/>
					</div>

					<div className='flex justify-between text-sm text-gray-600'>
						<span>{formatCurrency(currentRevenue)}</span>
						<span>{formatCurrency(targetRevenue)}</span>
					</div>
				</div>

				<div className='grid grid-cols-2 gap-4 pt-4 border-t'>
					<div>
						<p className='text-sm text-gray-500'>Remaining</p>
						<p className='text-lg font-semibold text-gray-900'>
							{formatCurrency(remainingRevenue)}
						</p>
					</div>
					<div>
						<p className='text-sm text-gray-500'>Days Left</p>
						<p className='text-lg font-semibold text-gray-900'>
							{getDaysRemaining()}
						</p>
					</div>
				</div>

				{progressPercentage < 100 && (
					<div className='text-xs text-gray-500 bg-gray-50 p-3 rounded-lg'>
						<p className='font-medium mb-1'>Daily target needed:</p>
						<p>
							{formatCurrency(
								remainingRevenue /
									Math.max(getDaysRemaining(), 1)
							)}{' '}
							per day
						</p>
					</div>
				)}
			</div>
		</Card>
	);
}
