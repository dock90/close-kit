import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface Deal {
	id: string;
	name: string;
	value: number; // in cents
	stage: DealStage;
	probability: number; // 0-100
	expectedCloseDate?: string;
	actualCloseDate?: string;
	serviceType?: ServiceType;
	projectDuration?: ProjectDuration;
	lostReason?: string;
	companyId: string;
	contactId: string;
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
	activities?: Activity[];
}

export type DealStage =
	| 'lead'
	| 'contacted'
	| 'discovery'
	| 'proposal'
	| 'negotiation'
	| 'closed_won'
	| 'closed_lost';

export type ServiceType = 'nextjs_sanity' | 'hydrogen_sanity' | 'custom';

export type ProjectDuration = '6-8 weeks' | '8-10 weeks' | 'ongoing';

export interface Activity {
	id: string;
	type: string;
	subject?: string;
	notes?: string;
	scheduledDate?: string;
	completedDate?: string;
	status: string;
}

export interface DealFilters {
	stage?: DealStage[];
	serviceType?: ServiceType[];
	companyId?: string;
	contactId?: string;
	dateRange?: {
		start: string;
		end: string;
	};
	minValue?: number;
	maxValue?: number;
}

export interface DealStats {
	totalDeals: number;
	totalValue: number;
	dealsByStage: Record<DealStage, number>;
	dealsByServiceType: Record<ServiceType, number>;
	averageDealSize: number;
	winRate: number;
	averageSalesCycle: number;
}

interface DealStore {
	// State
	deals: Deal[];
	selectedDeal: Deal | null;
	filters: DealFilters;
	isLoading: boolean;
	error: string | null;
	stats: DealStats | null;

	// Actions
	setDeals: (deals: Deal[]) => void;
	addDeal: (deal: Deal) => void;
	updateDeal: (id: string, updates: Partial<Deal>) => void;
	deleteDeal: (id: string) => void;
	setSelectedDeal: (deal: Deal | null) => void;

	// Filtering
	setFilters: (filters: Partial<DealFilters>) => void;
	clearFilters: () => void;
	getFilteredDeals: () => Deal[];

	// Stats
	setStats: (stats: DealStats) => void;
	calculateStats: () => void;

	// Stage management
	moveDealToStage: (dealId: string, newStage: DealStage) => void;
	getDealsByStage: (stage: DealStage) => Deal[];

	// Loading states
	setLoading: (loading: boolean) => void;
	setError: (error: string | null) => void;

	// Bulk operations
	bulkUpdateDeals: (dealIds: string[], updates: Partial<Deal>) => void;
	bulkDeleteDeals: (dealIds: string[]) => void;

	// Search
	searchDeals: (query: string) => Deal[];

	// Pipeline operations
	getPipelineData: () => Record<DealStage, Deal[]>;
	getPipelineValue: () => Record<DealStage, number>;
}

const initialFilters: DealFilters = {};

const calculateDealStats = (deals: Deal[]): DealStats => {
	const totalDeals = deals.length;
	const totalValue = deals.reduce((sum, deal) => sum + deal.value, 0);

	const dealsByStage = deals.reduce((acc, deal) => {
		acc[deal.stage] = (acc[deal.stage] || 0) + 1;
		return acc;
	}, {} as Record<DealStage, number>);

	const dealsByServiceType = deals.reduce((acc, deal) => {
		if (deal.serviceType) {
			acc[deal.serviceType] = (acc[deal.serviceType] || 0) + 1;
		}
		return acc;
	}, {} as Record<ServiceType, number>);

	const averageDealSize = totalDeals > 0 ? totalValue / totalDeals : 0;

	const wonDeals = deals.filter((deal) => deal.stage === 'closed_won').length;
	const winRate = totalDeals > 0 ? (wonDeals / totalDeals) * 100 : 0;

	// Calculate average sales cycle (simplified)
	const closedDeals = deals.filter(
		(deal) => deal.stage === 'closed_won' || deal.stage === 'closed_lost'
	);
	const averageSalesCycle =
		closedDeals.length > 0
			? closedDeals.reduce((sum, deal) => {
					const created = new Date(deal.createdAt);
					const closed = deal.actualCloseDate
						? new Date(deal.actualCloseDate)
						: new Date();
					return (
						sum +
						(closed.getTime() - created.getTime()) /
							(1000 * 60 * 60 * 24)
					);
			  }, 0) / closedDeals.length
			: 0;

	return {
		totalDeals,
		totalValue,
		dealsByStage,
		dealsByServiceType,
		averageDealSize,
		winRate,
		averageSalesCycle,
	};
};

