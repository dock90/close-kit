'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Mail, MessageSquare, Phone, FileText } from 'lucide-react';

interface WeekMetricsProps {
	emailsSent: number;
	linkedinMessages: number;
	calls: number;
	proposals: number;
}

export function WeekMetrics({
	emailsSent,
	linkedinMessages,
	calls,
	proposals,
}: WeekMetricsProps) {
	const metrics = [
		{
			label: 'Emails',
			value: emailsSent,
			icon: Mail,
			color: 'text-blue-600 bg-blue-100',
		},
		{
			label: 'LinkedIn',
			value: linkedinMessages,
			icon: MessageSquare,
			color: 'text-purple-600 bg-purple-100',
		},
		{
			label: 'Calls',
			value: calls,
			icon: Phone,
			color: 'text-green-600 bg-green-100',
		},
		{
			label: 'Proposals',
			value: proposals,
			icon: FileText,
			color: 'text-orange-600 bg-orange-100',
		},
	];

	return (
		<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
			{metrics.map((metric) => {
				const Icon = metric.icon;
				return (
					<Card key={metric.label} className='p-6'>
						<div className='flex items-center justify-between'>
							<div>
								<p className='text-sm font-medium text-gray-600'>
									{metric.label}
								</p>
								<p className='text-3xl font-bold text-gray-900 mt-2'>
									{metric.value}
								</p>
								<p className='text-xs text-gray-500 mt-1'>
									This week
								</p>
							</div>
							<div
								className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${metric.color}`}
							>
								<Icon className='h-6 w-6' />
							</div>
						</div>
					</Card>
				);
			})}
		</div>
	);
}
