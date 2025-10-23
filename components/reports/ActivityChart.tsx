import React from 'react';
import { Card } from '@/components/ui/card';
import {
	Mail,
	MessageSquare,
	Phone,
	Calendar,
	FileText,
	Activity,
} from 'lucide-react';

interface ActivityData {
	date: string;
	emailsSent: number;
	linkedinMessages: number;
	callsBooked: number;
	proposalsSent: number;
}

interface ActivityChartProps {
	data: ActivityData[];
	period?: 'week' | 'month' | 'quarter' | 'year';
	onPeriodChange?: (period: 'week' | 'month' | 'quarter' | 'year') => void;
}

const ACTIVITY_TYPES = [
	{ key: 'emailsSent', label: 'Emails', icon: Mail, color: 'bg-blue-500' },
	{
		key: 'linkedinMessages',
		label: 'LinkedIn',
		icon: MessageSquare,
		color: 'bg-purple-500',
	},
	{ key: 'callsBooked', label: 'Calls', icon: Phone, color: 'bg-green-500' },
	{
		key: 'proposalsSent',
		label: 'Proposals',
		icon: FileText,
		color: 'bg-red-500',
	},
];

export function ActivityChart({
	data,
	period = 'month',
	onPeriodChange,
}: ActivityChartProps) {
	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		switch (period) {
			case 'week':
				return new Intl.DateTimeFormat('en-US', {
					weekday: 'short',
				}).format(date);
			case 'month':
				return new Intl.DateTimeFormat('en-US', {
					month: 'short',
					day: 'numeric',
				}).format(date);
			case 'quarter':
				return `Q${Math.ceil(
					(date.getMonth() + 1) / 3
				)} ${date.getFullYear()}`;
			case 'year':
				return date.getFullYear().toString();
			default:
				return date.toLocaleDateString();
		}
	};

	const getTotalActivities = (item: ActivityData) => {
		return (
			item.emailsSent +
			item.linkedinMessages +
			item.callsBooked +
			item.proposalsSent
		);
	};

	const maxActivities = Math.max(...data.map((d) => getTotalActivities(d)));
	const totalActivities = data.reduce(
		(sum, d) => sum + getTotalActivities(d),
		0
	);
	const averageActivities =
		data.length > 0 ? totalActivities / data.length : 0;

	const PERIOD_OPTIONS = [
		{ value: 'week', label: 'Week' },
		{ value: 'month', label: 'Month' },
		{ value: 'quarter', label: 'Quarter' },
		{ value: 'year', label: 'Year' },
	];

	return (
		<Card className='p-6'>
			<div className='space-y-6'>
				{/* Header */}
				<div className='flex items-center justify-between'>
					<div className='flex items-center space-x-3'>
						<Activity className='h-6 w-6 text-blue-600' />
						<h3 className='text-lg font-semibold text-gray-900'>
							Activity Volume
						</h3>
					</div>
					{onPeriodChange && (
						<div className='flex space-x-1 bg-gray-100 rounded-lg p-1'>
							{PERIOD_OPTIONS.map((option) => (
								<button
									key={option.value}
									onClick={() =>
										onPeriodChange(option.value as any)
									}
									className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
										period === option.value
											? 'bg-white text-gray-900 shadow-sm'
											: 'text-gray-600 hover:text-gray-900'
									}`}
								>
									{option.label}
								</button>
							))}
						</div>
					)}
				</div>

				{/* Summary Stats */}
				<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
					<div className='bg-blue-50 rounded-lg p-4'>
						<div className='flex items-center space-x-2'>
							<Activity className='h-5 w-5 text-blue-600' />
							<span className='text-sm font-medium text-blue-800'>
								Total Activities
							</span>
						</div>
						<p className='text-2xl font-bold text-blue-900 mt-1'>
							{totalActivities.toLocaleString()}
						</p>
					</div>

					<div className='bg-green-50 rounded-lg p-4'>
						<div className='flex items-center space-x-2'>
							<Activity className='h-5 w-5 text-green-600' />
							<span className='text-sm font-medium text-green-800'>
								Daily Average
							</span>
						</div>
						<p className='text-2xl font-bold text-green-900 mt-1'>
							{averageActivities.toFixed(1)}
						</p>
					</div>

					<div className='bg-purple-50 rounded-lg p-4'>
						<div className='flex items-center space-x-2'>
							<Activity className='h-5 w-5 text-purple-600' />
							<span className='text-sm font-medium text-purple-800'>
								Peak Day
							</span>
						</div>
						<p className='text-2xl font-bold text-purple-900 mt-1'>
							{maxActivities.toLocaleString()}
						</p>
					</div>
				</div>

				{/* Activity Breakdown */}
				<div className='space-y-4'>
					<h4 className='font-medium text-gray-900'>
						Activity Breakdown
					</h4>

					<div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
						{ACTIVITY_TYPES.map((type) => {
							const total = data.reduce(
								(sum, d) =>
									sum +
									(d[
										type.key as keyof ActivityData
									] as number),
								0
							);
							const percentage =
								totalActivities > 0
									? (total / totalActivities) * 100
									: 0;
							const Icon = type.icon;

							return (
								<div key={type.key} className='text-center'>
									<div
										className={`w-12 h-12 ${type.color} rounded-lg flex items-center justify-center mx-auto mb-2`}
									>
										<Icon className='h-6 w-6 text-white' />
									</div>
									<p className='text-sm font-medium text-gray-900'>
										{total.toLocaleString()}
									</p>
									<p className='text-xs text-gray-600'>
										{type.label}
									</p>
									<p className='text-xs text-gray-500'>
										{percentage.toFixed(1)}%
									</p>
								</div>
							);
						})}
					</div>
				</div>

				{/* Chart */}
				<div className='space-y-4'>
					<div className='flex items-center justify-between'>
						<h4 className='font-medium text-gray-900'>
							Activity Over Time
						</h4>
						<span className='text-sm text-gray-500'>
							{data.length} data points
						</span>
					</div>

					{data.length > 0 ? (
						<div className='space-y-3'>
							{/* Chart Bars */}
							<div className='flex items-end space-x-1 h-64'>
								{data.map((item, index) => {
									const total = getTotalActivities(item);
									const height =
										maxActivities > 0
											? (total / maxActivities) * 100
											: 0;

									return (
										<div
											key={index}
											className='flex-1 flex flex-col items-center space-y-2'
										>
											<div
												className='w-full bg-gray-200 rounded-t'
												style={{ height: '200px' }}
											>
												<div className='relative w-full h-full'>
													{/* Stacked bars for each activity type */}
													{ACTIVITY_TYPES.map(
														(type, typeIndex) => {
															const value = item[
																type.key as keyof ActivityData
															] as number;
															const typeHeight =
																total > 0
																	? (value /
																			total) *
																	  height
																	: 0;
															const typeOffset =
																ACTIVITY_TYPES.slice(
																	0,
																	typeIndex
																).reduce(
																	(
																		offset,
																		prevType
																	) => {
																		const prevValue =
																			item[
																				prevType.key as keyof ActivityData
																			] as number;
																		return (
																			offset +
																			(total >
																			0
																				? (prevValue /
																						total) *
																				  height
																				: 0)
																		);
																	},
																	0
																);

															return (
																<div
																	key={
																		type.key
																	}
																	className={`absolute w-full ${type.color} transition-all duration-500 ease-out`}
																	style={{
																		height: `${typeHeight}%`,
																		bottom: `${typeOffset}%`,
																	}}
																/>
															);
														}
													)}
												</div>
											</div>
											<div className='text-xs text-gray-600 text-center'>
												<div className='font-medium'>
													{formatDate(item.date)}
												</div>
												<div className='text-blue-600'>
													{total}
												</div>
											</div>
										</div>
									);
								})}
							</div>

							{/* Chart Legend */}
							<div className='flex items-center justify-center space-x-4 text-xs text-gray-500'>
								{ACTIVITY_TYPES.map((type) => {
									const Icon = type.icon;
									return (
										<div
											key={type.key}
											className='flex items-center space-x-1'
										>
											<div
												className={`w-3 h-3 ${type.color} rounded`}
											></div>
											<Icon className='h-3 w-3' />
											<span>{type.label}</span>
										</div>
									);
								})}
							</div>
						</div>
					) : (
						<div className='text-center py-12'>
							<Activity className='h-12 w-12 text-gray-400 mx-auto mb-4' />
							<h4 className='text-lg font-medium text-gray-900 mb-2'>
								No Activity Data
							</h4>
							<p className='text-gray-500'>
								Start logging activities to see your outreach
								trends
							</p>
						</div>
					)}
				</div>

				{/* Insights */}
				{data.length > 1 && (
					<div className='bg-gray-50 rounded-lg p-4'>
						<h4 className='font-medium text-gray-900 mb-2'>
							Insights
						</h4>
						<div className='space-y-2 text-sm text-gray-600'>
							{(() => {
								const insights = [];

								// Find most active activity type
								const activityTotals = ACTIVITY_TYPES.map(
									(type) => ({
										type: type.label,
										total: data.reduce(
											(sum, d) =>
												sum +
												(d[
													type.key as keyof ActivityData
												] as number),
											0
										),
									})
								);
								const mostActive = activityTotals.reduce(
									(max, current) =>
										current.total > max.total
											? current
											: max
								);

								if (mostActive.total > 0) {
									insights.push(
										`Your most active outreach method is ${mostActive.type.toLowerCase()} (${
											mostActive.total
										} total)`
									);
								}

								// Check for trends
								const recentData = data.slice(-3);
								const olderData = data.slice(-6, -3);

								if (
									recentData.length > 0 &&
									olderData.length > 0
								) {
									const recentAvg =
										recentData.reduce(
											(sum, d) =>
												sum + getTotalActivities(d),
											0
										) / recentData.length;
									const olderAvg =
										olderData.reduce(
											(sum, d) =>
												sum + getTotalActivities(d),
											0
										) / olderData.length;
									const change =
										((recentAvg - olderAvg) / olderAvg) *
										100;

									if (Math.abs(change) > 10) {
										insights.push(
											`Activity volume has ${
												change > 0
													? 'increased'
													: 'decreased'
											} by ${Math.abs(change).toFixed(
												1
											)}% in recent periods`
										);
									}
								}

								return insights.length > 0
									? insights
									: [
											'Keep up the consistent outreach! Your activity levels look good.',
									  ];
							})().map((insight, index) => (
								<p
									key={index}
									className='flex items-start space-x-2'
								>
									<span className='text-blue-500 mt-0.5'>
										•
									</span>
									<span>{insight}</span>
								</p>
							))}
						</div>
					</div>
				)}
			</div>
		</Card>
	);
}
