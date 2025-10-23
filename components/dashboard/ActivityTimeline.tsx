import React from 'react';
import { Card } from '@/components/ui/card';
import {
	Mail,
	MessageSquare,
	Phone,
	Calendar,
	FileText,
	Clock,
	CheckCircle,
	XCircle,
} from 'lucide-react';

interface Activity {
	id: string;
	type: string;
	subject?: string;
	notes?: string;
	scheduledDate?: string;
	completedDate?: string;
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

interface ActivityTimelineProps {
	activities: Activity[];
	limit?: number;
}

const ACTIVITY_ICONS = {
	email_sent: Mail,
	linkedin_request: MessageSquare,
	linkedin_message: MessageSquare,
	call: Phone,
	meeting: Calendar,
	proposal_sent: FileText,
	follow_up: Clock,
	note: FileText,
};

const ACTIVITY_COLORS = {
	email_sent: 'text-blue-600 bg-blue-100',
	linkedin_request: 'text-purple-600 bg-purple-100',
	linkedin_message: 'text-purple-600 bg-purple-100',
	call: 'text-green-600 bg-green-100',
	meeting: 'text-orange-600 bg-orange-100',
	proposal_sent: 'text-red-600 bg-red-100',
	follow_up: 'text-yellow-600 bg-yellow-100',
	note: 'text-gray-600 bg-gray-100',
};

export function ActivityTimeline({ activities, limit = 10 }: ActivityTimelineProps) {
	const formatDate = (date: Date) => {
		return new Intl.DateTimeFormat('en-US', {
			month: 'short',
			day: 'numeric',
			hour: 'numeric',
			minute: '2-digit',
		}).format(date);
	};

	const formatActivityType = (type: string) => {
		return type
			.split('_')
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');
	};

	const getActivityIcon = (type: string) => {
		const Icon =
			ACTIVITY_ICONS[type as keyof typeof ACTIVITY_ICONS] || FileText;
		return Icon;
	};

	const getActivityColor = (type: string) => {
		return (
			ACTIVITY_COLORS[type as keyof typeof ACTIVITY_COLORS] ||
			'text-gray-600 bg-gray-100'
		);
	};

	const getStatusIcon = (status: string) => {
		switch (status) {
			case 'completed':
				return <CheckCircle className='h-4 w-4 text-green-500' />;
			case 'cancelled':
				return <XCircle className='h-4 w-4 text-red-500' />;
			default:
				return <Clock className='h-4 w-4 text-yellow-500' />;
		}
	};

	const sortedActivities = activities
		.sort((a, b) => {
			const dateA = a.completedDate
				? new Date(a.completedDate)
				: a.scheduledDate
				? new Date(a.scheduledDate)
				: new Date(0);
			const dateB = b.completedDate
				? new Date(b.completedDate)
				: b.scheduledDate
				? new Date(b.scheduledDate)
				: new Date(0);
			return dateB.getTime() - dateA.getTime();
		})
		.slice(0, limit);

	return (
		<Card className='p-6'>
			<div className='space-y-4'>
				<div className='flex items-center justify-between'>
					<h3 className='text-lg font-semibold text-gray-900'>
						Recent Activity
					</h3>
					<span className='text-sm text-gray-500'>
						{activities.length} total
					</span>
				</div>

				<div className='space-y-4'>
					{sortedActivities.map((activity, index) => {
						const Icon = getActivityIcon(activity.type);
						const colorClass = getActivityColor(activity.type);
						const displayDate = activity.completedDate
							? new Date(activity.completedDate)
							: activity.scheduledDate
							? new Date(activity.scheduledDate)
							: null;

						return (
							<div
								key={activity.id}
								className='flex items-start space-x-3'
							>
								<div
									className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${colorClass}`}
								>
									<Icon className='h-4 w-4' />
								</div>

								<div className='flex-1 min-w-0'>
									<div className='flex items-center justify-between'>
										<div className='flex items-center space-x-2'>
											<p className='text-sm font-medium text-gray-900'>
												{formatActivityType(
													activity.type
												)}
											</p>
											{getStatusIcon(activity.status)}
										</div>
										{displayDate && (
											<p className='text-xs text-gray-500'>
												{formatDate(displayDate)}
											</p>
										)}
									</div>

									{activity.subject && (
										<p className='text-sm text-gray-700 mt-1'>
											{activity.subject}
										</p>
									)}

									{activity.notes && (
										<p className='text-xs text-gray-600 mt-1 line-clamp-2'>
											{activity.notes}
										</p>
									)}

									<div className='flex items-center space-x-4 mt-2 text-xs text-gray-500'>
										{activity.company && (
											<span>{activity.company.name}</span>
										)}
										{activity.contact && (
											<span>
												{activity.contact.firstName}{' '}
												{activity.contact.lastName}
											</span>
										)}
										{activity.deal && (
											<span>
												Deal: {activity.deal.name}
											</span>
										)}
									</div>
								</div>
							</div>
						);
					})}

					{sortedActivities.length === 0 && (
						<div className='text-center text-gray-400 py-8'>
							<p className='text-sm'>No recent activity</p>
						</div>
					)}
				</div>
			</div>
		</Card>
	);
}
