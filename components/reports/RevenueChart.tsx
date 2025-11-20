import React from 'react';
import { Card } from '@/components/ui/card';
import { TrendingUp, DollarSign } from 'lucide-react';

interface RevenueData {
	date: string;
	revenue: number;
}

interface RevenueChartProps {
	data: RevenueData[];
	period?: 'week' | 'month' | 'quarter' | 'year';
	onPeriodChange?: (period: 'week' | 'month' | 'quarter' | 'year') => void;
}

export function RevenueChart({
	data,
	period = 'month',
	onPeriodChange,
}: RevenueChartProps) {
	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			minimumFractionDigits: 0,
			maximumFractionDigits: 0,
		}).format(amount);
	};

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

	const maxRevenue = Math.max(...data.map((d) => d.revenue));
	const totalRevenue = data.reduce((sum, d) => sum + d.revenue, 0);
	const averageRevenue = data.length > 0 ? totalRevenue / data.length : 0;

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
						<TrendingUp className='h-6 w-6 text-green-600' />
						<h3 className='text-lg font-semibold text-gray-900'>
							Revenue Trend
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
					<div className='bg-green-50 rounded-lg p-4'>
						<div className='flex items-center space-x-2'>
							<DollarSign className='h-5 w-5 text-green-600' />
							<span className='text-sm font-medium text-green-800'>
								Total Revenue
							</span>
						</div>
						<p className='text-2xl font-bold text-green-900 mt-1'>
							{formatCurrency(totalRevenue)}
						</p>
					</div>

					<div className='bg-blue-50 rounded-lg p-4'>
						<div className='flex items-center space-x-2'>
							<TrendingUp className='h-5 w-5 text-blue-600' />
							<span className='text-sm font-medium text-blue-800'>
								Average
							</span>
						</div>
						<p className='text-2xl font-bold text-blue-900 mt-1'>
							{formatCurrency(averageRevenue)}
						</p>
					</div>

					<div className='bg-purple-50 rounded-lg p-4'>
						<div className='flex items-center space-x-2'>
							<TrendingUp className='h-5 w-5 text-purple-600' />
							<span className='text-sm font-medium text-purple-800'>
								Peak
							</span>
						</div>
						<p className='text-2xl font-bold text-purple-900 mt-1'>
							{formatCurrency(maxRevenue)}
						</p>
					</div>
				</div>

				{/* Chart */}
				<div className='space-y-4'>
					<div className='flex items-center justify-between'>
						<h4 className='font-medium text-gray-900'>
							Revenue Over Time
						</h4>
						<span className='text-sm text-gray-500'>
							{data.length} data points
						</span>
					</div>

					{data.length > 0 ? (
						<div className='space-y-3'>
							{/* Chart Bars */}
							<div className='flex items-end space-x-2 h-64'>
								{data.map((item, index) => {
									const height =
										maxRevenue > 0
											? (item.revenue / maxRevenue) * 100
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
												<div
													className='w-full bg-gradient-to-t from-green-500 to-green-400 rounded-t transition-all duration-500 ease-out'
													style={{
														height: `${height}%`,
													}}
												/>
											</div>
											<div className='text-xs text-gray-600 text-center'>
												<div className='font-medium'>
													{formatDate(item.date)}
												</div>
												<div className='text-green-600'>
													{formatCurrency(
														item.revenue
													)}
												</div>
											</div>
										</div>
									);
								})}
							</div>

							{/* Chart Legend */}
							<div className='flex items-center justify-center space-x-4 text-xs text-gray-500'>
								<div className='flex items-center space-x-1'>
									<div className='w-3 h-3 bg-green-500 rounded'></div>
									<span>Revenue</span>
								</div>
							</div>
						</div>
					) : (
						<div className='text-center py-12'>
							<TrendingUp className='h-12 w-12 text-gray-400 mx-auto mb-4' />
							<h4 className='text-lg font-medium text-gray-900 mb-2'>
								No Revenue Data
							</h4>
							<p className='text-gray-500'>
								Start logging deals to see your revenue trends
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
								const recentData = data.slice(-3);
								const olderData = data.slice(-6, -3);

								if (
									recentData.length > 0 &&
									olderData.length > 0
								) {
									const recentAvg =
										recentData.reduce(
											(sum, d) => sum + d.revenue,
											0
										) / recentData.length;
									const olderAvg =
										olderData.reduce(
											(sum, d) => sum + d.revenue,
											0
										) / olderData.length;
									const change =
										((recentAvg - olderAvg) / olderAvg) *
										100;

									if (Math.abs(change) > 10) {
										insights.push(
											`Revenue has ${
												change > 0
													? 'increased'
													: 'decreased'
											} by ${Math.abs(change).toFixed(
												1
											)}% in recent periods`
										);
									}
								}

								const bestPeriod = data.reduce(
									(max, d) =>
										d.revenue > max.revenue ? d : max,
									data[0]
								);
								if (bestPeriod) {
									insights.push(
										`Best performing period: ${formatDate(
											bestPeriod.date
										)} with ${formatCurrency(
											bestPeriod.revenue
										)}`
									);
								}

								return insights.length > 0
									? insights
									: [
											'Keep up the great work! Your revenue trends look positive.',
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
