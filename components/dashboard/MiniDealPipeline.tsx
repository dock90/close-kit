'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface Deal {
	id: string;
	name: string;
	value: number;
	stage: string;
	company?: {
		name: string;
	};
}

interface MiniDealPipelineProps {
	deals: Deal[];
}

const STAGES = [
	{ key: 'lead', label: 'Lead', color: 'bg-gray-100' },
	{ key: 'contacted', label: 'Contacted', color: 'bg-blue-100' },
	{ key: 'discovery', label: 'Discovery', color: 'bg-yellow-100' },
	{ key: 'proposal', label: 'Proposal', color: 'bg-orange-100' },
	{ key: 'negotiation', label: 'Negotiation', color: 'bg-purple-100' },
];

export function MiniDealPipeline({ deals }: MiniDealPipelineProps) {
	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			minimumFractionDigits: 0,
			maximumFractionDigits: 0,
		}).format(amount);
	};

	const getDealsByStage = (stage: string) => {
		return deals.filter((deal) => deal.stage === stage);
	};

	const getStageValue = (stage: string) => {
		return getDealsByStage(stage).reduce(
			(sum, deal) => sum + deal.value,
			0
		);
	};

	return (
		<Card className='p-6'>
			<div className='space-y-6'>
				<div className='flex items-center justify-between'>
					<div>
						<h3 className='text-lg font-semibold text-gray-900'>
							Deal Pipeline
						</h3>
						<p className='text-sm text-gray-500 mt-1'>
							{deals.length} active deals •{' '}
							{formatCurrency(
								deals.reduce((sum, deal) => sum + deal.value, 0)
							)}
						</p>
					</div>
					<Link
						href='/deals'
						className='flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-700'
					>
						View All
						<ChevronRight className='h-4 w-4 ml-1' />
					</Link>
				</div>

				<div className='grid grid-cols-1 md:grid-cols-5 gap-4'>
					{STAGES.map((stage) => {
						const stageDeals = getDealsByStage(stage.key);
						const stageValue = getStageValue(stage.key);

						return (
							<div key={stage.key}>
								<div
									className={`${stage.color} rounded-lg p-4 min-h-[280px]`}
								>
									<div className='mb-3'>
										<h4 className='font-medium text-gray-900 text-sm'>
											{stage.label}
										</h4>
										<p className='text-xs text-gray-600 mt-1'>
											{stageDeals.length} •{' '}
											{formatCurrency(stageValue)}
										</p>
									</div>

									<div className='space-y-2'>
										{stageDeals.slice(0, 3).map((deal) => (
											<div
												key={deal.id}
												className='bg-white rounded-lg p-3 shadow-sm'
											>
												<h5 className='font-medium text-xs text-gray-900 line-clamp-1'>
													{deal.name}
												</h5>
												<p className='text-xs text-gray-500 mt-1'>
													{deal.company?.name}
												</p>
												<p className='text-xs font-semibold text-gray-900 mt-1'>
													{formatCurrency(deal.value)}
												</p>
											</div>
										))}

										{stageDeals.length > 3 && (
											<div className='text-center py-2'>
												<span className='text-xs text-gray-600'>
													+{stageDeals.length - 3}{' '}
													more
												</span>
											</div>
										)}

										{stageDeals.length === 0 && (
											<div className='text-center py-8'>
												<p className='text-xs text-gray-400'>
													No deals
												</p>
											</div>
										)}
									</div>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</Card>
	);
}
