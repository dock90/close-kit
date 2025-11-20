import React from 'react';
import { Card } from '@/components/ui/card';
import { useDealStore, Deal, DealStage } from '@/lib/stores';

interface DealPipelineProps {
	onDealUpdate?: (dealId: string, newStage: DealStage) => void;
}

const STAGES: { key: DealStage; label: string; color: string }[] = [
	{ key: 'lead', label: 'Lead', color: 'bg-gray-100' },
	{ key: 'contacted', label: 'Contacted', color: 'bg-blue-100' },
	{ key: 'discovery', label: 'Discovery', color: 'bg-yellow-100' },
	{ key: 'proposal', label: 'Proposal', color: 'bg-orange-100' },
	{ key: 'negotiation', label: 'Negotiation', color: 'bg-purple-100' },
	{ key: 'closed_won', label: 'Closed Won', color: 'bg-green-100' },
	{ key: 'closed_lost', label: 'Closed Lost', color: 'bg-red-100' },
];

export function DealPipeline({ onDealUpdate }: DealPipelineProps) {
	const { deals, moveDealToStage } = useDealStore();
	const formatCurrency = (amount: number) => {
		// Convert from cents to dollars
		const dollars = amount / 100;
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			minimumFractionDigits: 0,
			maximumFractionDigits: 0,
		}).format(dollars);
	};

	const formatDate = (date: Date) => {
		return new Intl.DateTimeFormat('en-US', {
			month: 'short',
			day: 'numeric',
		}).format(date);
	};

	const getDealsByStage = (stage: DealStage) => {
		return deals.filter((deal) => deal.stage === stage);
	};

	const getStageValue = (stage: DealStage) => {
		return getDealsByStage(stage).reduce(
			(sum, deal) => sum + deal.value,
			0
		);
	};

	const handleDealUpdate = (dealId: string, newStage: DealStage) => {
		moveDealToStage(dealId, newStage);
		onDealUpdate?.(dealId, newStage);
	};

	return (
		<Card className='p-6'>
			<div className='space-y-6'>
				<div className='flex items-center justify-between'>
					<h3 className='text-lg font-semibold text-gray-900'>
						Deal Pipeline
					</h3>
					<div className='text-sm text-gray-500'>
						{deals.length} deals •{' '}
						{formatCurrency(
							deals.reduce((sum, deal) => sum + deal.value, 0)
						)}
					</div>
				</div>

				<div className='overflow-x-auto'>
					<div className='flex space-x-4 min-w-max'>
						{STAGES.map((stage) => {
							const stageDeals = getDealsByStage(stage.key);
							const stageValue = getStageValue(stage.key);

							return (
								<div
									key={stage.key}
									className='flex-shrink-0 w-64'
								>
									<div
										className={`${stage.color} rounded-lg p-4 min-h-[400px]`}
									>
										<div className='mb-4'>
											<h4 className='font-medium text-gray-900'>
												{stage.label}
											</h4>
											<p className='text-sm text-gray-600'>
												{stageDeals.length} deals •{' '}
												{formatCurrency(stageValue)}
											</p>
										</div>

										<div className='space-y-3'>
											{stageDeals.map((deal) => (
												<div
													key={deal.id}
													className='bg-white rounded-lg p-3 shadow-sm border cursor-pointer hover:shadow-md transition-shadow'
													onClick={() =>
														handleDealUpdate(
															deal.id,
															stage.key
														)
													}
												>
													<div className='space-y-2'>
														<div className='flex items-start justify-between'>
															<h5 className='font-medium text-sm text-gray-900 line-clamp-2'>
																{deal.name}
															</h5>
															<span className='text-xs font-medium text-gray-600 ml-2'>
																{formatCurrency(
																	deal.value
																)}
															</span>
														</div>

														<div className='text-xs text-gray-500'>
															<p>
																{
																	deal.company
																		?.name
																}
															</p>
															<p>
																{
																	deal.contact
																		?.firstName
																}{' '}
																{
																	deal.contact
																		?.lastName
																}
															</p>
															{deal.expectedCloseDate && (
																<p className='mt-1 text-orange-600'>
																	Due{' '}
																	{formatDate(
																		new Date(
																			deal.expectedCloseDate
																		)
																	)}
																</p>
															)}
														</div>
													</div>
												</div>
											))}

											{stageDeals.length === 0 && (
												<div className='text-center text-gray-400 py-8'>
													<p className='text-sm'>
														No deals in this stage
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
			</div>
		</Card>
	);
}
