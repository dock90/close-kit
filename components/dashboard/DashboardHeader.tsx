'use client';

import { StickyHeader } from '@/components/ui/sticky-header';

interface DashboardHeaderProps {
	totalDeals: number;
	openDeals: number;
	wonDeals: number;
	totalRevenue: number;
}

export function DashboardHeader({
	totalDeals,
	openDeals,
	wonDeals,
	totalRevenue,
}: DashboardHeaderProps) {
	return (
		<StickyHeader
			metrics={{
				totalDeals,
				openDeals,
				wonDeals,
				totalRevenue,
			}}
		/>
	);
}
