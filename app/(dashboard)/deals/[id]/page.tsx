'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { DealForm } from '@/components/deals/DealForm';
import { DealCard } from '@/components/deals/DealCard';
import { useCompanyStore, Deal } from '@/lib/stores';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';

interface DealFormData {
	name: string;
	value: number;
	stage: string;
	probability: number;
	expectedCloseDate?: string;
	actualCloseDate?: string;
	serviceType: string | '';
	projectDuration: string | '';
	lostReason: string;
	companyId: string;
	contactId: string;
}

export default function DealDetailPage() {
	const router = useRouter();
	const params = useParams();
	const dealId = params.id as string;

	const { setCompanies } = useCompanyStore();
	const [deal, setDeal] = useState<Deal | null>(null);
	const [isEditing, setIsEditing] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [isLoadingData, setIsLoadingData] = useState(true);
	const [isDeleting, setIsDeleting] = useState(false);

	useEffect(() => {
		fetchDeal();
		fetchCompanies();
	}, [dealId]);

	const fetchDeal = async () => {
		try {
			const response = await fetch(`/api/deals/${dealId}`);
			if (response.ok) {
				const data = await response.json();
				setDeal(data);
			} else {
				router.push('/deals');
			}
		} catch (error) {
			console.error('Error fetching deal:', error);
			router.push('/deals');
		} finally {
			setIsLoadingData(false);
		}
	};

	const fetchCompanies = async () => {
		try {
			const response = await fetch('/api/companies');
			if (response.ok) {
				const data = await response.json();
				setCompanies(data);
			}
		} catch (error) {
			console.error('Error fetching companies:', error);
		}
	};

	const handleSubmit = async (data: DealFormData) => {
		setIsLoading(true);
		try {
			const dealData = {
				name: data.name,
				value: data.value,
				stage: data.stage,
				probability: data.probability,
				expectedCloseDate: data.expectedCloseDate || null,
				actualCloseDate: data.actualCloseDate || null,
				serviceType: data.serviceType || null,
				projectDuration: data.projectDuration || null,
				lostReason: data.lostReason || null,
				companyId: data.companyId,
				contactId: data.contactId,
			};

			const response = await fetch(`/api/deals/${dealId}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(dealData),
			});

			if (response.ok) {
				const updatedDeal = await response.json();
				setDeal(updatedDeal);
				setIsEditing(false);
			} else {
				const error = await response.json();
				alert(`Error updating deal: ${error.error}`);
			}
		} catch (error) {
			console.error('Error updating deal:', error);
			alert('Error updating deal. Please try again.');
		} finally {
			setIsLoading(false);
		}
	};

	const handleDelete = async () => {
		if (
			!confirm(
				`Are you sure you want to delete the deal "${deal?.name}"? This action cannot be undone.`
			)
		) {
			return;
		}

		setIsDeleting(true);
		try {
			const response = await fetch(`/api/deals/${dealId}`, {
				method: 'DELETE',
			});

			if (response.ok) {
				router.push('/deals');
				router.refresh();
			} else {
				const error = await response.json();
				alert(`Error deleting deal: ${error.error}`);
			}
		} catch (error) {
			console.error('Error deleting deal:', error);
			alert('Error deleting deal. Please try again.');
		} finally {
			setIsDeleting(false);
		}
	};

	if (isLoadingData) {
		return (
			<div className='flex items-center justify-center py-12'>
				<div className='text-center'>
					<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
					<p className='text-gray-600'>Loading deal...</p>
				</div>
			</div>
		);
	}

	if (!deal) {
		return (
			<div className='space-y-6'>
				<div className='flex items-center space-x-4'>
					<button
						onClick={() => router.back()}
						className='p-2 text-gray-400 hover:text-gray-600'
					>
						<ArrowLeft className='h-5 w-5' />
					</button>
					<div>
						<h1 className='text-3xl font-bold text-gray-900'>
							Deal Not Found
						</h1>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className='space-y-6'>
			<div className='flex items-center justify-between'>
				<div className='flex items-center space-x-4'>
					<button
						onClick={() => router.back()}
						className='p-2 text-gray-400 hover:text-gray-600 touch-manipulation'
						style={{ minHeight: '44px', minWidth: '44px' }}
					>
						<ArrowLeft className='h-5 w-5' />
					</button>
					<div>
						<h1 className='text-3xl font-bold text-gray-900'>
							{isEditing ? 'Edit Deal' : deal.name}
						</h1>
						<p className='text-gray-600'>
							{isEditing
								? 'Update deal information'
								: 'View and manage deal details'}
						</p>
					</div>
				</div>

				{!isEditing && (
					<div className='flex items-center space-x-2'>
						<button
							onClick={() => setIsEditing(true)}
							className='inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 touch-manipulation'
							style={{ minHeight: '44px' }}
						>
							<Edit className='h-4 w-4 mr-2' />
							Edit
						</button>
						<button
							onClick={handleDelete}
							disabled={isDeleting}
							className='inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation'
							style={{ minHeight: '44px' }}
						>
							<Trash2 className='h-4 w-4 mr-2' />
							{isDeleting ? 'Deleting...' : 'Delete'}
						</button>
					</div>
				)}
			</div>

			{isEditing ? (
				<DealForm
					initialData={{
						name: deal.name,
						value: deal.value,
						stage: deal.stage,
						probability: deal.probability,
						expectedCloseDate: deal.expectedCloseDate,
						actualCloseDate: deal.actualCloseDate,
						serviceType: deal.serviceType || '',
						projectDuration: deal.projectDuration || '',
						lostReason: deal.lostReason || '',
						companyId: deal.companyId,
						contactId: deal.contactId,
					}}
					onSubmit={handleSubmit}
					onCancel={() => setIsEditing(false)}
					isLoading={isLoading}
				/>
			) : (
				<DealCard deal={deal} />
			)}
		</div>
	);
}
