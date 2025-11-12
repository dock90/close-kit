'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CompanyDetailView } from '@/components/companies/CompanyDetailView';
import { useCompanyStore } from '@/lib/stores';

interface CompanyPageProps {
	params: Promise<{
		id: string;
	}>;
}

export default function CompanyPage({ params }: CompanyPageProps) {
	const router = useRouter();
	const { updateCompany, archiveCompany, unarchiveCompany } = useCompanyStore();
	const [company, setCompany] = useState<any>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [isSaving, setIsSaving] = useState(false);
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

	const handleUpdateCompany = async (companyData: any) => {
		if (!company) return;

		setIsSaving(true);
		try {
			const response = await fetch(
				`/api/companies/${company.id}`,
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
			updateCompany(company.id, updatedCompany);
			setCompany(updatedCompany);
		} catch (err) {
			console.error('Error updating company:', err);
			alert('Failed to update company. Please try again.');
		} finally {
			setIsSaving(false);
		}
	};

	const handleBackToList = () => {
		router.push('/companies');
	};

	const handleArchive = async (company: any) => {
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

			const updatedCompany = await response.json();
			archiveCompany(company.id);
			setCompany(updatedCompany);
		} catch (err) {
			console.error('Error archiving company:', err);
			alert('Failed to archive company. Please try again.');
		}
	};

	const handleUnarchive = async (company: any) => {
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

			const updatedCompany = await response.json();
			unarchiveCompany(company.id);
			setCompany(updatedCompany);
		} catch (err) {
			console.error('Error unarchiving company:', err);
			alert('Failed to unarchive company. Please try again.');
		}
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
		<CompanyDetailView
			company={transformedCompany}
			onBack={handleBackToList}
			onUpdate={handleUpdateCompany}
			onArchive={handleArchive}
			onUnarchive={handleUnarchive}
			isUpdating={isSaving}
		/>
	);
}
