'use client';

import React, { useEffect, useState } from 'react';
import { useCompanyStore } from '@/lib/stores';
import { CompanyList } from './CompanyList';
import { CompanyForm } from './CompanyForm';
import { Company } from '@/lib/stores/companyStore';

export function CompaniesPageClient() {
	const {
		companies,
		setCompanies,
		addCompany,
		archiveCompany,
		unarchiveCompany,
		setLoading,
		setError,
		isLoading,
		error,
	} = useCompanyStore();

	const [showCreateModal, setShowCreateModal] = useState(false);

	// Fetch companies on mount
	useEffect(() => {
		const fetchCompanies = async () => {
			try {
				setLoading(true);
				const response = await fetch('/api/companies?includeArchived=true');

				if (!response.ok) {
					throw new Error('Failed to fetch companies');
				}

				const data = await response.json();
				setCompanies(data);
				setError(null);
			} catch (err) {
				console.error('Error fetching companies:', err);
				setError(
					err instanceof Error
						? err.message
						: 'Failed to fetch companies'
				);
			} finally {
				setLoading(false);
			}
		};

		fetchCompanies();
	}, [setCompanies, setLoading, setError]);

	const handleCreateCompany = async (companyData: Partial<Company>) => {
		try {
			const response = await fetch('/api/companies', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(companyData),
			});

			if (!response.ok) {
				throw new Error('Failed to create company');
			}

			const newCompany = await response.json();
			addCompany(newCompany);
			setShowCreateModal(false);
		} catch (err) {
			console.error('Error creating company:', err);
			alert('Failed to create company. Please try again.');
		}
	};

	const handleArchiveCompany = async (company: Company) => {
		if (!confirm(`Are you sure you want to archive ${company.name}?`)) {
			return;
		}

		try {
			const response = await fetch(`/api/companies/${company.id}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ archived: true }),
			});

			if (!response.ok) {
				throw new Error('Failed to archive company');
			}

			archiveCompany(company.id);
		} catch (err) {
			console.error('Error archiving company:', err);
			alert('Failed to archive company. Please try again.');
		}
	};

	const handleUnarchiveCompany = async (company: Company) => {
		try {
			const response = await fetch(`/api/companies/${company.id}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ archived: false }),
			});

			if (!response.ok) {
				throw new Error('Failed to unarchive company');
			}

			unarchiveCompany(company.id);
		} catch (err) {
			console.error('Error unarchiving company:', err);
			alert('Failed to unarchive company. Please try again.');
		}
	};


	if (isLoading && companies.length === 0) {
		return (
			<div className='flex items-center justify-center py-12'>
				<div className='text-center'>
					<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
					<p className='text-gray-600'>Loading companies...</p>
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
		<>
			<CompanyList
				onCompanyCreate={() => setShowCreateModal(true)}
				onCompanyArchive={handleArchiveCompany}
				onCompanyUnarchive={handleUnarchiveCompany}
			/>

			{showCreateModal && (
				<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
					<div className='bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
						<div className='p-6'>
							<div className='flex items-center justify-between mb-6'>
								<h2 className='text-2xl font-bold text-gray-900'>
									Add New Company
								</h2>
								<button
									onClick={() => setShowCreateModal(false)}
									className='text-gray-400 hover:text-gray-600'
								>
									<span className='text-2xl'>&times;</span>
								</button>
							</div>
							<CompanyForm
								onSubmit={handleCreateCompany}
								onCancel={() => setShowCreateModal(false)}
							/>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
