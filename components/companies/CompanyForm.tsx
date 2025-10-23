import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import {
	Building2,
	Globe,
	MapPin,
	Users,
	ExternalLink,
	Save,
	X,
} from 'lucide-react';
import { useCompanyStore, Industry } from '@/lib/stores';

interface CompanyFormData {
	name: string;
	website: string;
	industry: Industry | '';
	employeeCount: string;
	fundingStage: string;
	location: string;
	linkedinUrl: string;
	notes: string;
}

interface CompanyFormProps {
	initialData?: Partial<CompanyFormData>;
	onSubmit: (data: CompanyFormData) => void;
	onCancel?: () => void;
	isLoading?: boolean;
}

const INDUSTRY_OPTIONS = [
	{ value: 'healthcare', label: 'Healthcare' },
	{ value: 'd2c', label: 'D2C' },
	{ value: 'other', label: 'Other' },
];

const EMPLOYEE_COUNT_OPTIONS = [
	{ value: '1-10', label: '1-10 employees' },
	{ value: '11-50', label: '11-50 employees' },
	{ value: '51-200', label: '51-200 employees' },
	{ value: '201-500', label: '201-500 employees' },
	{ value: '501-1000', label: '501-1000 employees' },
	{ value: '1000+', label: '1000+ employees' },
];

const FUNDING_STAGE_OPTIONS = [
	{ value: 'bootstrap', label: 'Bootstrap' },
	{ value: 'seed', label: 'Seed' },
	{ value: 'series-a', label: 'Series A' },
	{ value: 'series-b', label: 'Series B' },
	{ value: 'series-c', label: 'Series C' },
	{ value: 'growth', label: 'Growth' },
	{ value: 'public', label: 'Public' },
];

