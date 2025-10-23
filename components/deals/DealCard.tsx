import React from 'react';
import { Card } from '@/components/ui/card';
import {
	DollarSign,
	Calendar,
	Building2,
	User,
	Edit,
	Trash2,
	TrendingUp,
	Clock,
	CheckCircle,
	XCircle,
} from 'lucide-react';
import { Deal, DealStage } from '@/lib/stores';

interface DealCardProps {
	deal: Deal;
	onEdit?: (deal: Deal) => void;
	onDelete?: (deal: Deal) => void;
	onStageChange?: (dealId: string, newStage: DealStage) => void;
	compact?: boolean;
}

export function DealCard({
	deal,
	onEdit,
	onDelete,
	onStageChange,
	compact = false,
}: DealCardProps) {
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
			year: 'numeric',
		}).format(date);
	};

	const getStageColor = (stage: DealStage) => {
		const colors = {
			lead: 'bg-gray-100 text-gray-800 border-gray-200',
			contacted: 'bg-blue-100 text-blue-800 border-blue-200',
			discovery: 'bg-yellow-100 text-yellow-800 border-yellow-200',
			proposal: 'bg-orange-100 text-orange-800 border-orange-200',
			negotiation: 'bg-purple-100 text-purple-800 border-purple-200',
			closed_won: 'bg-green-100 text-green-800 border-green-200',
			closed_lost: 'bg-red-100 text-red-800 border-red-200',
		};
		return colors[stage] || 'bg-gray-100 text-gray-800 border-gray-200';
	};

	const getStageIcon = (stage: DealStage) => {
		switch (stage) {
			case 'closed_won':
				return <CheckCircle className='h-4 w-4' />;
			case 'closed_lost':
				return <XCircle className='h-4 w-4' />;
			default:
				return <TrendingUp className='h-4 w-4' />;
		}
	};

	const getDaysUntilClose = () => {
		if (!deal.expectedCloseDate) return null;
		const now = new Date();
		const diffTime =
			new Date(deal.expectedCloseDate).getTime() - now.getTime();
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		return diffDays;
	};

	const getUrgencyColor = (days: number) => {
		if (days < 0) return 'text-red-600';
		if (days <= 7) return 'text-orange-600';
		if (days <= 30) return 'text-yellow-600';
		return 'text-gray-600';
	};

	const handleActionClick = (e: React.MouseEvent, action: () => void) => {
		e.stopPropagation();
		action();
	};

	const daysUntilClose = getDaysUntilClose();

	if (compact) {
		return (
			<Card className='p-4 hover:shadow-md transition-shadow cursor-pointer group'>
				<div className='space-y-3'>
					<div className='flex items-start justify-between'>
						<div className='flex-1 min-w-0'>
							<h4 className='font-medium text-gray-900 truncate group-hover:text-blue-600 transition-colors'>
								{deal.name}
							</h4>
							<p className='text-sm text-gray-600 truncate'>
								{deal.company.name}
							</p>
						</div>
						<div className='flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity'>
							{onEdit && (
								<button
									onClick={(e) =>
										handleActionClick(e, () => onEdit(deal))
									}
									className='p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors'
								>
									<Edit className='h-3 w-3' />
								</button>
							)}
							{onDelete && (
								<button
									onClick={(e) =>
										handleActionClick(e, () =>
											onDelete(deal)
										)
									}
									className='p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors'
								>
									<Trash2 className='h-3 w-3' />
								</button>
							)}
						</div>
					</div>

					<div className='flex items-center justify-between'>
						<span className='text-lg font-semibold text-gray-900'>
							{formatCurrency(deal.value)}
						</span>
						<span
							className={`px-2 py-1 rounded-full text-xs font-medium ${getStageColor(
								deal.stage
							)}`}
						>
							{deal.stage.replace('_', ' ')}
						</span>
					</div>
				</div>
			</Card>
		);
	}

	return (
		<Card className='p-6 hover:shadow-lg transition-all duration-200 cursor-pointer group'>
			<div className='space-y-4'>
				{/* Header */}
				<div className='flex items-start justify-between'>
					<div className='flex-1 min-w-0'>
						<h3 className='text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors'>
							{deal.name}
						</h3>
						<div className='flex items-center space-x-2 mt-1'>
							<Building2 className='h-4 w-4 text-gray-400' />
							<span className='text-sm text-gray-600'>
								{deal.company?.name}
							</span>
						</div>
					</div>

					{/* Actions */}
					<div className='flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity'>
						{onEdit && (
							<button
								onClick={(e) =>
									handleActionClick(e, () => onEdit(deal))
								}
								className='p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors'
								title='Edit deal'
							>
								<Edit className='h-4 w-4' />
							</button>
						)}
						{onDelete && (
							<button
								onClick={(e) =>
									handleActionClick(e, () => onDelete(deal))
								}
								className='p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors'
								title='Delete deal'
							>
								<Trash2 className='h-4 w-4' />
							</button>
						)}
					</div>
				</div>

				{/* Value and Probability */}
				<div className='flex items-center justify-between'>
					<div>
						<p className='text-2xl font-bold text-gray-900'>
							{formatCurrency(deal.value)}
						</p>
						<p className='text-sm text-gray-600'>Deal Value</p>
					</div>
					<div className='text-right'>
						<p className='text-lg font-semibold text-gray-900'>
							{deal.probability}%
						</p>
						<p className='text-sm text-gray-600'>Probability</p>
					</div>
				</div>

				{/* Stage */}
				<div className='flex items-center space-x-2'>
					<span
						className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium border ${getStageColor(
							deal.stage
						)}`}
					>
						{getStageIcon(deal.stage)}
						<span>{deal.stage.replace('_', ' ')}</span>
					</span>
				</div>

				{/* Contact */}
				<div className='flex items-center space-x-2 text-sm text-gray-600'>
					<User className='h-4 w-4' />
					<span>
						{deal.contact?.firstName} {deal.contact?.lastName}
					</span>
				</div>

				{/* Expected Close Date */}
				{deal.expectedCloseDate && (
					<div className='flex items-center space-x-2 text-sm'>
						<Calendar className='h-4 w-4 text-gray-400' />
						<span className='text-gray-600'>Expected close:</span>
						<span
							className={`font-medium ${
								daysUntilClose !== null
									? getUrgencyColor(daysUntilClose)
									: 'text-gray-900'
							}`}
						>
							{formatDate(new Date(deal.expectedCloseDate))}
						</span>
						{daysUntilClose !== null && (
							<span
								className={`text-xs ${getUrgencyColor(
									daysUntilClose
								)}`}
							>
								(
								{daysUntilClose < 0
									? `${Math.abs(daysUntilClose)} days overdue`
									: daysUntilClose === 0
									? 'Due today'
									: `${daysUntilClose} days left`}
								)
							</span>
						)}
					</div>
				)}

				{/* Actual Close Date */}
				{deal.actualCloseDate && (
					<div className='flex items-center space-x-2 text-sm text-gray-600'>
						<CheckCircle className='h-4 w-4 text-green-500' />
						<span>
							Closed on{' '}
							{formatDate(new Date(deal.actualCloseDate))}
						</span>
					</div>
				)}

				{/* Service Details */}
				{(deal.serviceType || deal.projectDuration) && (
					<div className='flex flex-wrap gap-2'>
						{deal.serviceType && (
							<span className='bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium'>
								{deal.serviceType}
							</span>
						)}
						{deal.projectDuration && (
							<span className='bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium'>
								{deal.projectDuration}
							</span>
						)}
					</div>
				)}

				{/* Lost Reason */}
				{deal.lostReason && (
					<div className='bg-red-50 border border-red-200 rounded-lg p-3'>
						<p className='text-sm font-medium text-red-800'>
							Lost Reason
						</p>
						<p className='text-sm text-red-700 mt-1'>
							{deal.lostReason}
						</p>
					</div>
				)}

				{/* Footer */}
				<div className='flex items-center justify-between pt-4 border-t text-xs text-gray-500'>
					<span>Created {formatDate(new Date(deal.createdAt))}</span>
					<span>Updated {formatDate(new Date(deal.updatedAt))}</span>
				</div>
			</div>
		</Card>
	);
}
