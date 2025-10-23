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
	AlertCircle,
	Building2,
	User,
	DollarSign,
} from 'lucide-react';

interface Activity {
	id: string;
	type: string;
	subject?: string;
	notes?: string;
	scheduledDate?: Date;
	completedDate?: Date;
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
	createdAt: Date;
}

interface ActivityListProps {
	activities: Activity[];
	onActivityEdit?: (activity: Activity) => void;
	onActivityDelete?: (activity: Activity) => void;
	showFilters?: boolean;
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

export function ActivityList({
	activities,
	onActivityEdit,
	onActivityDelete,
	showFilters = false,
	limit,
}: ActivityListProps) {
	const [filterType, setFilterType] = React.useState('all');
	const [filterStatus, setFilterStatus] = React.useState('all');

	const formatDate = (date: Date | undefined) => {
		// Check if date is valid
		if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
			return 'N/A';
		}

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
				return <AlertCircle className='h-4 w-4 text-yellow-500' />;
		}
	};

	const filteredActivities = activities
		.filter((activity) => {
			const matchesType =
				filterType === 'all' || activity.type === filterType;
			const matchesStatus =
				filterStatus === 'all' || activity.status === filterStatus;
			return matchesType && matchesStatus;
		})
		.sort((a, b) => {
			const getDate = (activity: Activity) => {
				const date = activity.completedDate || activity.scheduledDate;
				if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
					return new Date(0);
				}
				return date;
			};

			const dateA = getDate(a);
			const dateB = getDate(b);
			return dateB.getTime() - dateA.getTime();
		});

	const displayActivities = limit
		? filteredActivities.slice(0, limit)
		: filteredActivities;

	const handleActionClick = (e: React.MouseEvent, action: () => void) => {
		e.stopPropagation();
		action();
	};

	return (
		<div className='space-y-4'>
			{/* Filters */}
			{showFilters && (
				<Card className='p-4'>
					<div className='flex flex-col md:flex-row gap-4'>
						<div className='flex-1'>
							<label className='block text-sm font-medium text-gray-700 mb-2'>
								Filter by Type
							</label>
							<select
								value={filterType}
								onChange={(e) => setFilterType(e.target.value)}
								className='w-full px-3 py-3 lg:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent touch-manipulation'
								style={{ minHeight: '44px' }}
							>
								<option value='all'>All Types</option>
								<option value='email_sent'>Email Sent</option>
								<option value='linkedin_request'>
									LinkedIn Request
								</option>
								<option value='linkedin_message'>
									LinkedIn Message
								</option>
								<option value='call'>Call</option>
								<option value='meeting'>Meeting</option>
								<option value='proposal_sent'>
									Proposal Sent
								</option>
								<option value='follow_up'>Follow Up</option>
								<option value='note'>Note</option>
							</select>
						</div>
						<div className='flex-1'>
							<label className='block text-sm font-medium text-gray-700 mb-2'>
								Filter by Status
							</label>
							<select
								value={filterStatus}
								onChange={(e) =>
									setFilterStatus(e.target.value)
								}
								className='w-full px-3 py-3 lg:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent touch-manipulation'
								style={{ minHeight: '44px' }}
							>
								<option value='all'>All Statuses</option>
								<option value='completed'>Completed</option>
								<option value='scheduled'>Scheduled</option>
								<option value='cancelled'>Cancelled</option>
							</select>
						</div>
					</div>
				</Card>
			)}

			{/* Activity List */}
			<div className='space-y-3 pb-20 lg:pb-0'>
				{displayActivities.map((activity) => {
					const Icon = getActivityIcon(activity.type);
					const colorClass = getActivityColor(activity.type);
					const displayDate =
						activity.completedDate || activity.scheduledDate;

					return (
						<Card
							key={activity.id}
							className='p-4 hover:shadow-md transition-shadow touch-manipulation group'
						>
							<div className='flex items-start space-x-3'>
								<div
									className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${colorClass}`}
								>
									<Icon className='h-5 w-5' />
								</div>

								<div className='flex-1 min-w-0'>
									<div className='flex items-center justify-between'>
										<div className='flex items-center space-x-2'>
											<h4 className='text-sm font-medium text-gray-900'>
												{formatActivityType(
													activity.type
												)}
											</h4>
											{getStatusIcon(activity.status)}
										</div>
									{onActivityEdit && (
										<button
											onClick={(e) =>
												handleActionClick(
													e,
													() =>
														onActivityEdit(
															activity
														)
												)
											}
											className='px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors'
											title='Edit activity'
										>
											Edit
										</button>
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
											<div className='flex items-center space-x-1'>
												<Building2 className='h-3 w-3' />
												<span>
													{activity.company.name}
												</span>
											</div>
										)}
										{activity.contact && (
											<div className='flex items-center space-x-1'>
												<User className='h-3 w-3' />
												<span>
													{activity.contact.firstName}{' '}
													{activity.contact.lastName}
												</span>
											</div>
										)}
										{activity.deal && (
											<div className='flex items-center space-x-1'>
												<DollarSign className='h-3 w-3' />
												<span>
													{activity.deal.name}
												</span>
											</div>
										)}
									</div>
								</div>
							</div>
						</Card>
					);
				})}

				{displayActivities.length === 0 && (
					<Card className='p-8 text-center'>
						<Clock className='h-12 w-12 text-gray-400 mx-auto mb-4' />
						<h3 className='text-lg font-medium text-gray-900 mb-2'>
							No activities found
						</h3>
						<p className='text-gray-500'>
							{showFilters
								? 'Try adjusting your filters'
								: 'No activities have been logged yet'}
						</p>
					</Card>
				)}
			</div>
		</div>
	);
}
