import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface Activity {
	id: string;
	type: ActivityType;
	subject?: string;
	notes?: string;
	scheduledDate?: string;
	completedDate?: string;
	status: ActivityStatus;
	companyId?: string;
	contactId?: string;
	dealId?: string;
	organizationId: string;
	createdAt: string;
	updatedAt: string;
	company?: {
		id: string;
		name: string;
		website?: string;
		industry?: string;
	};
	contact?: {
		id: string;
		firstName: string;
		lastName: string;
		email?: string;
		title?: string;
	};
	deal?: {
		id: string;
		name: string;
		value: number;
		stage: string;
	};
}

export type ActivityType =
	| 'email_sent'
	| 'linkedin_request'
	| 'linkedin_message'
	| 'call'
	| 'meeting'
	| 'proposal_sent'
	| 'follow_up'
	| 'note';

export type ActivityStatus = 'scheduled' | 'completed' | 'cancelled';

export interface ActivityFilters {
	type?: ActivityType[];
	status?: ActivityStatus[];
	companyId?: string;
	contactId?: string;
	dealId?: string;
	dateRange?: {
		start: string;
		end: string;
	};
	scheduledOnly?: boolean;
	completedOnly?: boolean;
}

export interface ActivityStats {
	totalActivities: number;
	activitiesByType: Record<ActivityType, number>;
	activitiesByStatus: Record<ActivityStatus, number>;
	activitiesByDay: Record<string, number>;
	activitiesByWeek: Record<string, number>;
	averageActivitiesPerDay: number;
	completionRate: number;
	upcomingActivities: number;
	overdueActivities: number;
}

interface ActivityStore {
	// State
	activities: Activity[];
	selectedActivity: Activity | null;
	filters: ActivityFilters;
	isLoading: boolean;
	error: string | null;
	stats: ActivityStats | null;

	// Actions
	setActivities: (activities: Activity[]) => void;
	addActivity: (activity: Activity) => void;
	updateActivity: (id: string, updates: Partial<Activity>) => void;
	deleteActivity: (id: string) => void;
	setSelectedActivity: (activity: Activity | null) => void;

	// Filtering
	setFilters: (filters: Partial<ActivityFilters>) => void;
	clearFilters: () => void;
	getFilteredActivities: () => Activity[];

	// Stats
	setStats: (stats: ActivityStats) => void;
	calculateStats: () => void;

	// Activity management
	getActivityById: (id: string) => Activity | undefined;
	getActivitiesByType: (type: ActivityType) => Activity[];
	getActivitiesByStatus: (status: ActivityStatus) => Activity[];
	getActivitiesByCompany: (companyId: string) => Activity[];
	getActivitiesByContact: (contactId: string) => Activity[];
	getActivitiesByDeal: (dealId: string) => Activity[];

	// Scheduled activities
	getScheduledActivities: () => Activity[];
	getUpcomingActivities: (days?: number) => Activity[];
	getOverdueActivities: () => Activity[];
	getTodaysActivities: () => Activity[];

	// Loading states
	setLoading: (loading: boolean) => void;
	setError: (error: string | null) => void;

	// Bulk operations
	bulkUpdateActivities: (
		activityIds: string[],
		updates: Partial<Activity>
	) => void;
	bulkDeleteActivities: (activityIds: string[]) => void;
	bulkCompleteActivities: (activityIds: string[]) => void;

	// Search
	searchActivities: (query: string) => Activity[];

	// Activity completion
	completeActivity: (id: string, completedDate?: string) => void;
	scheduleActivity: (id: string, scheduledDate: string) => void;
	cancelActivity: (id: string) => void;

	// Quick actions
	logEmailSent: (
		companyId?: string,
		contactId?: string,
		dealId?: string,
		subject?: string,
		notes?: string
	) => void;
	logLinkedInMessage: (
		companyId?: string,
		contactId?: string,
		dealId?: string,
		notes?: string
	) => void;
	logCall: (
		companyId?: string,
		contactId?: string,
		dealId?: string,
		notes?: string
	) => void;
	logMeeting: (
		companyId?: string,
		contactId?: string,
		dealId?: string,
		scheduledDate?: string,
		notes?: string
	) => void;
	logProposalSent: (dealId: string, notes?: string) => void;
	logFollowUp: (
		companyId?: string,
		contactId?: string,
		dealId?: string,
		scheduledDate?: string,
		notes?: string
	) => void;
	logNote: (
		notes: string,
		companyId?: string,
		contactId?: string,
		dealId?: string
	) => void;
}

const initialFilters: ActivityFilters = {};

