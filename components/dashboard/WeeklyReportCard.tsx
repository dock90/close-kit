import React from 'react';
import { Card } from '@/components/ui/card';
import {
	Mail,
	MessageSquare,
	Phone,
	Calendar,
	FileText,
	TrendingUp,
} from 'lucide-react';

interface WeeklyReport {
	id: string;
	weekStartDate: Date;
	weekEndDate: Date;
	emailsSent: number;
	linkedinMessages: number;
	callsBooked: number;
	proposalsSent: number;
	dealsClosed: number;
	revenueGenerated: number;
	roadblocks?: string;
}

interface WeeklyReportCardProps {
	report: WeeklyReport;
	previousWeek?: WeeklyReport;
}

export function WeeklyReportCard({
	report,
	previousWeek,
}: WeeklyReportCardProps) {
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

	const getWeekRange = () => {
		return `${formatDate(report.weekStartDate)} - ${formatDate(
			report.weekEndDate
		)}`;
	};

	const calculateChange = (current: number, previous?: number) => {
		if (!previous || previous === 0) return null;
		const change = ((current - previous) / previous) * 100;
		return {
			value: Math.abs(change),
			type: change >= 0 ? 'increase' : 'decrease',
		};
	};

	const metrics = [
		{
			label: 'Emails Sent',
			value: report.emailsSent,
			icon: Mail,
			previous: previousWeek?.emailsSent,
		},
		{
			label: 'LinkedIn Messages',
			value: report.linkedinMessages,
			icon: MessageSquare,
			previous: previousWeek?.linkedinMessages,
		},
		{
			label: 'Calls Booked',
			value: report.callsBooked,
			icon: Phone,
			previous: previousWeek?.callsBooked,
		},
		{
			label: 'Proposals Sent',
			value: report.proposalsSent,
			icon: FileText,
			previous: previousWeek?.proposalsSent,
		},
		{
			label: 'Deals Closed',
			value: report.dealsClosed,
			icon: TrendingUp,
			previous: previousWeek?.dealsClosed,
		},
	];

	const revenueChange = calculateChange(
		report.revenueGenerated,
		previousWeek?.revenueGenerated
	);

	return (
		<Card className='p-6'>
			<div className='space-y-6'>
				<div className='flex items-center justify-between'>
					<div>
						<h3 className='text-lg font-semibold text-gray-900'>
							Weekly Report
						</h3>
						<p className='text-sm text-gray-500'>
							{getWeekRange()}
						</p>
					</div>
					<div className='text-right'>
						<p className='text-2xl font-bold text-gray-900'>
							{formatCurrency(report.revenueGenerated)}
						</p>
						{revenueChange && (
							<div
								className={`text-sm flex items-center ${
									revenueChange.type === 'increase'
										? 'text-green-600'
										: 'text-red-600'
								}`}
							>
								<TrendingUp className='h-4 w-4 mr-1' />
								{revenueChange.value.toFixed(1)}% vs last week
							</div>
						)}
					</div>
				</div>

				<div className='grid grid-cols-2 md:grid-cols-5 gap-4'>
					{metrics.map((metric) => {
						const change = calculateChange(
							metric.value,
							metric.previous
						);
						const Icon = metric.icon;

						return (
							<div key={metric.label} className='text-center'>
								<div className='flex items-center justify-center mb-2'>
									<Icon className='h-5 w-5 text-gray-400' />
								</div>
								<p className='text-lg font-semibold text-gray-900'>
									{metric.value}
								</p>
								<p className='text-xs text-gray-500'>
									{metric.label}
								</p>
								{change && (
									<p
										className={`text-xs mt-1 ${
											change.type === 'increase'
												? 'text-green-600'
												: 'text-red-600'
										}`}
									>
										{change.type === 'increase' ? '+' : '-'}
										{change.value.toFixed(1)}%
									</p>
								)}
							</div>
						);
					})}
				</div>

				{report.roadblocks && (
					<div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4'>
						<h4 className='text-sm font-medium text-yellow-800 mb-2'>
							Roadblocks
						</h4>
						<p className='text-sm text-yellow-700'>
							{report.roadblocks}
						</p>
					</div>
				)}
			</div>
		</Card>
	);
}
