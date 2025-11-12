'use client';

import { Card } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';

interface StickyHeaderProps {
	metrics: {
		totalDeals: number;
		openDeals: number;
		wonDeals: number;
		totalRevenue: number;
	};
}

export function StickyHeader({ metrics }: StickyHeaderProps) {
	return (
		<div className='sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm lg:hidden'>
			<div className='px-4 py-3'>
				<div className='grid grid-cols-4 gap-2'>
					<div className='text-center'>
						<div className='text-xs text-gray-500 mb-1'>Total</div>
						<div className='text-lg font-bold text-gray-900'>
							{metrics.totalDeals}
						</div>
					</div>
					<div className='text-center'>
						<div className='text-xs text-gray-500 mb-1'>Open</div>
						<div className='text-lg font-bold text-blue-600'>
							{metrics.openDeals}
						</div>
					</div>
					<div className='text-center'>
						<div className='text-xs text-gray-500 mb-1'>Won</div>
						<div className='text-lg font-bold text-green-600'>
							{metrics.wonDeals}
						</div>
					</div>
					<div className='text-center'>
						<div className='text-xs text-gray-500 mb-1'>Revenue</div>
						<div className='text-sm font-bold text-gray-900'>
							{formatCurrency(metrics.totalRevenue).replace(/\.\d{2}$/, '')}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
