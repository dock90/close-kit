import React from 'react';
import { Card } from '@/components/ui/card';
import {
	Users,
	Mail,
	MessageSquare,
	Phone,
	Calendar,
	FileText,
	DollarSign,
	TrendingUp,
	ArrowRight,
	CheckCircle,
	XCircle,
} from 'lucide-react';

interface ConversionFunnelProps {
	data: {
		leads: number;
		contacted: number;
		discovery: number;
		proposals: number;
		negotiations: number;
		closedWon: number;
		closedLost: number;
	};
	showPercentages?: boolean;
}

const FUNNEL_STAGES = [
	{
		key: 'leads',
		label: 'Leads',
		icon: Users,
		color: 'bg-gray-100 text-gray-800',
		description: 'Total leads generated',
	},
	{
		key: 'contacted',
		label: 'Contacted',
		icon: Mail,
		color: 'bg-blue-100 text-blue-800',
		description: 'Leads contacted',
	},
	{
		key: 'discovery',
		label: 'Discovery',
		icon: MessageSquare,
		color: 'bg-yellow-100 text-yellow-800',
		description: 'In discovery phase',
	},
	{
		key: 'proposals',
		label: 'Proposals',
		icon: FileText,
		color: 'bg-orange-100 text-orange-800',
		description: 'Proposals sent',
	},
	{
		key: 'negotiations',
		label: 'Negotiations',
		color: 'bg-purple-100 text-purple-800',
		icon: Phone,
		description: 'In negotiation',
	},
	{
		key: 'closedWon',
		label: 'Closed Won',
		icon: CheckCircle,
		color: 'bg-green-100 text-green-800',
		description: 'Successfully closed',
	},
	{
		key: 'closedLost',
		label: 'Closed Lost',
		icon: XCircle,
		color: 'bg-red-100 text-red-800',
		description: 'Lost deals',
	},
];

