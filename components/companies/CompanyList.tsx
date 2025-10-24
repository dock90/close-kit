import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { PullToRefresh } from '@/components/ui/pull-to-refresh';
import { FilterDrawer } from '@/components/ui/filter-drawer';
import {
	Search,
	Filter,
	Plus,
	Building2,
	Users,
	DollarSign,
} from 'lucide-react';
import { useCompanyStore, Company, Industry } from '@/lib/stores';

interface CompanyListProps {
	onCompanySelect?: (company: Company) => void;
	onCompanyCreate?: () => void;
	onCompanyEdit?: (company: Company) => void;
	onCompanyDelete?: (company: Company) => void;
}

const INDUSTRY_FILTERS = [
	{ value: 'all', label: 'All Industries' },
	{ value: 'healthcare', label: 'Healthcare' },
	{ value: 'd2c', label: 'D2C' },
	{ value: 'other', label: 'Other' },
];

const STAGE_FILTERS = [
	{ value: 'all', label: 'All Stages' },
	{ value: 'seed', label: 'Seed' },
	{ value: 'series-a', label: 'Series A' },
	{ value: 'series-b', label: 'Series B' },
	{ value: 'growth', label: 'Growth' },
];

export function CompanyList({
	onCompanySelect,
	onCompanyCreate,
	onCompanyEdit,
	onCompanyDelete,
}: CompanyListProps) {
	const router = useRouter();
	const { companies, setFilters, getFilteredCompanies } = useCompanyStore();
	const [searchTerm, setSearchTerm] = useState('');
	const [industryFilter, setIndustryFilter] = useState('all');
	const [stageFilter, setStageFilter] = useState('all');
	const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
	const [isRefreshing, setIsRefreshing] = useState(false);

	// Update store filters when local filters change
	React.useEffect(() => {
		const filters: any = {};

		if (industryFilter !== 'all') {
			filters.industry = [industryFilter as Industry];
		}

		if (stageFilter !== 'all') {
			filters.fundingStage = [stageFilter];
		}

		setFilters(filters);
	}, [industryFilter, stageFilter, setFilters]);

	const filteredCompanies = getFilteredCompanies().filter((company) => {
		const matchesSearch =
			company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			company.website?.toLowerCase().includes(searchTerm.toLowerCase()) ||
			company.location?.toLowerCase().includes(searchTerm.toLowerCase());

		return matchesSearch;
	});

	const formatDate = (date: string) => {
		return new Intl.DateTimeFormat('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
		}).format(new Date(date));
	};

	const handleRefresh = async () => {
		setIsRefreshing(true);
		// Simulate API refresh
		await new Promise(resolve => setTimeout(resolve, 1000));
		setIsRefreshing(false);
	};

	return (
		<PullToRefresh onRefresh={handleRefresh}>
			<div className='space-y-6'>
				{/* Header */}
				<div className='flex items-center justify-between'>
					<div>
						<h2 className='text-2xl font-bold text-gray-900'>
							Companies
						</h2>
						<p className='text-gray-600'>
							{companies.length} total companies
						</p>
					</div>
					<button
						onClick={onCompanyCreate}
						className='flex items-center space-x-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors touch-manipulation'
						style={{ minHeight: '44px' }}
					>
						<Plus className='h-5 w-5' />
						<span className='hidden sm:inline'>Add Company</span>
					</button>
				</div>

				{/* Mobile Search & Filter Button */}
				<div className='lg:hidden'>
					<Card className='p-4'>
						<div className='flex gap-2'>
							<div className='flex-1 relative'>
								<Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400' />
								<input
									type='text'
									placeholder='Search companies...'
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent touch-manipulation'
									style={{ minHeight: '44px' }}
								/>
							</div>
							<button
								onClick={() => setIsFilterDrawerOpen(true)}
								className='flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors touch-manipulation'
								style={{ minHeight: '44px' }}
							>
								<Filter className='h-5 w-5 text-gray-600' />
							</button>
						</div>
					</Card>
				</div>

				{/* Desktop Filters */}
				<Card className='p-4 hidden lg:block'>
					<div className='flex flex-col md:flex-row gap-4'>
						<div className='flex-1'>
							<div className='relative'>
								<Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
								<input
									type='text'
									placeholder='Search companies...'
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
								/>
							</div>
						</div>

						<div className='flex gap-2'>
							<select
								value={industryFilter}
								onChange={(e) => setIndustryFilter(e.target.value)}
								className='px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
							>
								{INDUSTRY_FILTERS.map((filter) => (
									<option key={filter.value} value={filter.value}>
										{filter.label}
									</option>
								))}
							</select>

							<select
								value={stageFilter}
								onChange={(e) => setStageFilter(e.target.value)}
								className='px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
							>
								{STAGE_FILTERS.map((filter) => (
									<option key={filter.value} value={filter.value}>
										{filter.label}
									</option>
								))}
							</select>
						</div>
					</div>
				</Card>

				{/* Filter Drawer for Mobile */}
				<FilterDrawer
					isOpen={isFilterDrawerOpen}
					onClose={() => setIsFilterDrawerOpen(false)}
					title='Filter Companies'
				>
					<div className='space-y-4'>
						<div>
							<label className='block text-sm font-medium text-gray-700 mb-2'>
								Industry
							</label>
							<select
								value={industryFilter}
								onChange={(e) => setIndustryFilter(e.target.value)}
								className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent touch-manipulation'
								style={{ minHeight: '44px' }}
							>
								{INDUSTRY_FILTERS.map((filter) => (
									<option key={filter.value} value={filter.value}>
										{filter.label}
									</option>
								))}
							</select>
						</div>
						<div>
							<label className='block text-sm font-medium text-gray-700 mb-2'>
								Funding Stage
							</label>
							<select
								value={stageFilter}
								onChange={(e) => setStageFilter(e.target.value)}
								className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent touch-manipulation'
								style={{ minHeight: '44px' }}
							>
								{STAGE_FILTERS.map((filter) => (
									<option key={filter.value} value={filter.value}>
										{filter.label}
									</option>
								))}
							</select>
						</div>
					</div>
				</FilterDrawer>

				{/* Company Grid */}
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20 lg:pb-6'>
					{filteredCompanies.map((company) => (
						<Card
							key={company.id}
							className='p-6 hover:shadow-lg transition-shadow cursor-pointer touch-manipulation'
							onClick={() => router.push(`/companies/${company.id}`)}
							style={{ minHeight: '44px' }}
						>
						<div className='space-y-4'>
							<div className='flex items-start justify-between'>
								<div className='flex items-center space-x-3'>
									<div className='w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center'>
										<Building2 className='h-5 w-5 text-blue-600' />
									</div>
									<div>
										<h3 className='font-semibold text-gray-900'>
											{company.name}
										</h3>
										{company.website && (
											<p className='text-sm text-gray-500'>
												{company.website}
											</p>
										)}
									</div>
								</div>
							</div>

							<div className='space-y-2'>
								{company.industry && (
									<div className='flex items-center space-x-2'>
										<span className='text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded'>
											{company.industry}
										</span>
									</div>
								)}

								{company.location && (
									<p className='text-sm text-gray-600'>
										{company.location}
									</p>
								)}

								{company.employeeCount && (
									<p className='text-sm text-gray-600'>
										{company.employeeCount} employees
									</p>
								)}
							</div>

							<div className='flex items-center justify-between pt-4 border-t'>
								<div className='flex items-center space-x-4 text-sm text-gray-500'>
									<div className='flex items-center space-x-1'>
										<Users className='h-4 w-4' />
										<span>
											{company.contacts?.length || 0}
										</span>
									</div>
									<div className='flex items-center space-x-1'>
										<DollarSign className='h-4 w-4' />
										<span>
											{company.deals?.length || 0}
										</span>
									</div>
								</div>
								<span className='text-xs text-gray-400'>
									Added {formatDate(company.createdAt)}
								</span>
							</div>
						</div>
						</Card>
					))}
				</div>

				{filteredCompanies.length === 0 && (
					<Card className='p-12 text-center'>
						<Building2 className='h-12 w-12 text-gray-400 mx-auto mb-4' />
						<h3 className='text-lg font-medium text-gray-900 mb-2'>
							No companies found
						</h3>
						<p className='text-gray-500 mb-4'>
							{searchTerm ||
							industryFilter !== 'all' ||
							stageFilter !== 'all'
								? 'Try adjusting your search or filters'
								: 'Get started by adding your first company'}
						</p>
						{!searchTerm &&
							industryFilter === 'all' &&
							stageFilter === 'all' && (
								<button
									onClick={onCompanyCreate}
									className='bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors touch-manipulation'
									style={{ minHeight: '44px' }}
								>
									Add Company
								</button>
							)}
					</Card>
				)}
			</div>
		</PullToRefresh>
	);
}
