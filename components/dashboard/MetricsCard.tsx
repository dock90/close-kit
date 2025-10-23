import React from 'react';
import { Card } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface MetricsCardProps {
	title: string;
	value: string | number;
	change?: {
		value: number;
		type: 'increase' | 'decrease' | 'neutral';
	};
	icon?: LucideIcon;
	description?: string;
}

export function MetricsCard({
	title,
	value,
	change,
	icon: Icon,
	description,
}: MetricsCardProps) {
	const getChangeColor = () => {
		if (!change) return 'text-gray-500';
		switch (change.type) {
			case 'increase':
				return 'text-green-600';
			case 'decrease':
				return 'text-red-600';
			default:
				return 'text-gray-500';
		}
	};

	const getChangeIcon = () => {
		if (!change) return null;
		switch (change.type) {
			case 'increase':
				return '↗';
			case 'decrease':
				return '↘';
			default:
				return '→';
		}
	};

	return (
		<Card className='p-6'>
			<div className='flex items-center justify-between'>
				<div className='flex-1'>
					<p className='text-sm font-medium text-gray-600'>{title}</p>
					<p className='text-2xl font-bold text-gray-900 mt-1'>
						{value}
					</p>
					{change && (
						<div
							className={`flex items-center mt-2 text-sm ${getChangeColor()}`}
						>
							<span className='mr-1'>{getChangeIcon()}</span>
							<span>{Math.abs(change.value)}%</span>
							<span className='ml-1 text-gray-500'>
								vs last period
							</span>
						</div>
					)}
					{description && (
						<p className='text-xs text-gray-500 mt-2'>
							{description}
						</p>
					)}
				</div>
				{Icon && (
					<div className='flex-shrink-0'>
						<Icon className='h-8 w-8 text-gray-400' />
					</div>
				)}
			</div>
		</Card>
	);
}
