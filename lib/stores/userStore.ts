import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface User {
	id: string;
	clerkId: string;
	email: string;
	firstName?: string;
	lastName?: string;
	organizationId: string;
	role: UserRole;
	createdAt: string;
	updatedAt: string;
	organization?: Organization;
}

export interface Organization {
	id: string;
	name: string;
	slug: string;
	createdAt: string;
	updatedAt: string;
}

export type UserRole = 'admin' | 'member';

export interface UserPreferences {
	theme: 'light' | 'dark' | 'system';
	timezone: string;
	dateFormat: string;
	timeFormat: '12h' | '24h';
	notifications: {
		email: boolean;
		browser: boolean;
		activities: boolean;
		deals: boolean;
		reports: boolean;
	};
	dashboard: {
		defaultView: 'overview' | 'pipeline' | 'activities';
		showMetrics: boolean;
		showPipeline: boolean;
		showActivities: boolean;
		showReports: boolean;
	};
}

export interface UserStats {
	totalDeals: number;
	totalCompanies: number;
	totalActivities: number;
	totalRevenue: number;
	dealsClosedThisMonth: number;
	activitiesThisWeek: number;
	averageDealSize: number;
	winRate: number;
	productivityScore: number;
}

interface UserStore {
	// State
	user: User | null;
	organization: Organization | null;
	preferences: UserPreferences;
	isAuthenticated: boolean;
	isLoading: boolean;
	error: string | null;
	stats: UserStats | null;

	// Actions
	setUser: (user: User) => void;
	setOrganization: (organization: Organization) => void;
	updateUser: (updates: Partial<User>) => void;
	logout: () => void;

	// Preferences
	setPreferences: (preferences: Partial<UserPreferences>) => void;
	resetPreferences: () => void;
	updateTheme: (theme: UserPreferences['theme']) => void;
	updateNotifications: (
		notifications: Partial<UserPreferences['notifications']>
	) => void;
	updateDashboard: (dashboard: Partial<UserPreferences['dashboard']>) => void;

	// Stats
	setStats: (stats: UserStats) => void;
	calculateStats: () => void;

	// Authentication
	setAuthenticated: (authenticated: boolean) => void;
	setLoading: (loading: boolean) => void;
	setError: (error: string | null) => void;

	// User management
	getUserRole: () => UserRole | null;
	isAdmin: () => boolean;
	isMember: () => boolean;
	canAccessFeature: (feature: string) => boolean;

	// Organization management
	getOrganizationId: () => string | null;
	getOrganizationName: () => string | null;
	getOrganizationSlug: () => string | null;

	// Quick access
	getFullName: () => string;
	getInitials: () => string;
	getDisplayName: () => string;
}

const defaultPreferences: UserPreferences = {
	theme: 'system',
	timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
	dateFormat: 'MM/dd/yyyy',
	timeFormat: '12h',
	notifications: {
		email: true,
		browser: true,
		activities: true,
		deals: true,
		reports: true,
	},
	dashboard: {
		defaultView: 'overview',
		showMetrics: true,
		showPipeline: true,
		showActivities: true,
		showReports: true,
	},
};

const calculateUserStats = (user: User | null): UserStats => {
	// This would typically fetch data from other stores or API
	// For now, returning default values
	return {
		totalDeals: 0,
		totalCompanies: 0,
		totalActivities: 0,
		totalRevenue: 0,
		dealsClosedThisMonth: 0,
		activitiesThisWeek: 0,
		averageDealSize: 0,
		winRate: 0,
		productivityScore: 0,
	};
};

export const useUserStore = create<UserStore>()(
	devtools(
		(set, get) => ({
			// Initial state
			user: null,
			organization: null,
			preferences: defaultPreferences,
			isAuthenticated: false,
			isLoading: false,
			error: null,
			stats: null,

			// Actions
			setUser: (user) => {
				set({ user, isAuthenticated: true }, false, 'setUser');
				get().calculateStats();
			},

			setOrganization: (organization) => {
				set({ organization }, false, 'setOrganization');
			},

			updateUser: (updates) => {
				set(
					(state) => ({
						user: state.user ? { ...state.user, ...updates } : null,
					}),
					false,
					'updateUser'
				);
			},

			logout: () => {
				set(
					{
						user: null,
						organization: null,
						isAuthenticated: false,
						stats: null,
					},
					false,
					'logout'
				);
			},

			// Preferences
			setPreferences: (preferences) => {
				set(
					(state) => ({
						preferences: { ...state.preferences, ...preferences },
					}),
					false,
					'setPreferences'
				);
			},

			resetPreferences: () => {
				set(
					{ preferences: defaultPreferences },
					false,
					'resetPreferences'
				);
			},

			updateTheme: (theme) => {
				set(
					(state) => ({
						preferences: {
							...state.preferences,
							theme,
						},
					}),
					false,
					'updateTheme'
				);
			},

			updateNotifications: (notifications) => {
				set(
					(state) => ({
						preferences: {
							...state.preferences,
							notifications: {
								...state.preferences.notifications,
								...notifications,
							},
						},
					}),
					false,
					'updateNotifications'
				);
			},

			updateDashboard: (dashboard) => {
				set(
					(state) => ({
						preferences: {
							...state.preferences,
							dashboard: {
								...state.preferences.dashboard,
								...dashboard,
							},
						},
					}),
					false,
					'updateDashboard'
				);
			},

			// Stats
			setStats: (stats) => {
				set({ stats }, false, 'setStats');
			},

			calculateStats: () => {
				const { user } = get();
				const stats = calculateUserStats(user);
				set({ stats }, false, 'calculateStats');
			},

			// Authentication
			setAuthenticated: (authenticated) => {
				set(
					{ isAuthenticated: authenticated },
					false,
					'setAuthenticated'
				);
			},

			setLoading: (loading) => {
				set({ isLoading: loading }, false, 'setLoading');
			},

			setError: (error) => {
				set({ error }, false, 'setError');
			},

			// User management
			getUserRole: () => {
				const { user } = get();
				return user?.role || null;
			},

			isAdmin: () => {
				const { user } = get();
				return user?.role === 'admin';
			},

			isMember: () => {
				const { user } = get();
				return user?.role === 'member';
			},

			canAccessFeature: (feature) => {
				const { user } = get();
				if (!user) return false;

				// Admin can access all features
				if (user.role === 'admin') return true;

				// Define feature permissions for members
				const memberFeatures = [
					'dashboard',
					'companies',
					'contacts',
					'deals',
					'activities',
					'reports',
				];

				return memberFeatures.includes(feature);
			},

			// Organization management
			getOrganizationId: () => {
				const { user, organization } = get();
				return organization?.id || user?.organizationId || null;
			},

			getOrganizationName: () => {
				const { organization } = get();
				return organization?.name || null;
			},

			getOrganizationSlug: () => {
				const { organization } = get();
				return organization?.slug || null;
			},

			// Quick access
			getFullName: () => {
				const { user } = get();
				if (!user) return '';
				return `${user.firstName || ''} ${user.lastName || ''}`.trim();
			},

			getInitials: () => {
				const { user } = get();
				if (!user) return '';
				const first = user.firstName?.charAt(0) || '';
				const last = user.lastName?.charAt(0) || '';
				return `${first}${last}`.toUpperCase();
			},

			getDisplayName: () => {
				const { user } = get();
				if (!user) return '';
				const fullName = get().getFullName();
				return fullName || user.email;
			},
		}),
		{
			name: 'user-store',
		}
	)
);
