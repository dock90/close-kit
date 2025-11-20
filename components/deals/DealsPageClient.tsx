'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { DealKanban } from './DealKanban';
import { useDealStore, Deal } from '@/lib/stores';

export function DealsPageClient() {
	const router = useRouter();
	const { deals, setDeals, updateDeal, setLoading, isLoading } =
		useDealStore();

	useEffect(() => {
		fetchDeals();
	}, []);

	const fetchDeals = async () => {
		try {
			setLoading(true);
			const response = await fetch('/api/deals');
			if (response.ok) {
				const data = await response.json();
				setDeals(data);
			}
		} catch (error) {
			console.error('Error fetching deals:', error);
		} finally {
			setLoading(false);
		}
	};

	const handleDealUpdate = async (
		dealId: string,
		updates: Partial<Deal>
	) => {
		try {
			const response = await fetch(`/api/deals/${dealId}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(updates),
			});

			if (response.ok) {
				const updatedDeal = await response.json();
				updateDeal(dealId, updatedDeal);
			}
		} catch (error) {
			console.error('Error updating deal:', error);
		}
	};

	const handleDealView = (deal: Deal) => {
		router.push(`/deals/${deal.id}`);
	};

	if (isLoading) {
		return (
			<div className='flex items-center justify-center py-12'>
				<div className='text-center'>
					<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
					<p className='text-gray-600'>Loading deals...</p>
				</div>
			</div>
		);
	}

	return (
		<div className='space-y-6'>
			<div className='flex justify-between items-center'>
				<div>
					<h1 className='text-3xl font-bold text-gray-900'>
						Deals Pipeline
					</h1>
					<p className='text-gray-600'>
						Track your deals through the sales process
					</p>
				</div>
				<button
					onClick={() => router.push('/deals/new')}
					className='inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 touch-manipulation'
					style={{ minHeight: '44px' }}
				>
					<Plus className='h-4 w-4 mr-2' />
					Add Deal
				</button>
			</div>

			{deals.length === 0 ? (
				<div className='text-center py-12'>
					<div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4'>
						<Plus className='h-8 w-8 text-gray-400' />
					</div>
					<h3 className='text-lg font-medium text-gray-900 mb-2'>
						No deals yet
					</h3>
					<p className='text-gray-600 mb-6'>
						Get started by creating your first deal
					</p>
					<button
						onClick={() => router.push('/deals/new')}
						className='inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700'
					>
						<Plus className='h-4 w-4 mr-2' />
						Add Deal
					</button>
				</div>
			) : (
				<DealKanban
					onDealUpdate={handleDealUpdate}
					onDealView={handleDealView}
				/>
			)}
		</div>
	);
}
