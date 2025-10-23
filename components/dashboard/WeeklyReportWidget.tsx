'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { FileText, X } from 'lucide-react';
import Link from 'next/link';

interface WeeklyReportWidgetProps {
	hasReportForCurrentWeek: boolean;
}

export function WeeklyReportWidget({
	hasReportForCurrentWeek,
}: WeeklyReportWidgetProps) {
	const [isVisible, setIsVisible] = useState(false);
	const [isDismissed, setIsDismissed] = useState(false);

	useEffect(() => {
		const today = new Date().getDay();
		const isFriday = today === 5;
		
		const dismissed = localStorage.getItem('weeklyReportDismissed');
		const dismissedDate = dismissed ? new Date(dismissed) : null;
		const isStillDismissed =
			dismissedDate &&
			new Date().toDateString() === dismissedDate.toDateString();

		if (isFriday && !hasReportForCurrentWeek && !isStillDismissed) {
			setIsVisible(true);
		}
	}, [hasReportForCurrentWeek]);

	const handleDismiss = () => {
		setIsDismissed(true);
		setIsVisible(false);
		localStorage.setItem(
			'weeklyReportDismissed',
			new Date().toISOString()
		);
	};

	if (!isVisible || isDismissed) {
		return null;
	}

	return (
		<div className='fixed bottom-6 right-6 z-50 animate-slide-up'>
			<Card className='w-80 p-6 shadow-2xl border-2 border-indigo-500 bg-gradient-to-br from-indigo-50 to-white'>
				<button
					onClick={handleDismiss}
					className='absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors'
				>
					<X className='h-4 w-4' />
				</button>

				<div className='flex items-start space-x-4'>
					<div className='flex-shrink-0 w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center'>
						<FileText className='h-6 w-6 text-white' />
					</div>

					<div className='flex-1'>
						<h3 className='text-lg font-semibold text-gray-900 mb-2'>
							Complete Your Weekly Report
						</h3>
						<p className='text-sm text-gray-600 mb-4'>
							It's Friday! Time to reflect on your week and complete
							your weekly report.
						</p>
						<Link
							href='/dashboard/reports'
							className='inline-flex items-center justify-center w-full px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors'
						>
							Complete Report
						</Link>
					</div>
				</div>
			</Card>
		</div>
	);
}
