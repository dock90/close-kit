'use client';

import React, { useEffect, useState } from 'react';
import { useCompanyStore } from '@/lib/stores';
import { CompanyList } from './CompanyList';
import { CompanyForm } from './CompanyForm';
import { CompanyDetailView } from './CompanyDetailView';
import { Company } from '@/lib/stores/companyStore';

export function CompaniesPageClient() {
	const {
		companies,
		setCompanies,
		addCompany,
		updateCompany,
		deleteCompany,
		setLoading,
		setError,
		isLoading,
		error,
		selectedCompany,
		setSelectedCompany,
	} = useCompanyStore();

	const [showCreateModal, setShowCreateModal] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);
	const [editingCompany, setEditingCompany] = useState<Company | null>(null);

	// Fetch companies on mount
	useEffect(() => {
		const fetchCompanies = async () => {
			try {
				setLoading(true);
				const response = await fetch('/api/companies');

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

	const handleUpdateCompany = async (companyData: Partial<Company>) => {
		if (!editingCompany) return;

		try {
			const response = await fetch(
				`/api/companies/${editingCompany.id}`,
				{
					method: 'PATCH',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(companyData),
				}
			);

			if (!response.ok) {
				throw new Error('Failed to update company');
			}

			const updatedCompany = await response.json();
			updateCompany(editingCompany.id, updatedCompany);
			setShowEditModal(false);
			setEditingCompany(null);

			// Update selected company if it's the one being edited
			if (selectedCompany?.id === editingCompany.id) {
				setSelectedCompany(updatedCompany);
			}
		} catch (err) {
			console.error('Error updating company:', err);
			alert('Failed to update company. Please try again.');
		}
	};

	const handleDeleteCompany = async (company: Company) => {
		if (!confirm(`Are you sure you want to delete ${company.name}?`)) {
			return;
		}

		try {
			const response = await fetch(`/api/companies/${company.id}`, {
				method: 'DELETE',
			});

			if (!response.ok) {
				throw new Error('Failed to delete company');
			}

			deleteCompany(company.id);

			// Clear selected company if it's the one being deleted
			if (selectedCompany?.id === company.id) {
				setSelectedCompany(null);
			}
		} catch (err) {
			console.error('Error deleting company:', err);
			alert('Failed to delete company. Please try again.');
		}
	};

	const handleCompanySelect = async (company: Company) => {
		try {
			setLoading(true);
			// Fetch full company details including contacts, deals, and activities
			const response = await fetch(`/api/companies/${company.id}`);
			
			if (!response.ok) {
				throw new Error('Failed to fetch company details');
			}

			const fullCompanyData = await response.json();
			setSelectedCompany(fullCompanyData);
			setError(null);
		} catch (err) {
			console.error('Error fetching company details:', err);
			setError(
				err instanceof Error
					? err.message
					: 'Failed to fetch company details'
			);
			// Fallback to the limited data we have
			setSelectedCompany(company);
		} finally {
			setLoading(false);
		}
	};

	const handleEdit = (company: any) => {
		// Transform component Company back to store Company type
		const storeCompany = {
			...company,
			createdAt: company.createdAt.toISOString(),
			updatedAt: company.updatedAt.toISOString(),
		};
		setEditingCompany(storeCompany);
		setShowEditModal(true);
	};

	const handleBackToList = () => {
		setSelectedCompany(null);
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

	// Show detail view if a company is selected
	if (selectedCompany) {
		// Transform store Company to component Company type
		const transformedCompany = {
			...selectedCompany,
			createdAt: new Date(selectedCompany.createdAt),
			updatedAt: new Date(selectedCompany.updatedAt),
			// Transform activities if they exist
			activities: selectedCompany.activities?.map((activity) => ({
				...activity,
				scheduledDate: activity.scheduledDate
					? new Date(activity.scheduledDate)
					: undefined,
				completedDate: activity.completedDate
					? new Date(activity.completedDate)
					: undefined,
			})),
		};

		return (
			<>
				<CompanyDetailView
					company={transformedCompany}
					onBack={handleBackToList}
					onEdit={handleEdit}
				/>

				{showEditModal && editingCompany && (
					<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
						<div className='bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
							<div className='p-6'>
								<div className='flex items-center justify-between mb-6'>
									<h2 className='text-2xl font-bold text-gray-900'>
										Edit Company
									</h2>
									<button
										onClick={() => {
											setShowEditModal(false);
											setEditingCompany(null);
										}}
										className='text-gray-400 hover:text-gray-600'
									>
										<span className='text-2xl'>
											&times;
										</span>
									</button>
								</div>
								<CompanyForm
									company={editingCompany}
									onSubmit={handleUpdateCompany}
									onCancel={() => {
										setShowEditModal(false);
										setEditingCompany(null);
									}}
								/>
							</div>
						</div>
					</div>
				)}
			</>
		);
	}

	return (
		<>
			<CompanyList
				onCompanySelect={handleCompanySelect}
				onCompanyCreate={() => setShowCreateModal(true)}
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
