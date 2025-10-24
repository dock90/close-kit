import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface Company {
	id: string;
	name: string;
	website?: string;
	industry?: Industry;
	employeeCount?: string;
	fundingStage?: string;
	location?: string;
	linkedinUrl?: string;
	notes?: string;
	archived?: boolean;
	organizationId: string;
	createdAt: string;
	updatedAt: string;
	contacts?: Contact[];
	deals?: Deal[];
	activities?: Activity[];
	_count?: {
		contacts: number;
		deals: number;
	};
}

export interface Contact {
	id: string;
	firstName: string;
	lastName: string;
	email?: string;
	phone?: string;
	title?: string;
	linkedinUrl?: string;
	companyId: string;
	organizationId: string;
	createdAt: string;
	updatedAt: string;
}

export interface Deal {
	id: string;
	name: string;
	value: number;
	stage: string;
	probability: number;
	companyId: string;
	contactId: string;
}

export interface Activity {
	id: string;
	type: string;
	subject?: string;
	notes?: string;
	scheduledDate?: string;
	completedDate?: string;
	status: string;
	companyId?: string;
	contactId?: string;
	dealId?: string;
}

export type Industry = 'healthcare' | 'd2c' | 'other';

export interface CompanyFilters {
	industry?: Industry[];
	employeeCount?: string[];
	fundingStage?: string[];
	location?: string[];
	hasDeals?: boolean;
	hasContacts?: boolean;
	showArchived?: boolean;
	dateRange?: {
		start: string;
		end: string;
	};
}

export interface CompanyStats {
	totalCompanies: number;
	companiesByIndustry: Record<Industry, number>;
	companiesByEmployeeCount: Record<string, number>;
	companiesByFundingStage: Record<string, number>;
	averageDealsPerCompany: number;
	totalDealValue: number;
	companiesWithDeals: number;
	companiesWithContacts: number;
}

interface CompanyStore {
	// State
	companies: Company[];
	selectedCompany: Company | null;
	filters: CompanyFilters;
	isLoading: boolean;
	error: string | null;
	stats: CompanyStats | null;

	// Actions
	setCompanies: (companies: Company[]) => void;
	addCompany: (company: Company) => void;
	updateCompany: (id: string, updates: Partial<Company>) => void;
	deleteCompany: (id: string) => void;
	archiveCompany: (id: string) => void;
	unarchiveCompany: (id: string) => void;
	setSelectedCompany: (company: Company | null) => void;

	// Filtering
	setFilters: (filters: Partial<CompanyFilters>) => void;
	clearFilters: () => void;
	getFilteredCompanies: () => Company[];

	// Stats
	setStats: (stats: CompanyStats) => void;
	calculateStats: () => void;

	// Company management
	getCompanyById: (id: string) => Company | undefined;
	getCompaniesByIndustry: (industry: Industry) => Company[];
	getCompaniesWithDeals: () => Company[];
	getCompaniesWithContacts: () => Company[];

	// Loading states
	setLoading: (loading: boolean) => void;
	setError: (error: string | null) => void;

	// Bulk operations
	bulkUpdateCompanies: (
		companyIds: string[],
		updates: Partial<Company>
	) => void;
	bulkDeleteCompanies: (companyIds: string[]) => void;

	// Search
	searchCompanies: (query: string) => Company[];

	// Contact management
	addContactToCompany: (companyId: string, contact: Contact) => void;
	updateContactInCompany: (
		companyId: string,
		contactId: string,
		updates: Partial<Contact>
	) => void;
	removeContactFromCompany: (companyId: string, contactId: string) => void;

	// Deal management
	addDealToCompany: (companyId: string, deal: Deal) => void;
	updateDealInCompany: (
		companyId: string,
		dealId: string,
		updates: Partial<Deal>
	) => void;
	removeDealFromCompany: (companyId: string, dealId: string) => void;

	// Activity management
	addActivityToCompany: (companyId: string, activity: Activity) => void;
	updateActivityInCompany: (
		companyId: string,
		activityId: string,
		updates: Partial<Activity>
	) => void;
	removeActivityFromCompany: (companyId: string, activityId: string) => void;
}

const initialFilters: CompanyFilters = {};