const calculateActivityStats = (activities: Activity[]): ActivityStats => {
	const totalActivities = activities.length;

	const activitiesByType = activities.reduce((acc, activity) => {
		acc[activity.type] = (acc[activity.type] || 0) + 1;
		return acc;
	}, {} as Record<ActivityType, number>);

	const activitiesByStatus = activities.reduce((acc, activity) => {
		acc[activity.status] = (acc[activity.status] || 0) + 1;
		return acc;
	}, {} as Record<ActivityStatus, number>);

	// Group by day
	const activitiesByDay = activities.reduce((acc, activity) => {
		const date = new Date(activity.createdAt).toISOString().split('T')[0];
		acc[date] = (acc[date] || 0) + 1;
		return acc;
	}, {} as Record<string, number>);

	// Group by week
	const activitiesByWeek = activities.reduce((acc, activity) => {
		const date = new Date(activity.createdAt);
		const weekStart = new Date(date);
		weekStart.setDate(date.getDate() - date.getDay());
		const weekKey = weekStart.toISOString().split('T')[0];
		acc[weekKey] = (acc[weekKey] || 0) + 1;
		return acc;
	}, {} as Record<string, number>);

	const completedActivities = activities.filter(
		(activity) => activity.status === 'completed'
	).length;
	const completionRate =
		totalActivities > 0 ? (completedActivities / totalActivities) * 100 : 0;

	const now = new Date();
	const upcomingActivities = activities.filter((activity) => {
		if (activity.status !== 'scheduled' || !activity.scheduledDate)
			return false;
		const scheduledDate = new Date(activity.scheduledDate);
		return scheduledDate > now;
	}).length;

	const overdueActivities = activities.filter((activity) => {
		if (activity.status !== 'scheduled' || !activity.scheduledDate)
			return false;
		const scheduledDate = new Date(activity.scheduledDate);
		return scheduledDate < now;
	}).length;

	// Calculate average activities per day (last 30 days)
	const thirtyDaysAgo = new Date();
	thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
	const recentActivities = activities.filter(
		(activity) => new Date(activity.createdAt) >= thirtyDaysAgo
	);
	const averageActivitiesPerDay = recentActivities.length / 30;

	return {
		totalActivities,
		activitiesByType,
		activitiesByStatus,
		activitiesByDay,
		activitiesByWeek,
		averageActivitiesPerDay,
		completionRate,
		upcomingActivities,
		overdueActivities,
	};
};