export function CompanyForm({
	initialData = {},
	onSubmit,
	onCancel,
	isLoading = false,
}: CompanyFormProps) {
	const [formData, setFormData] = useState<CompanyFormData>({
		name: '',
		website: '',
		industry: '',
		employeeCount: '',
		fundingStage: '',
		location: '',
		linkedinUrl: '',
		notes: '',
		...initialData,
	});

	const [errors, setErrors] = useState<Partial<CompanyFormData>>({});

	const handleChange = (field: keyof CompanyFormData, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		if (errors[field]) {
			setErrors((prev) => ({ ...prev, [field]: undefined }));
		}
	};

	const validateForm = () => {
		const newErrors: Partial<CompanyFormData> = {};

		if (!formData.name.trim()) {
			newErrors.name = 'Company name is required';
		}

		if (formData.website && !isValidUrl(formData.website)) {
			newErrors.website = 'Please enter a valid URL';
		}

		if (formData.linkedinUrl && !isValidLinkedInUrl(formData.linkedinUrl)) {
			newErrors.linkedinUrl = 'Please enter a valid LinkedIn URL';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const isValidUrl = (url: string) => {
		try {
			new URL(url.startsWith('http') ? url : `https://${url}`);
			return true;
		} catch {
			return false;
		}
	};

	const isValidLinkedInUrl = (url: string) => {
		return url.includes('linkedin.com/company/');
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (validateForm()) {
			onSubmit(formData);
		}
	};

	const formatUrl = (url: string) => {
		if (!url) return '';
		return url.startsWith('http') ? url : `https://${url}`;
	};

	return (
		<Card className='p-6'>
			<form onSubmit={handleSubmit} className='space-y-6'>
				<div className='flex items-center justify-between'>
					<div className='flex items-center space-x-3'>
						<Building2 className='h-6 w-6 text-blue-600' />
						<h2 className='text-xl font-semibold text-gray-900'>
							{initialData.name ? 'Edit Company' : 'Add Company'}
						</h2>
					</div>
					{onCancel && (
						<button
							type='button'
							onClick={onCancel}
							className='p-2 text-gray-400 hover:text-gray-600'
						>
							<X className='h-5 w-5' />
						</button>
					)}
				</div>

				<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
					{/* Company Name */}
					<div className='md:col-span-2'>
						<label className='block text-sm font-medium text-gray-700 mb-2'>
							Company Name *
						</label>
						<input
							type='text'
							value={formData.name}
							onChange={(e) =>
								handleChange('name', e.target.value)
							}
							className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
								errors.name
									? 'border-red-300'
									: 'border-gray-300'
							}`}
							placeholder='Enter company name'
						/>
						{errors.name && (
							<p className='mt-1 text-sm text-red-600'>
								{errors.name}
							</p>
						)}
					</div>

					{/* Website */}
					<div>
						<label className='block text-sm font-medium text-gray-700 mb-2'>
							<Globe className='inline h-4 w-4 mr-1' />
							Website
						</label>
						<input
							type='text'
							value={formData.website}
							onChange={(e) =>
								handleChange('website', e.target.value)
							}
							className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
								errors.website
									? 'border-red-300'
									: 'border-gray-300'
							}`}
							placeholder='company.com'
						/>
						{errors.website && (
							<p className='mt-1 text-sm text-red-600'>
								{errors.website}
							</p>
						)}
					</div>

					{/* LinkedIn */}
					<div>
						<label className='block text-sm font-medium text-gray-700 mb-2'>
							<ExternalLink className='inline h-4 w-4 mr-1' />
							LinkedIn
						</label>
						<input
							type='text'
							value={formData.linkedinUrl}
							onChange={(e) =>
								handleChange('linkedinUrl', e.target.value)
							}
							className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
								errors.linkedinUrl
									? 'border-red-300'
									: 'border-gray-300'
							}`}
							placeholder='linkedin.com/company/company-name'
						/>
						{errors.linkedinUrl && (
							<p className='mt-1 text-sm text-red-600'>
								{errors.linkedinUrl}
							</p>
						)}
					</div>

					{/* Industry */}
					<div>
						<label className='block text-sm font-medium text-gray-700 mb-2'>
							Industry
						</label>
						<select
							value={formData.industry}
							onChange={(e) =>
								handleChange('industry', e.target.value)
							}
							className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
						>
							<option value=''>Select industry</option>
							{INDUSTRY_OPTIONS.map((option) => (
								<option key={option.value} value={option.value}>
									{option.label}
								</option>
							))}
						</select>
					</div>

					{/* Employee Count */}
					<div>
						<label className='block text-sm font-medium text-gray-700 mb-2'>
							<Users className='inline h-4 w-4 mr-1' />
							Employee Count
						</label>
						<select
							value={formData.employeeCount}
							onChange={(e) =>
								handleChange('employeeCount', e.target.value)
							}
							className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
						>
							<option value=''>Select size</option>
							{EMPLOYEE_COUNT_OPTIONS.map((option) => (
								<option key={option.value} value={option.value}>
									{option.label}
								</option>
							))}
						</select>
					</div>

					{/* Funding Stage */}
					<div>
						<label className='block text-sm font-medium text-gray-700 mb-2'>
							Funding Stage
						</label>
						<select
							value={formData.fundingStage}
							onChange={(e) =>
								handleChange('fundingStage', e.target.value)
							}
							className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
						>
							<option value=''>Select stage</option>
							{FUNDING_STAGE_OPTIONS.map((option) => (
								<option key={option.value} value={option.value}>
									{option.label}
								</option>
							))}
						</select>
					</div>

					{/* Location */}
					<div>
						<label className='block text-sm font-medium text-gray-700 mb-2'>
							<MapPin className='inline h-4 w-4 mr-1' />
							Location
						</label>
						<input
							type='text'
							value={formData.location}
							onChange={(e) =>
								handleChange('location', e.target.value)
							}
							className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
							placeholder='City, State/Country'
						/>
					</div>

					{/* Notes */}
					<div className='md:col-span-2'>
						<label className='block text-sm font-medium text-gray-700 mb-2'>
							Notes
						</label>
						<textarea
							value={formData.notes}
							onChange={(e) =>
								handleChange('notes', e.target.value)
							}
							rows={4}
							className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
							placeholder='Additional notes about the company...'
						/>
					</div>
				</div>

				{/* Actions */}
				<div className='flex items-center justify-end space-x-3 pt-6 border-t'>
					{onCancel && (
						<button
							type='button'
							onClick={onCancel}
							className='px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors'
						>
							Cancel
						</button>
					)}
					<button
						type='submit'
						disabled={isLoading}
						className='flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
					>
						<Save className='h-4 w-4' />
						<span>{isLoading ? 'Saving...' : 'Save Company'}</span>
					</button>
				</div>
			</form>
		</Card>
	);
}