const calculateCompanyStats = (companies: Company[]): CompanyStats => {
	const totalCompanies = companies.length;

	const companiesByIndustry = companies.reduce((acc, company) => {
		if (company.industry) {
			acc[company.industry] = (acc[company.industry] || 0) + 1;
		}
		return acc;
	}, {} as Record<Industry, number>);

	const companiesByEmployeeCount = companies.reduce((acc, company) => {
		if (company.employeeCount) {
			acc[company.employeeCount] = (acc[company.employeeCount] || 0) + 1;
		}
		return acc;
	}, {} as Record<string, number>);

	const companiesByFundingStage = companies.reduce((acc, company) => {
		if (company.fundingStage) {
			acc[company.fundingStage] = (acc[company.fundingStage] || 0) + 1;
		}
		return acc;
	}, {} as Record<string, number>);

	const companiesWithDeals = companies.filter(
		(company) => company.deals && company.deals.length > 0
	).length;
	const companiesWithContacts = companies.filter(
		(company) => company.contacts && company.contacts.length > 0
	).length;

	const totalDealValue = companies.reduce((sum, company) => {
		if (company.deals) {
			return (
				sum +
				company.deals.reduce((dealSum, deal) => dealSum + deal.value, 0)
			);
		}
		return sum;
	}, 0);

	const averageDealsPerCompany =
		companiesWithDeals > 0
			? companies.reduce(
					(sum, company) => sum + (company.deals?.length || 0),
					0
			  ) / companiesWithDeals
			: 0;

	return {
		totalCompanies,
		companiesByIndustry,
		companiesByEmployeeCount,
		companiesByFundingStage,
		averageDealsPerCompany,
		totalDealValue,
		companiesWithDeals,
		companiesWithContacts,
	};
};