export function ConversionFunnel({
	data,
	showPercentages = true,
}: ConversionFunnelProps) {
	const calculateConversionRate = (current: number, previous: number) => {
		if (previous === 0) return 0;
		return (current / previous) * 100;
	};

	const getStageValue = (stageKey: string) => {
		return data[stageKey as keyof typeof data] || 0;
	};

	const getStageWidth = (stageKey: string) => {
		const value = getStageValue(stageKey);
		const maxValue = Math.max(...Object.values(data));
		return maxValue > 0 ? (value / maxValue) * 100 : 0;
	};

	const getConversionRate = (stageKey: string, previousStageKey: string) => {
		const current = getStageValue(stageKey);
		const previous = getStageValue(previousStageKey);
		return calculateConversionRate(current, previous);
	};

	const totalLeads = data.leads;
	const totalClosed = data.closedWon + data.closedLost;
	const overallConversionRate = calculateConversionRate(
		totalClosed,
		totalLeads
	);
	const winRate = calculateConversionRate(data.closedWon, totalClosed);

	return (
		<Card className='p-6'>
			<div className='space-y-6'>
				{/* Header */}
				<div className='flex items-center justify-between'>
					<div className='flex items-center space-x-3'>
						<TrendingUp className='h-6 w-6 text-blue-600' />
						<h3 className='text-lg font-semibold text-gray-900'>
							Conversion Funnel
						</h3>
					</div>
					<div className='text-sm text-gray-500'>
						{showPercentages
							? 'Showing percentages'
							: 'Showing counts'}
					</div>
				</div>

				{/* Summary Stats */}
				<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
					<div className='bg-blue-50 rounded-lg p-4'>
						<div className='flex items-center space-x-2'>
							<Users className='h-5 w-5 text-blue-600' />
							<span className='text-sm font-medium text-blue-800'>
								Total Leads
							</span>
						</div>
						<p className='text-2xl font-bold text-blue-900 mt-1'>
							{totalLeads.toLocaleString()}
						</p>
					</div>

					<div className='bg-green-50 rounded-lg p-4'>
						<div className='flex items-center space-x-2'>
							<CheckCircle className='h-5 w-5 text-green-600' />
							<span className='text-sm font-medium text-green-800'>
								Win Rate
							</span>
						</div>
						<p className='text-2xl font-bold text-green-900 mt-1'>
							{winRate.toFixed(1)}%
						</p>
					</div>

					<div className='bg-purple-50 rounded-lg p-4'>
						<div className='flex items-center space-x-2'>
							<TrendingUp className='h-5 w-5 text-purple-600' />
							<span className='text-sm font-medium text-purple-800'>
								Overall Conversion
							</span>
						</div>
						<p className='text-2xl font-bold text-purple-900 mt-1'>
							{overallConversionRate.toFixed(1)}%
						</p>
					</div>
				</div>

				{/* Funnel Visualization */}
				<div className='space-y-4'>
					<h4 className='font-medium text-gray-900'>
						Sales Pipeline
					</h4>

					<div className='space-y-3'>
						{FUNNEL_STAGES.map((stage, index) => {
							const value = getStageValue(stage.key);
							const width = getStageWidth(stage.key);
							const Icon = stage.icon;

							// Calculate conversion rate from previous stage
							const previousStage =
								index > 0 ? FUNNEL_STAGES[index - 1] : null;
							const conversionRate = previousStage
								? getConversionRate(
										stage.key,
										previousStage.key
								  )
								: 100;

							return (
								<div key={stage.key} className='space-y-2'>
									<div className='flex items-center justify-between'>
										<div className='flex items-center space-x-3'>
											<div
												className={`w-8 h-8 ${stage.color} rounded-lg flex items-center justify-center`}
											>
												<Icon className='h-4 w-4' />
											</div>
											<div>
												<h5 className='font-medium text-gray-900'>
													{stage.label}
												</h5>
												<p className='text-xs text-gray-500'>
													{stage.description}
												</p>
											</div>
										</div>

										<div className='text-right'>
											<p className='text-lg font-semibold text-gray-900'>
												{value.toLocaleString()}
											</p>
											{showPercentages &&
												previousStage && (
													<p className='text-sm text-gray-600'>
														{conversionRate.toFixed(
															1
														)}
														% of{' '}
														{previousStage.label.toLowerCase()}
													</p>
												)}
										</div>
									</div>

									{/* Funnel Bar */}
									<div className='relative'>
										<div className='w-full bg-gray-200 rounded-full h-8'>
											<div
												className={`h-8 ${
													stage.color.split(' ')[0]
												} rounded-full transition-all duration-500 ease-out flex items-center justify-end pr-3`}
												style={{
													width: `${Math.max(
														width,
														5
													)}%`,
												}}
											>
												{width > 15 && (
													<span className='text-sm font-medium text-white'>
														{showPercentages
															? `${conversionRate.toFixed(
																	1
															  )}%`
															: value.toLocaleString()}
													</span>
												)}
											</div>
										</div>
										{width <= 15 && (
											<div className='absolute right-3 top-1/2 transform -translate-y-1/2 text-sm font-medium text-gray-600'>
												{showPercentages
													? `${conversionRate.toFixed(
															1
													  )}%`
													: value.toLocaleString()}
											</div>
										)}
									</div>

									{/* Arrow to next stage */}
									{index < FUNNEL_STAGES.length - 1 && (
										<div className='flex justify-center'>
											<ArrowRight className='h-4 w-4 text-gray-400' />
										</div>
									)}
								</div>
							);
						})}
					</div>
				</div>

				{/* Insights */}
				<div className='bg-gray-50 rounded-lg p-4'>
					<h4 className='font-medium text-gray-900 mb-2'>
						Funnel Insights
					</h4>
					<div className='space-y-2 text-sm text-gray-600'>
						{(() => {
							const insights = [];

							// Find biggest drop-off
							const dropOffs = FUNNEL_STAGES.slice(0, -2).map(
								(stage, index) => {
									const current = getStageValue(stage.key);
									const next = getStageValue(
										FUNNEL_STAGES[index + 1].key
									);
									const dropOff = current - next;
									return {
										stage: stage.label,
										dropOff,
										rate: (dropOff / current) * 100,
									};
								}
							);

							const biggestDropOff = dropOffs.reduce(
								(max, current) =>
									current.dropOff > max.dropOff
										? current
										: max
							);

							if (biggestDropOff.dropOff > 0) {
								insights.push(
									`Biggest drop-off occurs at ${
										biggestDropOff.stage
									} stage (${biggestDropOff.rate.toFixed(
										1
									)}% loss)`
								);
							}

							// Check win rate
							if (winRate < 20) {
								insights.push(
									'Win rate is below 20% - consider improving qualification or proposal quality'
								);
							} else if (winRate > 50) {
								insights.push(
									'Excellent win rate! Your qualification process is working well'
								);
							}

							// Check overall conversion
							if (overallConversionRate < 5) {
								insights.push(
									'Overall conversion rate is low - focus on improving lead quality'
								);
							} else if (overallConversionRate > 15) {
								insights.push(
									'Strong overall conversion rate - great job on lead generation and nurturing'
								);
							}

							return insights.length > 0
								? insights
								: [
										'Your funnel looks healthy! Keep up the great work.',
								  ];
						})().map((insight, index) => (
							<p
								key={index}
								className='flex items-start space-x-2'
							>
								<span className='text-blue-500 mt-0.5'>•</span>
								<span>{insight}</span>
							</p>
						))}
					</div>
				</div>
			</div>
		</Card>
	);
}
