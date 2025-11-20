'use client';

import { useEffect, useState } from 'react';
import { MetricsCard } from './MetricsCard';
import {
	DollarSign,
	BarChart3,
	Calendar,
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
			<div>
				<div className='mb-4'>
					<div className='h-6 bg-gray-200 rounded w-48 animate-pulse mb-2'></div>
					<div className='h-4 bg-gray-200 rounded w-64 animate-pulse'></div>
				</div>
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
					{[...Array(4)].map((_, i) => (
						<div
							key={i}
							className='bg-white border border-gray-200 rounded-lg p-6 animate-pulse'
						>
							<div className='flex items-center justify-between mb-4'>
								<div className='flex-1'>
									<div className='h-4 bg-gray-200 rounded w-24 mb-2'></div>
									<div className='h-8 bg-gray-200 rounded w-16'></div>
								</div>
								<div className='w-12 h-12 bg-gray-200 rounded-full'></div>
							</div>
							<div className='h-3 bg-gray-200 rounded w-32'></div>
						</div>
					))}
				</div>
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
		}).format(value);
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
					title='Pipeline Value'
					value={formatCurrency(metrics.pipelineValue)}
					icon={DollarSign}
					description='Total value of active deals'
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
			</div>
		</div>
	);
}