export const useCompanyStore = create<CompanyStore>()(
	devtools(
		(set, get) => ({
			// Initial state
			companies: [],
			selectedCompany: null,
			filters: initialFilters,
			isLoading: false,
			error: null,
			stats: null,

			// Actions
			setCompanies: (companies) => {
				set({ companies }, false, 'setCompanies');
				get().calculateStats();
			},

			addCompany: (company) => {
				set(
					(state) => ({
						companies: [...state.companies, company],
					}),
					false,
					'addCompany'
				);
				get().calculateStats();
			},

			updateCompany: (id, updates) => {
				set(
					(state) => ({
						companies: state.companies.map((company) =>
							company.id === id
								? { ...company, ...updates }
								: company
						),
					}),
					false,
					'updateCompany'
				);
				get().calculateStats();
			},

			deleteCompany: (id) => {
				set(
					(state) => ({
						companies: state.companies.filter(
							(company) => company.id !== id
						),
						selectedCompany:
							state.selectedCompany?.id === id
								? null
								: state.selectedCompany,
					}),
					false,
					'deleteCompany'
				);
				get().calculateStats();
			},

			archiveCompany: (id) => {
				set(
					(state) => ({
						companies: state.companies.map((company) =>
							company.id === id
								? { ...company, archived: true }
								: company
						),
					}),
					false,
					'archiveCompany'
				);
				get().calculateStats();
			},

			unarchiveCompany: (id) => {
				set(
					(state) => ({
						companies: state.companies.map((company) =>
							company.id === id
								? { ...company, archived: false }
								: company
						),
					}),
					false,
					'unarchiveCompany'
				);
				get().calculateStats();
			},

			setSelectedCompany: (company) => {
				set({ selectedCompany: company }, false, 'setSelectedCompany');
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

			getFilteredCompanies: () => {
				const { companies, filters } = get();
				return companies.filter((company) => {
					// Filter archived companies unless explicitly requested
					if (!filters.showArchived && company.archived) {
						return false;
					}
					if (
						filters.industry &&
						filters.industry.length > 0 &&
						(!company.industry ||
							!filters.industry.includes(company.industry))
					) {
						return false;
					}
					if (
						filters.employeeCount &&
						filters.employeeCount.length > 0 &&
						(!company.employeeCount ||
							!filters.employeeCount.includes(
								company.employeeCount
							))
					) {
						return false;
					}
					if (
						filters.fundingStage &&
						filters.fundingStage.length > 0 &&
						(!company.fundingStage ||
							!filters.fundingStage.includes(
								company.fundingStage
							))
					) {
						return false;
					}
					if (
						filters.location &&
						filters.location.length > 0 &&
						(!company.location ||
							!filters.location.includes(company.location))
					) {
						return false;
					}
					if (filters.hasDeals !== undefined) {
						const hasDeals =
							company.deals && company.deals.length > 0;
						if (filters.hasDeals !== hasDeals) {
							return false;
						}
					}
					if (filters.hasContacts !== undefined) {
						const hasContacts =
							company.contacts && company.contacts.length > 0;
						if (filters.hasContacts !== hasContacts) {
							return false;
						}
					}
					if (filters.dateRange) {
						const companyDate = new Date(company.createdAt);
						const startDate = new Date(filters.dateRange.start);
						const endDate = new Date(filters.dateRange.end);
						if (companyDate < startDate || companyDate > endDate) {
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
				const { companies } = get();
				const stats = calculateCompanyStats(companies);
				set({ stats }, false, 'calculateStats');
			},

			// Company management
			getCompanyById: (id) => {
				const { companies } = get();
				return companies.find((company) => company.id === id);
			},

			getCompaniesByIndustry: (industry) => {
				const { companies } = get();
				return companies.filter(
					(company) => company.industry === industry
				);
			},

			getCompaniesWithDeals: () => {
				const { companies } = get();
				return companies.filter(
					(company) => company.deals && company.deals.length > 0
				);
			},

			getCompaniesWithContacts: () => {
				const { companies } = get();
				return companies.filter(
					(company) => company.contacts && company.contacts.length > 0
				);
			},

			// Loading states
			setLoading: (loading) => {
				set({ isLoading: loading }, false, 'setLoading');
			},

			setError: (error) => {
				set({ error }, false, 'setError');
			},

			// Bulk operations
			bulkUpdateCompanies: (companyIds, updates) => {
				set(
					(state) => ({
						companies: state.companies.map((company) =>
							companyIds.includes(company.id)
								? { ...company, ...updates }
								: company
						),
					}),
					false,
					'bulkUpdateCompanies'
				);
				get().calculateStats();
			},

			bulkDeleteCompanies: (companyIds) => {
				set(
					(state) => ({
						companies: state.companies.filter(
							(company) => !companyIds.includes(company.id)
						),
						selectedCompany:
							state.selectedCompany &&
							companyIds.includes(state.selectedCompany.id)
								? null
								: state.selectedCompany,
					}),
					false,
					'bulkDeleteCompanies'
				);
				get().calculateStats();
			},

			// Search
			searchCompanies: (query) => {
				const { companies } = get();
				const lowercaseQuery = query.toLowerCase();
				return companies.filter(
					(company) =>
						company.name.toLowerCase().includes(lowercaseQuery) ||
						company.website
							?.toLowerCase()
							.includes(lowercaseQuery) ||
						company.location
							?.toLowerCase()
							.includes(lowercaseQuery) ||
						company.industry
							?.toLowerCase()
							.includes(lowercaseQuery) ||
						company.notes?.toLowerCase().includes(lowercaseQuery)
				);
			},

			// Contact management
			addContactToCompany: (companyId, contact) => {
				set(
					(state) => ({
						companies: state.companies.map((company) =>
							company.id === companyId
								? {
										...company,
										contacts: [
											...(company.contacts || []),
											contact,
										],
								  }
								: company
						),
					}),
					false,
					'addContactToCompany'
				);
				get().calculateStats();
			},

			updateContactInCompany: (companyId, contactId, updates) => {
				set(
					(state) => ({
						companies: state.companies.map((company) =>
							company.id === companyId
								? {
										...company,
										contacts: company.contacts?.map(
											(contact) =>
												contact.id === contactId
													? { ...contact, ...updates }
													: contact
										),
								  }
								: company
						),
					}),
					false,
					'updateContactInCompany'
				);
			},

			removeContactFromCompany: (companyId, contactId) => {
				set(
					(state) => ({
						companies: state.companies.map((company) =>
							company.id === companyId
								? {
										...company,
										contacts: company.contacts?.filter(
											(contact) =>
												contact.id !== contactId
										),
								  }
								: company
						),
					}),
					false,
					'removeContactFromCompany'
				);
				get().calculateStats();
			},

			// Deal management
			addDealToCompany: (companyId, deal) => {
				set(
					(state) => ({
						companies: state.companies.map((company) =>
							company.id === companyId
								? {
										...company,
										deals: [...(company.deals || []), deal],
								  }
								: company
						),
					}),
					false,
					'addDealToCompany'
				);
				get().calculateStats();
			},

			updateDealInCompany: (companyId, dealId, updates) => {
				set(
					(state) => ({
						companies: state.companies.map((company) =>
							company.id === companyId
								? {
										...company,
										deals: company.deals?.map((deal) =>
											deal.id === dealId
												? { ...deal, ...updates }
												: deal
										),
								  }
								: company
						),
					}),
					false,
					'updateDealInCompany'
				);
				get().calculateStats();
			},

			removeDealFromCompany: (companyId, dealId) => {
				set(
					(state) => ({
						companies: state.companies.map((company) =>
							company.id === companyId
								? {
										...company,
										deals: company.deals?.filter(
											(deal) => deal.id !== dealId
										),
								  }
								: company
						),
					}),
					false,
					'removeDealFromCompany'
				);
				get().calculateStats();
			},

			// Activity management
			addActivityToCompany: (companyId, activity) => {
				set(
					(state) => ({
						companies: state.companies.map((company) =>
							company.id === companyId
								? {
										...company,
										activities: [
											...(company.activities || []),
											activity,
										],
								  }
								: company
						),
					}),
					false,
					'addActivityToCompany'
				);
			},

			updateActivityInCompany: (companyId, activityId, updates) => {
				set(
					(state) => ({
						companies: state.companies.map((company) =>
							company.id === companyId
								? {
										...company,
										activities: company.activities?.map(
											(activity) =>
												activity.id === activityId
													? {
															...activity,
															...updates,
													  }
													: activity
										),
								  }
								: company
						),
					}),
					false,
					'updateActivityInCompany'
				);
			},

			removeActivityFromCompany: (companyId, activityId) => {
				set(
					(state) => ({
						companies: state.companies.map((company) =>
							company.id === companyId
								? {
										...company,
										activities: company.activities?.filter(
											(activity) =>
												activity.id !== activityId
										),
								  }
								: company
						),
					}),
					false,
					'removeActivityFromCompany'
				);
			},
		}),
		{
			name: 'company-store',
		}
	)
);
