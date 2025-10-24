'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CompanyDetailView } from '@/components/companies/CompanyDetailView';
import { CompanyForm } from '@/components/companies/CompanyForm';
import { useCompanyStore, Company } from '@/lib/stores';

interface CompanyPageProps {
	params: Promise<{
		id: string;
	}>;
}

export default function CompanyPage({ params }: CompanyPageProps) {
	const router = useRouter();
	const { updateCompany } = useCompanyStore();
	const [company, setCompany] = useState<any>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [showEditModal, setShowEditModal] = useState(false);
	const [editingCompany, setEditingCompany] = useState<Company | null>(null);
	const [companyId, setCompanyId] = useState<string | null>(null);

	useEffect(() => {
		const initializeParams = async () => {
			const resolvedParams = await params;
			setCompanyId(resolvedParams.id);
		};
		initializeParams();
	}, [params]);

	useEffect(() => {
		if (!companyId) return;

		const fetchCompany = async () => {
			try {
				setIsLoading(true);
				const response = await fetch(`/api/companies/${companyId}`);

				if (!response.ok) {
					throw new Error('Failed to fetch company details');
				}

				const data = await response.json();
				setCompany(data);
				setError(null);
			} catch (err) {
				console.error('Error fetching company details:', err);
				setError(
					err instanceof Error
						? err.message
						: 'Failed to fetch company details'
				);
			} finally {
				setIsLoading(false);
			}
		};

		fetchCompany();
	}, [companyId]);

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
			setCompany(updatedCompany);
			setShowEditModal(false);
			setEditingCompany(null);
		} catch (err) {
			console.error('Error updating company:', err);
			alert('Failed to update company. Please try again.');
		}
	};

	const handleEdit = (company: any) => {
		const storeCompany = {
			...company,
			createdAt: company.createdAt.toISOString(),
			updatedAt: company.updatedAt.toISOString(),
		};
		setEditingCompany(storeCompany);
		setShowEditModal(true);
	};

	const handleBackToList = () => {
		router.push('/companies');
	};

	if (isLoading) {
		return (
			<div className='flex items-center justify-center py-12'>
				<div className='text-center'>
					<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
					<p className='text-gray-600'>Loading company...</p>
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
						onClick={handleBackToList}
						className='bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700'
					>
						Back to Companies
					</button>
				</div>
			</div>
		);
	}

	if (!company) {
		return (
			<div className='flex items-center justify-center min-h-[400px]'>
				<div className='text-center'>
					<p className='text-gray-600 mb-4'>Company not found</p>
					<button
						onClick={handleBackToList}
						className='bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700'
					>
						Back to Companies
					</button>
				</div>
			</div>
		);
	}

	const transformedCompany = {
		...company,
		createdAt: new Date(company.createdAt),
		updatedAt: new Date(company.updatedAt),
		activities: company.activities?.map((activity: any) => ({
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
