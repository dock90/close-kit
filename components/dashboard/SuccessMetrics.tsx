'use client';

import { useEffect, useState } from 'react';
import { MetricsCard } from './MetricsCard';
import {
	TrendingUp,
	Target,
	DollarSign,
	BarChart3,
	Calendar,
	Zap,
	Percent,
} from 'lucide-react';

interface SuccessMetricsData {
	outreachVolume: number;
	pipelineValue: number;
	weightedPipeline: number;
	conversionRate: number;
	averageDealSize: number;
	averageDaysToClose: number;
	activityStreak: number;
}

export function SuccessMetrics() {
	const [metrics, setMetrics] = useState<SuccessMetricsData | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetchMetrics() {
			try {
				const response = await fetch('/api/metrics/success');
				if (response.ok) {
					const data = await response.json();
					setMetrics(data);
				}
			} catch (error) {
				console.error('Error fetching success metrics:', error);
			} finally {
				setLoading(false);
			}
		}

		fetchMetrics();
	}, []);

	if (loading) {
		return (
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
				{[...Array(7)].map((_, i) => (
					<div
						key={i}
						className='h-32 bg-gray-100 rounded-lg animate-pulse'
					/>
				))}
			</div>
		);
	}

	if (!metrics) {
		return null;
	}

	const formatCurrency = (value: number) => {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			minimumFractionDigits: 0,
			maximumFractionDigits: 0,
		}).format(value / 100);
	};

	return (
		<div>
			<div className='mb-4'>
				<h2 className='text-xl font-semibold text-gray-900'>
					Success Metrics
				</h2>
				<p className='text-sm text-gray-600'>
					Track your key performance indicators
				</p>
			</div>
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
				<MetricsCard
					title='Outreach Volume'
					value={metrics.outreachVolume}
					icon={TrendingUp}
					description='Emails + LinkedIn messages this week'
				/>
				<MetricsCard
					title='Pipeline Value'
					value={formatCurrency(metrics.pipelineValue)}
					icon={DollarSign}
					description='Total value of active deals'
				/>
				<MetricsCard
					title='Weighted Pipeline'
					value={formatCurrency(metrics.weightedPipeline)}
					icon={Target}
					description='Pipeline × probability'
				/>
				<MetricsCard
					title='Conversion Rate'
					value={`${metrics.conversionRate}%`}
					icon={Percent}
					description='Proposals → Closed deals'
				/>
				<MetricsCard
					title='Avg Deal Size'
					value={formatCurrency(metrics.averageDealSize)}
					icon={BarChart3}
					description='Average revenue per deal'
				/>
				<MetricsCard
					title='Days to Close'
					value={metrics.averageDaysToClose}
					icon={Calendar}
					description='Average time from lead to close'
				/>
				<MetricsCard
					title='Activity Streak'
					value={`${metrics.activityStreak} days`}
					icon={Zap}
					description='Consecutive days of 6+ actions'
				/>
			</div>
		</div>
	);
}
