'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { PullToRefresh } from '@/components/ui/pull-to-refresh';
import { Search, ArrowLeft, Building2, Users, DollarSign } from 'lucide-react';
import { Company } from '@/lib/stores/companyStore';

export function ArchivedCompaniesClient() {
	const router = useRouter();
	const [companies, setCompanies] = useState<Company[]>([]);
	const [searchTerm, setSearchTerm] = useState('');
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [isRefreshing, setIsRefreshing] = useState(false);

	// Fetch archived companies
	useEffect(() => {
		fetchArchivedCompanies();
	}, []);

	const fetchArchivedCompanies = async () => {
		try {
			setIsLoading(true);
			const response = await fetch('/api/companies?includeArchived=true');

			if (!response.ok) {
				throw new Error('Failed to fetch companies');
			}

			const data = await response.json();
			// Filter only archived companies
			const archivedCompanies = data.filter((company: Company) => company.archived);
			setCompanies(archivedCompanies);
			setError(null);
		} catch (err) {
			console.error('Error fetching archived companies:', err);
			setError(
				err instanceof Error
					? err.message
					: 'Failed to fetch archived companies'
			);
		} finally {
			setIsLoading(false);
		}
	};

	const handleUnarchive = async (company: Company) => {
		if (!confirm(`Are you sure you want to restore ${company.name}?`)) {
			return;
		}

		try {
			const response = await fetch(`/api/companies/${company.id}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ archived: false }),
			});

			if (!response.ok) {
				throw new Error('Failed to restore company');
			}

			// Remove from archived list
			setCompanies(companies.filter((c) => c.id !== company.id));
		} catch (err) {
			console.error('Error restoring company:', err);
			alert('Failed to restore company. Please try again.');
		}
	};

	const filteredCompanies = companies.filter((company) => {
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
		await fetchArchivedCompanies();
		setIsRefreshing(false);
	};

	if (isLoading && companies.length === 0) {
		return (
			<div className='flex items-center justify-center py-12'>
				<div className='text-center'>
					<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
					<p className='text-gray-600'>Loading archived companies...</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className='flex items-center justify-center min-h-[400px]'>
				<div className='text-center'>
					<p className='text-red-600 mb-4'>Error: {error}</p>
					<button
						onClick={() => window.location.reload()}
						className='bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700'
					>
						Retry
					</button>
				</div>
			</div>
		);
	}

	return (
		<PullToRefresh onRefresh={handleRefresh}>
			<div className='space-y-6'>
				{/* Header */}
				<div className='flex items-center justify-between'>
					<div className='flex items-center space-x-4'>
						<button
							onClick={() => router.push('/companies')}
							className='flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors touch-manipulation'
						>
							<ArrowLeft className='h-5 w-5 text-gray-600' />
						</button>
						<div>
							<h2 className='text-2xl font-bold text-gray-900'>
								Archived Companies
							</h2>
							<p className='text-gray-600'>
								{companies.length} archived {companies.length === 1 ? 'company' : 'companies'}
							</p>
						</div>
					</div>
				</div>

				{/* Search */}
				<Card className='p-4'>
					<div className='relative'>
						<Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400' />
						<input
							type='text'
							placeholder='Search archived companies...'
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent touch-manipulation'
							style={{ minHeight: '44px' }}
						/>
					</div>
				</Card>

				{/* Company Grid */}
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20 lg:pb-6'>
					{filteredCompanies.map((company) => (
						<Card
							key={company.id}
							className='p-6 hover:shadow-lg transition-shadow'
						>
							<div className='space-y-4'>
								<div className='flex items-start justify-between'>
									<div className='flex items-center space-x-3'>
										<div className='w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center'>
											<Building2 className='h-5 w-5 text-gray-600' />
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
												{company.contacts?.length || company._count?.contacts || 0}
											</span>
										</div>
										<div className='flex items-center space-x-1'>
											<DollarSign className='h-4 w-4' />
											<span>
												{company.deals?.length || company._count?.deals || 0}
											</span>
										</div>
									</div>
									<span className='text-xs text-gray-400'>
										Archived
									</span>
								</div>

								<button
									onClick={(e) => {
										e.stopPropagation();
										handleUnarchive(company);
									}}
									className='w-full px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors touch-manipulation'
									style={{ minHeight: '44px' }}
								>
									Restore Company
								</button>
							</div>
						</Card>
					))}
				</div>

				{filteredCompanies.length === 0 && (
					<Card className='p-12 text-center'>
						<Building2 className='h-12 w-12 text-gray-400 mx-auto mb-4' />
						<h3 className='text-lg font-medium text-gray-900 mb-2'>
							No archived companies found
						</h3>
						<p className='text-gray-500 mb-4'>
							{searchTerm
								? 'Try adjusting your search'
								: 'You don\'t have any archived companies'}
						</p>
						<button
							onClick={() => router.push('/companies')}
							className='bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors touch-manipulation'
							style={{ minHeight: '44px' }}
						>
							Back to Companies
						</button>
					</Card>
				)}
			</div>
		</PullToRefresh>
	);
}