export const useDealStore = create<DealStore>()(
	devtools(
		(set, get) => ({
			// Initial state
			deals: [],
			selectedDeal: null,
			filters: initialFilters,
			isLoading: false,
			error: null,
			stats: null,

			// Actions
			setDeals: (deals) => {
				set({ deals }, false, 'setDeals');
				get().calculateStats();
			},

			addDeal: (deal) => {
				set(
					(state) => ({
						deals: [...state.deals, deal],
					}),
					false,
					'addDeal'
				);
				get().calculateStats();
			},

			updateDeal: (id, updates) => {
				set(
					(state) => ({
						deals: state.deals.map((deal) =>
							deal.id === id ? { ...deal, ...updates } : deal
						),
					}),
					false,
					'updateDeal'
				);
				get().calculateStats();
			},

			deleteDeal: (id) => {
				set(
					(state) => ({
						deals: state.deals.filter((deal) => deal.id !== id),
						selectedDeal:
							state.selectedDeal?.id === id
								? null
								: state.selectedDeal,
					}),
					false,
					'deleteDeal'
				);
				get().calculateStats();
			},

			setSelectedDeal: (deal) => {
				set({ selectedDeal: deal }, false, 'setSelectedDeal');
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

			getFilteredDeals: () => {
				const { deals, filters } = get();
				return deals.filter((deal) => {
					if (
						filters.stage &&
						filters.stage.length > 0 &&
						!filters.stage.includes(deal.stage)
					) {
						return false;
					}
					if (
						filters.serviceType &&
						filters.serviceType.length > 0 &&
						(!deal.serviceType ||
							!filters.serviceType.includes(deal.serviceType))
					) {
						return false;
					}
					if (
						filters.companyId &&
						deal.companyId !== filters.companyId
					) {
						return false;
					}
					if (
						filters.contactId &&
						deal.contactId !== filters.contactId
					) {
						return false;
					}
					if (filters.minValue && deal.value < filters.minValue) {
						return false;
					}
					if (filters.maxValue && deal.value > filters.maxValue) {
						return false;
					}
					if (filters.dateRange) {
						const dealDate = new Date(deal.createdAt);
						const startDate = new Date(filters.dateRange.start);
						const endDate = new Date(filters.dateRange.end);
						if (dealDate < startDate || dealDate > endDate) {
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
				const { deals } = get();
				const stats = calculateDealStats(deals);
				set({ stats }, false, 'calculateStats');
			},

			// Stage management
			moveDealToStage: (dealId, newStage) => {
				set(
					(state) => ({
						deals: state.deals.map((deal) =>
							deal.id === dealId
								? { ...deal, stage: newStage }
								: deal
						),
					}),
					false,
					'moveDealToStage'
				);
				get().calculateStats();
			},

			getDealsByStage: (stage) => {
				const { deals } = get();
				return deals.filter((deal) => deal.stage === stage);
			},

			// Loading states
			setLoading: (loading) => {
				set({ isLoading: loading }, false, 'setLoading');
			},

			setError: (error) => {
				set({ error }, false, 'setError');
			},

			// Bulk operations
			bulkUpdateDeals: (dealIds, updates) => {
				set(
					(state) => ({
						deals: state.deals.map((deal) =>
							dealIds.includes(deal.id)
								? { ...deal, ...updates }
								: deal
						),
					}),
					false,
					'bulkUpdateDeals'
				);
				get().calculateStats();
			},

			bulkDeleteDeals: (dealIds) => {
				set(
					(state) => ({
						deals: state.deals.filter(
							(deal) => !dealIds.includes(deal.id)
						),
						selectedDeal:
							state.selectedDeal &&
							dealIds.includes(state.selectedDeal.id)
								? null
								: state.selectedDeal,
					}),
					false,
					'bulkDeleteDeals'
				);
				get().calculateStats();
			},

			// Search
			searchDeals: (query) => {
				const { deals } = get();
				const lowercaseQuery = query.toLowerCase();
				return deals.filter(
					(deal) =>
						deal.name.toLowerCase().includes(lowercaseQuery) ||
						deal.company?.name
							.toLowerCase()
							.includes(lowercaseQuery) ||
						deal.contact?.firstName
							.toLowerCase()
							.includes(lowercaseQuery) ||
						deal.contact?.lastName
							.toLowerCase()
							.includes(lowercaseQuery) ||
						deal.contact?.email
							?.toLowerCase()
							.includes(lowercaseQuery)
				);
			},

			// Pipeline operations
			getPipelineData: () => {
				const { deals } = get();
				const stages: DealStage[] = [
					'lead',
					'contacted',
					'discovery',
					'proposal',
					'negotiation',
					'closed_won',
					'closed_lost',
				];
				return stages.reduce((acc, stage) => {
					acc[stage] = deals.filter((deal) => deal.stage === stage);
					return acc;
				}, {} as Record<DealStage, Deal[]>);
			},

			getPipelineValue: () => {
				const { deals } = get();
				const stages: DealStage[] = [
					'lead',
					'contacted',
					'discovery',
					'proposal',
					'negotiation',
					'closed_won',
					'closed_lost',
				];
				return stages.reduce((acc, stage) => {
					acc[stage] = deals
						.filter((deal) => deal.stage === stage)
						.reduce((sum, deal) => sum + deal.value, 0);
					return acc;
				}, {} as Record<DealStage, number>);
			},
		}),
		{
			name: 'deal-store',
		}
	)
);
