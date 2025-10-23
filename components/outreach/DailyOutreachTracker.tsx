'use client';

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Mail, MessageSquare, TrendingUp } from 'lucide-react';

interface DailyGoal {
	id: string;
	date: string;
	emailsGoal: number;
	linkedinGoal: number;
	emailsSent: number;
	linkedinSent: number;
}

export function DailyOutreachTracker() {
	const [dailyGoal, setDailyGoal] = useState<DailyGoal | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		fetchDailyGoal();
	}, []);

	const fetchDailyGoal = async () => {
		try {
			const response = await fetch('/api/daily-goals/today');
			if (response.ok) {
				const data = await response.json();
				setDailyGoal(data);
			}
		} catch (error) {
			console.error('Error fetching daily goal:', error);
		} finally {
			setIsLoading(false);
		}
	};

	const getProgressColor = (current: number, goal: number) => {
		const percentage = (current / goal) * 100;
		if (percentage < 50) return 'text-red-600 bg-red-100';
		if (percentage < 80) return 'text-yellow-600 bg-yellow-100';
		return 'text-green-600 bg-green-100';
	};

	const getProgressBarColor = (current: number, goal: number) => {
		const percentage = (current / goal) * 100;
		if (percentage < 50) return 'bg-red-500';
		if (percentage < 80) return 'bg-yellow-500';
		return 'bg-green-500';
	};

	if (isLoading) {
		return (
			<Card className='p-6'>
				<div className='animate-pulse space-y-4'>
					<div className='h-4 bg-gray-200 rounded w-1/2'></div>
					<div className='h-8 bg-gray-200 rounded'></div>
					<div className='h-8 bg-gray-200 rounded'></div>
				</div>
			</Card>
		);
	}

	const emailsGoal = dailyGoal?.emailsGoal || 8;
	const linkedinGoal = dailyGoal?.linkedinGoal || 8;
	const emailsSent = dailyGoal?.emailsSent || 0;
	const linkedinSent = dailyGoal?.linkedinSent || 0;

	const emailPercentage = (emailsSent / emailsGoal) * 100;
	const linkedinPercentage = (linkedinSent / linkedinGoal) * 100;

	return (
		<Card className='p-6'>
			<div className='flex items-center justify-between mb-4'>
				<h3 className='text-lg font-semibold text-gray-900 flex items-center'>
					<TrendingUp className='h-5 w-5 mr-2 text-blue-600' />
					Daily Outreach
				</h3>
				<span className='text-sm text-gray-500'>
					{new Date().toLocaleDateString('en-US', {
						month: 'short',
						day: 'numeric',
					})}
				</span>
			</div>

			<div className='space-y-4'>
				{/* Email Progress */}
				<div>
					<div className='flex items-center justify-between mb-2'>
						<div className='flex items-center space-x-2'>
							<Mail className='h-4 w-4 text-blue-600' />
							<span className='text-sm font-medium text-gray-700'>
								Emails
							</span>
						</div>
						<span
							className={`text-sm font-semibold px-3 py-1 rounded-full ${getProgressColor(
								emailsSent,
								emailsGoal
							)}`}
						>
							{emailsSent}/{emailsGoal}
						</span>
					</div>
					<div className='w-full bg-gray-200 rounded-full h-2'>
						<div
							className={`h-2 rounded-full transition-all duration-500 ${getProgressBarColor(
								emailsSent,
								emailsGoal
							)}`}
							style={{
								width: `${Math.min(emailPercentage, 100)}%`,
							}}
						></div>
					</div>
					<p className='text-xs text-gray-500 mt-1'>
						{emailPercentage >= 100
							? '🎉 Goal reached!'
							: `${Math.max(
									0,
									emailsGoal - emailsSent
							  )} more to reach goal`}
					</p>
				</div>

				{/* LinkedIn Progress */}
				<div>
					<div className='flex items-center justify-between mb-2'>
						<div className='flex items-center space-x-2'>
							<MessageSquare className='h-4 w-4 text-indigo-600' />
							<span className='text-sm font-medium text-gray-700'>
								LinkedIn Messages
							</span>
						</div>
						<span
							className={`text-sm font-semibold px-3 py-1 rounded-full ${getProgressColor(
								linkedinSent,
								linkedinGoal
							)}`}
						>
							{linkedinSent}/{linkedinGoal}
						</span>
					</div>
					<div className='w-full bg-gray-200 rounded-full h-2'>
						<div
							className={`h-2 rounded-full transition-all duration-500 ${getProgressBarColor(
								linkedinSent,
								linkedinGoal
							)}`}
							style={{
								width: `${Math.min(linkedinPercentage, 100)}%`,
							}}
						></div>
					</div>
					<p className='text-xs text-gray-500 mt-1'>
						{linkedinPercentage >= 100
							? '🎉 Goal reached!'
							: `${Math.max(
									0,
									linkedinGoal - linkedinSent
							  )} more to reach goal`}
					</p>
				</div>

				{/* Overall Summary */}
				<div className='pt-3 border-t border-gray-200'>
					<div className='flex items-center justify-between text-sm'>
						<span className='text-gray-600'>Total Outreach</span>
						<span className='font-semibold text-gray-900'>
							{emailsSent + linkedinSent}/
							{emailsGoal + linkedinGoal}
						</span>
					</div>
				</div>
			</div>
		</Card>
	);
}
