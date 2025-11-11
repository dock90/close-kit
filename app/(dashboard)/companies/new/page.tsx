'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { CompanyForm } from '@/components/companies/CompanyForm';

export default function NewCompanyPage() {
	const router = useRouter();

	const handleSubmit = async (data: any) => {
		try {
			const response = await fetch('/api/companies', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			});

			if (response.ok) {
				router.push('/companies');
			}
		} catch (error) {
			console.error('Failed to create company:', error);
		}
	};

	const handleCancel = () => {
		router.push('/companies');
	};

	return (
		<div className='space-y-6'>
			<div className='flex items-center space-x-4'>
				<Link
					href='/companies'
					className='inline-flex items-center text-sm text-gray-500 hover:text-gray-700'
				>
					<ArrowLeft className='h-4 w-4 mr-1' />
					Back to Companies
				</Link>
			</div>

			<div className='max-w-2xl'>
				<CompanyForm onSubmit={handleSubmit} onCancel={handleCancel} />
			</div>
		</div>
	);
}