export const useActivityStore = create<ActivityStore>()(
	devtools(
		(set, get) => ({
			// Initial state
			activities: [],
			selectedActivity: null,
			filters: initialFilters,
			isLoading: false,
			error: null,
			stats: null,

			// Actions
			setActivities: (activities) => {
				set({ activities }, false, 'setActivities');
				get().calculateStats();
			},

			addActivity: (activity) => {
				set(
					(state) => ({
						activities: [...state.activities, activity],
					}),
					false,
					'addActivity'
				);
				get().calculateStats();
			},

			updateActivity: (id, updates) => {
				set(
					(state) => ({
						activities: state.activities.map((activity) =>
							activity.id === id
								? { ...activity, ...updates }
								: activity
						),
					}),
					false,
					'updateActivity'
				);
				get().calculateStats();
			},

			deleteActivity: (id) => {
				set(
					(state) => ({
						activities: state.activities.filter(
							(activity) => activity.id !== id
						),
						selectedActivity:
							state.selectedActivity?.id === id
								? null
								: state.selectedActivity,
					}),
					false,
					'deleteActivity'
				);
				get().calculateStats();
			},

			setSelectedActivity: (activity) => {
				set(
					{ selectedActivity: activity },
					false,
					'setSelectedActivity'
				);
			},

			// Filtering
			setFilters: (filters) => {
				set(
					(state) => ({
						filters: { ...state.filters, ...filters },
					}),
					false,
					'setFilters'
				);
			},

			clearFilters: () => {
				set({ filters: initialFilters }, false, 'clearFilters');
			},

			getFilteredActivities: () => {
				const { activities, filters } = get();
				return activities.filter((activity) => {
					if (
						filters.type &&
						filters.type.length > 0 &&
						!filters.type.includes(activity.type)
					) {
						return false;
					}
					if (
						filters.status &&
						filters.status.length > 0 &&
						!filters.status.includes(activity.status)
					) {
						return false;
					}
					if (
						filters.companyId &&
						activity.companyId !== filters.companyId
					) {
						return false;
					}
					if (
						filters.contactId &&
						activity.contactId !== filters.contactId
					) {
						return false;
					}
					if (filters.dealId && activity.dealId !== filters.dealId) {
						return false;
					}
					if (
						filters.scheduledOnly &&
						activity.status !== 'scheduled'
					) {
						return false;
					}
					if (
						filters.completedOnly &&
						activity.status !== 'completed'
					) {
						return false;
					}
					if (filters.dateRange) {
						const activityDate = new Date(activity.createdAt);
						const startDate = new Date(filters.dateRange.start);
						const endDate = new Date(filters.dateRange.end);
						if (
							activityDate < startDate ||
							activityDate > endDate
						) {
							return false;
						}
					}
					return true;
				});
			},

			// Stats
			setStats: (stats) => {
				set({ stats }, false, 'setStats');
			},

			calculateStats: () => {
				const { activities } = get();
				const stats = calculateActivityStats(activities);
				set({ stats }, false, 'calculateStats');
			},

			// Activity management
			getActivityById: (id) => {
				const { activities } = get();
				return activities.find((activity) => activity.id === id);
			},

			getActivitiesByType: (type) => {
				const { activities } = get();
				return activities.filter((activity) => activity.type === type);
			},

			getActivitiesByStatus: (status) => {
				const { activities } = get();
				return activities.filter(
					(activity) => activity.status === status
				);
			},

			getActivitiesByCompany: (companyId) => {
				const { activities } = get();
				return activities.filter(
					(activity) => activity.companyId === companyId
				);
			},

			getActivitiesByContact: (contactId) => {
				const { activities } = get();
				return activities.filter(
					(activity) => activity.contactId === contactId
				);
			},

			getActivitiesByDeal: (dealId) => {
				const { activities } = get();
				return activities.filter(
					(activity) => activity.dealId === dealId
				);
			},

			// Scheduled activities
			getScheduledActivities: () => {
				const { activities } = get();
				return activities.filter(
					(activity) => activity.status === 'scheduled'
				);
			},

			getUpcomingActivities: (days = 7) => {
				const { activities } = get();
				const now = new Date();
				const futureDate = new Date();
				futureDate.setDate(now.getDate() + days);

				return activities.filter((activity) => {
					if (
						activity.status !== 'scheduled' ||
						!activity.scheduledDate
					)
						return false;
					const scheduledDate = new Date(activity.scheduledDate);
					return scheduledDate >= now && scheduledDate <= futureDate;
				});
			},

			getOverdueActivities: () => {
				const { activities } = get();
				const now = new Date();

				return activities.filter((activity) => {
					if (
						activity.status !== 'scheduled' ||
						!activity.scheduledDate
					)
						return false;
					const scheduledDate = new Date(activity.scheduledDate);
					return scheduledDate < now;
				});
			},

			getTodaysActivities: () => {
				const { activities } = get();
				const today = new Date();
				today.setHours(0, 0, 0, 0);
				const tomorrow = new Date(today);
				tomorrow.setDate(tomorrow.getDate() + 1);

				return activities.filter((activity) => {
					if (!activity.scheduledDate) return false;
					const scheduledDate = new Date(activity.scheduledDate);
					return scheduledDate >= today && scheduledDate < tomorrow;
				});
			},

			// Loading states
			setLoading: (loading) => {
				set({ isLoading: loading }, false, 'setLoading');
			},

			setError: (error) => {
				set({ error }, false, 'setError');
			},

			// Bulk operations
			bulkUpdateActivities: (activityIds, updates) => {
				set(
					(state) => ({
						activities: state.activities.map((activity) =>
							activityIds.includes(activity.id)
								? { ...activity, ...updates }
								: activity
						),
					}),
					false,
					'bulkUpdateActivities'
				);
				get().calculateStats();
			},

			bulkDeleteActivities: (activityIds) => {
				set(
					(state) => ({
						activities: state.activities.filter(
							(activity) => !activityIds.includes(activity.id)
						),
						selectedActivity:
							state.selectedActivity &&
							activityIds.includes(state.selectedActivity.id)
								? null
								: state.selectedActivity,
					}),
					false,
					'bulkDeleteActivities'
				);
				get().calculateStats();
			},

			bulkCompleteActivities: (activityIds) => {
				const now = new Date().toISOString();
				set(
					(state) => ({
						activities: state.activities.map((activity) =>
							activityIds.includes(activity.id)
								? {
										...activity,
										status: 'completed' as ActivityStatus,
										completedDate: now,
								  }
								: activity
						),
					}),
					false,
					'bulkCompleteActivities'
				);
				get().calculateStats();
			},

			// Search
			searchActivities: (query) => {
				const { activities } = get();
				const lowercaseQuery = query.toLowerCase();
				return activities.filter(
					(activity) =>
						activity.subject
							?.toLowerCase()
							.includes(lowercaseQuery) ||
						activity.notes
							?.toLowerCase()
							.includes(lowercaseQuery) ||
						activity.company?.name
							.toLowerCase()
							.includes(lowercaseQuery) ||
						activity.contact?.firstName
							.toLowerCase()
							.includes(lowercaseQuery) ||
						activity.contact?.lastName
							.toLowerCase()
							.includes(lowercaseQuery) ||
						activity.deal?.name
							.toLowerCase()
							.includes(lowercaseQuery)
				);
			},

			// Activity completion
			completeActivity: (id, completedDate) => {
				const now = completedDate || new Date().toISOString();
				set(
					(state) => ({
						activities: state.activities.map((activity) =>
							activity.id === id
								? {
										...activity,
										status: 'completed' as ActivityStatus,
										completedDate: now,
								  }
								: activity
						),
					}),
					false,
					'completeActivity'
				);
				get().calculateStats();
			},

			scheduleActivity: (id, scheduledDate) => {
				set(
					(state) => ({
						activities: state.activities.map((activity) =>
							activity.id === id
								? {
										...activity,
										status: 'scheduled' as ActivityStatus,
										scheduledDate,
								  }
								: activity
						),
					}),
					false,
					'scheduleActivity'
				);
				get().calculateStats();
			},

			cancelActivity: (id) => {
				set(
					(state) => ({
						activities: state.activities.map((activity) =>
							activity.id === id
								? {
										...activity,
										status: 'cancelled' as ActivityStatus,
								  }
								: activity
						),
					}),
					false,
					'cancelActivity'
				);
				get().calculateStats();
			},

			// Quick actions
			logEmailSent: (companyId, contactId, dealId, subject, notes) => {
				const now = new Date().toISOString();
				const activity: Activity = {
					id: `temp-${Date.now()}`,
					type: 'email_sent',
					subject,
					notes,
					status: 'completed',
					companyId,
					contactId,
					dealId,
					organizationId: '', // Will be set by the API
					completedDate: now,
					createdAt: now,
					updatedAt: now,
				};
				get().addActivity(activity);
			},

			logLinkedInMessage: (companyId, contactId, dealId, notes) => {
				const now = new Date().toISOString();
				const activity: Activity = {
					id: `temp-${Date.now()}`,
					type: 'linkedin_message',
					notes,
					status: 'completed',
					companyId,
					contactId,
					dealId,
					organizationId: '', // Will be set by the API
					completedDate: now,
					createdAt: now,
					updatedAt: now,
				};
				get().addActivity(activity);
			},

			logCall: (companyId, contactId, dealId, notes) => {
				const now = new Date().toISOString();
				const activity: Activity = {
					id: `temp-${Date.now()}`,
					type: 'call',
					notes,
					status: 'completed',
					companyId,
					contactId,
					dealId,
					organizationId: '', // Will be set by the API
					completedDate: now,
					createdAt: now,
					updatedAt: now,
				};
				get().addActivity(activity);
			},

			logMeeting: (
				companyId,
				contactId,
				dealId,
				scheduledDate,
				notes
			) => {
				const now = new Date().toISOString();
				const activity: Activity = {
					id: `temp-${Date.now()}`,
					type: 'meeting',
					notes,
					status: scheduledDate ? 'scheduled' : 'completed',
					companyId,
					contactId,
					dealId,
					organizationId: '', // Will be set by the API
					scheduledDate,
					completedDate: scheduledDate ? undefined : now,
					createdAt: now,
					updatedAt: now,
				};
				get().addActivity(activity);
			},

			logProposalSent: (dealId, notes) => {
				const now = new Date().toISOString();
				const activity: Activity = {
					id: `temp-${Date.now()}`,
					type: 'proposal_sent',
					notes,
					status: 'completed',
					dealId,
					organizationId: '', // Will be set by the API
					completedDate: now,
					createdAt: now,
					updatedAt: now,
				};
				get().addActivity(activity);
			},

			logFollowUp: (
				companyId,
				contactId,
				dealId,
				scheduledDate,
				notes
			) => {
				const now = new Date().toISOString();
				const activity: Activity = {
					id: `temp-${Date.now()}`,
					type: 'follow_up',
					notes,
					status: scheduledDate ? 'scheduled' : 'completed',
					companyId,
					contactId,
					dealId,
					organizationId: '', // Will be set by the API
					scheduledDate,
					completedDate: scheduledDate ? undefined : now,
					createdAt: now,
					updatedAt: now,
				};
				get().addActivity(activity);
			},

			logNote: (notes, companyId, contactId, dealId) => {
				const now = new Date().toISOString();
				const activity: Activity = {
					id: `temp-${Date.now()}`,
					type: 'note',
					notes,
					status: 'completed',
					companyId,
					contactId,
					dealId,
					organizationId: '', // Will be set by the API
					completedDate: now,
					createdAt: now,
					updatedAt: now,
				};
				get().addActivity(activity);
			},
		}),
		{
			name: 'activity-store',
		}
	)
);
