// Export all stores and their types
export { useDealStore } from './dealStore';
export type {
	Deal,
	DealStage,
	ServiceType,
	ProjectDuration,
	Activity as DealActivity,
	DealFilters,
	DealStats,
} from './dealStore';

export { useCompanyStore } from './companyStore';
export type {
	Company,
	Contact,
	Deal as CompanyDeal,
	Activity as CompanyActivity,
	Industry,
	CompanyFilters,
	CompanyStats,
} from './companyStore';

export { useActivityStore } from './activityStore';
export type {
	Activity,
	ActivityType,
	ActivityStatus,
	ActivityFilters,
	ActivityStats,
} from './activityStore';

export { useUserStore } from './userStore';
export type {
	User,
	Organization,
	UserRole,
	UserPreferences,
	UserStats,
} from './userStore';

// Re-export Zustand utilities for convenience
export { create } from 'zustand';
export { devtools } from 'zustand/middleware';
