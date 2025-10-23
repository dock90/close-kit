import React from 'react';
import { Card } from '@/components/ui/card';
import {
	Mail,
	MessageSquare,
	Phone,
	Calendar,
	Clock,
	CheckCircle,
	AlertCircle,
} from 'lucide-react';

interface Task {
	id: string;
	type: string;
	subject?: string;
	notes?: string;
	scheduledDate: Date;
	status: string;
	company?: {
		name: string;
	};
	contact?: {
		firstName: string;
		lastName: string;
	};
	deal?: {
		name: string;
	};
}

interface UpcomingTasksProps {
	tasks: Task[];
	limit?: number;
}

const TASK_ICONS = {
	email_sent: Mail,
	linkedin_request: MessageSquare,
	linkedin_message: MessageSquare,
	call: Phone,
	meeting: Calendar,
	proposal_sent: Mail,
	follow_up: Clock,
	note: MessageSquare,
};

const TASK_COLORS = {
	email_sent: 'text-blue-600 bg-blue-100',
	linkedin_request: 'text-purple-600 bg-purple-100',
	linkedin_message: 'text-purple-600 bg-purple-100',
	call: 'text-green-600 bg-green-100',
	meeting: 'text-orange-600 bg-orange-100',
	proposal_sent: 'text-red-600 bg-red-100',
	follow_up: 'text-yellow-600 bg-yellow-100',
	note: 'text-gray-600 bg-gray-100',
};

export function UpcomingTasks({ tasks, limit = 5 }: UpcomingTasksProps) {
	const formatDate = (date: Date) => {
		const now = new Date();
		const diffTime = date.getTime() - now.getTime();
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

		if (diffDays === 0) return 'Today';
		if (diffDays === 1) return 'Tomorrow';
		if (diffDays < 7) return `In ${diffDays} days`;

		return new Intl.DateTimeFormat('en-US', {
			month: 'short',
			day: 'numeric',
		}).format(date);
	};

	const formatTime = (date: Date) => {
		return new Intl.DateTimeFormat('en-US', {
			hour: 'numeric',
			minute: '2-digit',
		}).format(date);
	};

	const formatTaskType = (type: string) => {
		return type
			.split('_')
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');
	};

	const getTaskIcon = (type: string) => {
		const Icon = TASK_ICONS[type as keyof typeof TASK_ICONS] || Clock;
		return Icon;
	};

	const getTaskColor = (type: string) => {
		return (
			TASK_COLORS[type as keyof typeof TASK_COLORS] ||
			'text-gray-600 bg-gray-100'
		);
	};

	const getPriority = (date: Date) => {
		const now = new Date();
		const diffTime = date.getTime() - now.getTime();
		const diffHours = diffTime / (1000 * 60 * 60);

		if (diffHours < 2) return 'urgent';
		if (diffHours < 24) return 'high';
		return 'normal';
	};

	const sortedTasks = tasks
		.filter((task) => task.status === 'scheduled')
		.sort((a, b) => a.scheduledDate.getTime() - b.scheduledDate.getTime())
		.slice(0, limit);

	const getPriorityColor = (priority: string) => {
		switch (priority) {
			case 'urgent':
				return 'border-red-200 bg-red-50';
			case 'high':
				return 'border-orange-200 bg-orange-50';
			default:
				return 'border-gray-200 bg-white';
		}
	};

	return (
		<Card className='p-6'>
			<div className='space-y-4'>
				<div className='flex items-center justify-between'>
					<h3 className='text-lg font-semibold text-gray-900'>
						Upcoming Tasks
					</h3>
					<span className='text-sm text-gray-500'>
						{tasks.filter((t) => t.status === 'scheduled').length}{' '}
						scheduled
					</span>
				</div>

				<div className='space-y-3'>
					{sortedTasks.map((task) => {
						const Icon = getTaskIcon(task.type);
						const colorClass = getTaskColor(task.type);
						const priority = getPriority(task.scheduledDate);
						const priorityColor = getPriorityColor(priority);

						return (
							<div
								key={task.id}
								className={`border rounded-lg p-4 ${priorityColor} hover:shadow-sm transition-shadow cursor-pointer`}
							>
								<div className='flex items-start space-x-3'>
									<div
										className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${colorClass}`}
									>
										<Icon className='h-4 w-4' />
									</div>

									<div className='flex-1 min-w-0'>
										<div className='flex items-center justify-between'>
											<div className='flex items-center space-x-2'>
												<p className='text-sm font-medium text-gray-900'>
													{formatTaskType(task.type)}
												</p>
												{priority === 'urgent' && (
													<AlertCircle className='h-4 w-4 text-red-500' />
												)}
											</div>
											<div className='text-right text-xs text-gray-500'>
												<p>
													{formatDate(
														task.scheduledDate
													)}
												</p>
												<p>
													{formatTime(
														task.scheduledDate
													)}
												</p>
											</div>
										</div>

										{task.subject && (
											<p className='text-sm text-gray-700 mt-1'>
												{task.subject}
											</p>
										)}

										{task.notes && (
											<p className='text-xs text-gray-600 mt-1 line-clamp-2'>
												{task.notes}
											</p>
										)}

										<div className='flex items-center space-x-4 mt-2 text-xs text-gray-500'>
											{task.company && (
												<span>{task.company.name}</span>
											)}
											{task.contact && (
												<span>
													{task.contact.firstName}{' '}
													{task.contact.lastName}
												</span>
											)}
											{task.deal && (
												<span>
													Deal: {task.deal.name}
												</span>
											)}
										</div>
									</div>
								</div>
							</div>
						);
					})}

					{sortedTasks.length === 0 && (
						<div className='text-center text-gray-400 py-8'>
							<Clock className='h-8 w-8 mx-auto mb-2' />
							<p className='text-sm'>No upcoming tasks</p>
						</div>
					)}
				</div>
			</div>
		</Card>
	);
}
