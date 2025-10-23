'use client';

import React, { useState, useEffect } from 'react';
import { Bell, X, Check, Clock, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface Reminder {
	id: string;
	type: string;
	title: string;
	description?: string;
	dueDate: string;
	status: string;
	priority: string;
	contact?: {
		firstName: string;
		lastName: string;
	};
	deal?: {
		name: string;
	};
	activity?: {
		type: string;
		subject?: string;
	};
}

export function ReminderBell() {
	const [reminders, setReminders] = useState<Reminder[]>([]);
	const [isOpen, setIsOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		fetchReminders();
		// Refresh reminders every minute
		const interval = setInterval(fetchReminders, 60000);
		return () => clearInterval(interval);
	}, []);

	const fetchReminders = async () => {
		try {
			const response = await fetch('/api/reminders?status=active');
			if (response.ok) {
				const data = await response.json();
				setReminders(data);
			}
		} catch (error) {
			console.error('Error fetching reminders:', error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleDismiss = async (id: string) => {
		try {
			const response = await fetch(`/api/reminders/${id}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ status: 'dismissed' }),
			});

			if (response.ok) {
				setReminders((prev) => prev.filter((r) => r.id !== id));
			}
		} catch (error) {
			console.error('Error dismissing reminder:', error);
		}
	};

	const handleComplete = async (id: string) => {
		try {
			const response = await fetch(`/api/reminders/${id}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ status: 'completed' }),
			});

			if (response.ok) {
				setReminders((prev) => prev.filter((r) => r.id !== id));
			}
		} catch (error) {
			console.error('Error completing reminder:', error);
		}
	};

	const getPriorityColor = (priority: string) => {
		switch (priority) {
			case 'high':
				return 'text-red-600 bg-red-50';
			case 'medium':
				return 'text-yellow-600 bg-yellow-50';
			case 'low':
				return 'text-blue-600 bg-blue-50';
			default:
				return 'text-gray-600 bg-gray-50';
		}
	};

	const isOverdue = (dueDate: string) => {
		return new Date(dueDate) < new Date();
	};

	const formatDueDate = (dueDate: string) => {
		const date = new Date(dueDate);
		const now = new Date();
		const diffMs = date.getTime() - now.getTime();
		const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
		const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

		if (diffDays < 0) {
			return `Overdue by ${Math.abs(diffDays)} days`;
		} else if (diffDays === 0) {
			if (diffHours < 0) {
				return `Overdue by ${Math.abs(diffHours)} hours`;
			} else if (diffHours === 0) {
				return 'Due now';
			} else {
				return `Due in ${diffHours} hours`;
			}
		} else if (diffDays === 1) {
			return 'Due tomorrow';
		} else {
			return `Due in ${diffDays} days`;
		}
	};

	const activeCount = reminders.filter((r) => r.status === 'active').length;

	return (
		<div className='relative'>
			{/* Bell Icon Button */}
			<button
				onClick={() => setIsOpen(!isOpen)}
				className='relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors'
			>
				<Bell className='h-6 w-6' />
				{activeCount > 0 && (
					<span className='absolute top-0 right-0 h-5 w-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center'>
						{activeCount > 9 ? '9+' : activeCount}
					</span>
				)}
			</button>

			{/* Reminders Dropdown */}
			{isOpen && (
				<>
					{/* Backdrop */}
					<div
						className='fixed inset-0 z-40'
						onClick={() => setIsOpen(false)}
					/>

					{/* Dropdown Panel */}
					<div className='absolute right-0 mt-2 w-96 max-h-[600px] overflow-hidden z-50 shadow-xl rounded-lg'>
						<Card className='p-0'>
							<div className='p-4 border-b border-gray-200 bg-white'>
								<div className='flex items-center justify-between'>
									<h3 className='text-lg font-semibold text-gray-900'>
										Follow-Up Reminders
									</h3>
									<button
										onClick={() => setIsOpen(false)}
										className='text-gray-400 hover:text-gray-600'
									>
										<X className='h-5 w-5' />
									</button>
								</div>
								{activeCount > 0 && (
									<p className='text-sm text-gray-500 mt-1'>
										{activeCount} active reminder
										{activeCount !== 1 ? 's' : ''}
									</p>
								)}
							</div>

							<div className='max-h-[500px] overflow-y-auto bg-gray-50'>
								{isLoading ? (
									<div className='p-4 space-y-3'>
										{[1, 2, 3].map((i) => (
											<div
												key={i}
												className='animate-pulse bg-white p-4 rounded-lg'
											>
												<div className='h-4 bg-gray-200 rounded w-3/4 mb-2'></div>
												<div className='h-3 bg-gray-200 rounded w-1/2'></div>
											</div>
										))}
									</div>
								) : reminders.length === 0 ? (
									<div className='p-8 text-center'>
										<Clock className='h-12 w-12 text-gray-300 mx-auto mb-3' />
										<p className='text-gray-500'>
											No active reminders
										</p>
										<p className='text-sm text-gray-400 mt-1'>
											You're all caught up!
										</p>
									</div>
								) : (
									<div className='p-2 space-y-2'>
										{reminders.map((reminder) => (
											<div
												key={reminder.id}
												className={`bg-white p-4 rounded-lg border-l-4 ${
													isOverdue(reminder.dueDate)
														? 'border-red-500'
														: reminder.priority ===
														  'high'
														? 'border-orange-500'
														: 'border-blue-500'
												}`}
											>
												<div className='flex items-start justify-between mb-2'>
													<div className='flex-1'>
														<h4 className='text-sm font-semibold text-gray-900 mb-1'>
															{reminder.title}
														</h4>
														{reminder.description && (
															<p className='text-xs text-gray-600 mb-2'>
																{
																	reminder.description
																}
															</p>
														)}
													</div>
													<span
														className={`text-xs px-2 py-1 rounded-full ml-2 ${getPriorityColor(
															reminder.priority
														)}`}
													>
														{reminder.priority}
													</span>
												</div>

												{/* Associated Entity */}
												{(reminder.contact ||
													reminder.deal) && (
													<div className='text-xs text-gray-500 mb-2'>
														{reminder.contact && (
															<span>
																Contact:{' '}
																{
																	reminder
																		.contact
																		.firstName
																}{' '}
																{
																	reminder
																		.contact
																		.lastName
																}
															</span>
														)}
														{reminder.deal && (
															<span className='ml-2'>
																Deal:{' '}
																{
																	reminder
																		.deal
																		.name
																}
															</span>
														)}
													</div>
												)}

												{/* Due Date */}
												<div
													className={`flex items-center text-xs mb-3 ${
														isOverdue(
															reminder.dueDate
														)
															? 'text-red-600'
															: 'text-gray-500'
													}`}
												>
													{isOverdue(
														reminder.dueDate
													) ? (
														<AlertCircle className='h-3 w-3 mr-1' />
													) : (
														<Clock className='h-3 w-3 mr-1' />
													)}
													{formatDueDate(
														reminder.dueDate
													)}
												</div>

												{/* Actions */}
												<div className='flex items-center space-x-2'>
													<button
														onClick={() =>
															handleComplete(
																reminder.id
															)
														}
														className='flex items-center space-x-1 text-xs text-green-600 hover:text-green-700 hover:bg-green-50 px-3 py-1 rounded transition-colors'
													>
														<Check className='h-3 w-3' />
														<span>Complete</span>
													</button>
													<button
														onClick={() =>
															handleDismiss(
																reminder.id
															)
														}
														className='flex items-center space-x-1 text-xs text-gray-600 hover:text-gray-700 hover:bg-gray-100 px-3 py-1 rounded transition-colors'
													>
														<X className='h-3 w-3' />
														<span>Dismiss</span>
													</button>
												</div>
											</div>
										))}
									</div>
								)}
							</div>
						</Card>
					</div>
				</>
			)}
		</div>
	);
}
