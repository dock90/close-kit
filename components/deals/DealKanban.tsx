import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import {
	DollarSign,
	Calendar,
	Building2,
	User,
	Edit,
	Trash2,
} from 'lucide-react';
import { useDealStore, Deal, DealStage } from '@/lib/stores';

interface DealKanbanProps {
	onDealUpdate?: (dealId: string, updates: Partial<Deal>) => void;
	onDealEdit?: (deal: Deal) => void;
	onDealDelete?: (deal: Deal) => void;
}

const STAGES: { key: DealStage; label: string; color: string }[] = [
	{ key: 'lead', label: 'Lead', color: 'bg-gray-100 border-gray-300' },
	{
		key: 'contacted',
		label: 'Contacted',
		color: 'bg-blue-100 border-blue-300',
	},
	{
		key: 'discovery',
		label: 'Discovery',
		color: 'bg-yellow-100 border-yellow-300',
	},
	{
		key: 'proposal',
		label: 'Proposal',
		color: 'bg-orange-100 border-orange-300',
	},
	{
		key: 'negotiation',
		label: 'Negotiation',
		color: 'bg-purple-100 border-purple-300',
	},
	{
		key: 'closed_won',
		label: 'Closed Won',
		color: 'bg-green-100 border-green-300',
	},
	{
		key: 'closed_lost',
		label: 'Closed Lost',
		color: 'bg-red-100 border-red-300',
	},
];

export function DealKanban({
	onDealUpdate,
	onDealEdit,
	onDealDelete,
}: DealKanbanProps) {
	const { deals, moveDealToStage } = useDealStore();
	const [draggedDeal, setDraggedDeal] = useState<string | null>(null);

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			minimumFractionDigits: 0,
			maximumFractionDigits: 0,
		}).format(amount);
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

	const handleDragStart = (e: React.DragEvent, dealId: string) => {
		setDraggedDeal(dealId);
		e.dataTransfer.effectAllowed = 'move';
	};

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
		e.dataTransfer.dropEffect = 'move';
	};

	const handleDrop = (e: React.DragEvent, targetStage: DealStage) => {
		e.preventDefault();
		if (draggedDeal) {
			moveDealToStage(draggedDeal, targetStage);
			onDealUpdate?.(draggedDeal, { stage: targetStage });
		}
		setDraggedDeal(null);
	};

	const handleActionClick = (e: React.MouseEvent, action: () => void) => {
		e.stopPropagation();
		action();
	};

	return (
		<div className='space-y-6'>
			<div className='flex items-center justify-between'>
				<div>
					<h2 className='text-2xl font-bold text-gray-900'>
						Deal Pipeline
					</h2>
					<p className='text-gray-600'>{deals.length} total deals</p>
				</div>
			</div>

			<div className='overflow-x-auto'>
				<div className='flex space-x-4 min-w-max pb-4'>
					{STAGES.map((stage) => {
						const stageDeals = getDealsByStage(stage.key);
						const stageValue = getStageValue(stage.key);

						return (
							<div key={stage.key} className='flex-shrink-0 w-80'>
								<Card
									className={`${stage.color} border-2 min-h-[500px]`}
								>
									<div className='p-4 border-b border-gray-200'>
										<div className='flex items-center justify-between'>
											<h3 className='font-semibold text-gray-900'>
												{stage.label}
											</h3>
											<span className='text-sm text-gray-600'>
												{stageDeals.length}
											</span>
										</div>
										<p className='text-sm text-gray-600 mt-1'>
											{formatCurrency(stageValue)}
										</p>
									</div>

									<div
										className='p-4 space-y-3 min-h-[400px]'
										onDragOver={handleDragOver}
										onDrop={(e) => handleDrop(e, stage.key)}
									>
										{stageDeals.map((deal) => (
											<div
												key={deal.id}
												draggable
												onDragStart={(e) =>
													handleDragStart(e, deal.id)
												}
												className='bg-white rounded-lg p-4 shadow-sm border cursor-move hover:shadow-md transition-all duration-200 group'
											>
												<div className='space-y-3'>
													<div className='flex items-start justify-between'>
														<h4 className='font-medium text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors'>
															{deal.name}
														</h4>
														<div className='flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity'>
															{onDealEdit && (
																<button
																	onClick={(
																		e
																	) =>
																		handleActionClick(
																			e,
																			() =>
																				onDealEdit(
																					deal
																				)
																		)
																	}
																	className='p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors'
																	title='Edit deal'
																>
																	<Edit className='h-3 w-3' />
																</button>
															)}
															{onDealDelete && (
																<button
																	onClick={(
																		e
																	) =>
																		handleActionClick(
																			e,
																			() =>
																				onDealDelete(
																					deal
																				)
																		)
																	}
																	className='p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors'
																	title='Delete deal'
																>
																	<Trash2 className='h-3 w-3' />
																</button>
															)}
														</div>
													</div>

													<div className='flex items-center justify-between'>
														<span className='text-lg font-semibold text-gray-900'>
															{formatCurrency(
																deal.value
															)}
														</span>
														<span className='text-sm text-gray-600'>
															{deal.probability}%
														</span>
													</div>

													<div className='space-y-2'>
														<div className='flex items-center space-x-2 text-sm text-gray-600'>
															<Building2 className='h-3 w-3' />
															<span className='truncate'>
																{
																	deal.company
																		?.name
																}
															</span>
														</div>
														<div className='flex items-center space-x-2 text-sm text-gray-600'>
															<User className='h-3 w-3' />
															<span>
																{
																	deal.contact
																		?.firstName
																}{' '}
																{
																	deal.contact
																		?.lastName
																}
															</span>
														</div>
														{deal.expectedCloseDate && (
															<div className='flex items-center space-x-2 text-sm text-gray-600'>
																<Calendar className='h-3 w-3' />
																<span>
																	Due{' '}
																	{formatDate(
																		new Date(
																			deal.expectedCloseDate
																		)
																	)}
																</span>
															</div>
														)}
													</div>

													{deal.serviceType && (
														<div className='text-xs text-gray-500'>
															<span className='bg-gray-100 px-2 py-1 rounded'>
																{
																	deal.serviceType
																}
															</span>
														</div>
													)}

													{deal.projectDuration && (
														<div className='text-xs text-gray-500'>
															<span className='bg-gray-100 px-2 py-1 rounded'>
																{
																	deal.projectDuration
																}
															</span>
														</div>
													)}
												</div>
											</div>
										))}

										{stageDeals.length === 0 && (
											<div className='text-center text-gray-400 py-8'>
												<DollarSign className='h-8 w-8 mx-auto mb-2' />
												<p className='text-sm'>
													No deals in this stage
												</p>
											</div>
										)}
									</div>
								</Card>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}
