'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DealForm } from '@/components/deals/DealForm';
import { useCompanyStore } from '@/lib/stores';
import { ArrowLeft } from 'lucide-react';

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

export default function NewDealPage() {
	const router = useRouter();
	const { setCompanies } = useCompanyStore();
	const [isLoading, setIsLoading] = useState(false);
	const [isLoadingData, setIsLoadingData] = useState(true);

	useEffect(() => {
		fetchCompanies();
	}, []);

	const fetchCompanies = async () => {
		try {
			const response = await fetch('/api/companies');
			if (response.ok) {
				const data = await response.json();
				setCompanies(data);
			}
		} catch (error) {
			console.error('Error fetching companies:', error);
		} finally {
			setIsLoadingData(false);
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

			const response = await fetch('/api/deals', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(dealData),
			});

			if (response.ok) {
				router.push('/deals');
				router.refresh();
			} else {
				const error = await response.json();
				alert(`Error creating deal: ${error.error}`);
			}
		} catch (error) {
			console.error('Error creating deal:', error);
			alert('Error creating deal. Please try again.');
		} finally {
			setIsLoading(false);
		}
	};

	if (isLoadingData) {
		return (
			<div className='flex items-center justify-center py-12'>
				<div className='text-center'>
					<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
					<p className='text-gray-600'>Loading...</p>
				</div>
			</div>
		);
	}

	return (
		<div className='space-y-6'>
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
						Add New Deal
					</h1>
					<p className='text-gray-600'>
						Create a new deal in your pipeline
					</p>
				</div>
			</div>

			<DealForm
				onSubmit={handleSubmit}
				onCancel={() => router.back()}
				isLoading={isLoading}
			/>
		</div>
	);
}
