import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import {
	DollarSign,
	Calendar,
	Building2,
	User,
	Save,
	X,
	TrendingUp,
	Clock,
} from 'lucide-react';
import {
	useCompanyStore,
	DealStage,
	ServiceType,
	ProjectDuration,
} from '@/lib/stores';

interface DealFormData {
	name: string;
	value: number;
	stage: DealStage;
	probability: number;
	expectedCloseDate?: string;
	actualCloseDate?: string;
	serviceType: ServiceType | '';
	projectDuration: ProjectDuration | '';
	lostReason: string;
	companyId: string;
	contactId: string;
}

interface DealFormProps {
	initialData?: Partial<DealFormData>;
	onSubmit: (data: DealFormData) => void;
	onCancel?: () => void;
	isLoading?: boolean;
}

const STAGE_OPTIONS: { value: DealStage; label: string }[] = [
	{ value: 'lead', label: 'Lead' },
	{ value: 'contacted', label: 'Contacted' },
	{ value: 'discovery', label: 'Discovery' },
	{ value: 'proposal', label: 'Proposal' },
	{ value: 'negotiation', label: 'Negotiation' },
	{ value: 'closed_won', label: 'Closed Won' },
	{ value: 'closed_lost', label: 'Closed Lost' },
];

const SERVICE_TYPE_OPTIONS: { value: ServiceType; label: string }[] = [
	{ value: 'nextjs_sanity', label: 'Next.js + Sanity' },
	{ value: 'hydrogen_sanity', label: 'Hydrogen + Sanity' },
	{ value: 'custom', label: 'Custom Development' },
];

const PROJECT_DURATION_OPTIONS: { value: ProjectDuration; label: string }[] = [
	{ value: '6-8 weeks', label: '6-8 weeks' },
	{ value: '8-10 weeks', label: '8-10 weeks' },
];

export function DealForm({
	initialData = {},
	onSubmit,
	onCancel,
	isLoading = false,
}: DealFormProps) {
	const { companies, getFilteredCompanies } = useCompanyStore();
	const [formData, setFormData] = useState<DealFormData>({
		name: '',
		value: 0,
		stage: 'lead',
		probability: 50,
		expectedCloseDate: undefined,
		actualCloseDate: undefined,
		serviceType: '',
		projectDuration: '',
		lostReason: '',
		companyId: '',
		contactId: '',
		...initialData,
	});

	const [errors, setErrors] = useState<Partial<DealFormData>>({});

	// Get contacts for the selected company
	const selectedCompany = companies.find((c) => c.id === formData.companyId);
	const contacts = selectedCompany?.contacts || [];

	const handleChange = (
		field: keyof DealFormData,
		value: string | number | undefined
	) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		if (errors[field]) {
			setErrors((prev) => ({ ...prev, [field]: undefined }));
		}
	};

	const validateForm = () => {
		const newErrors: Partial<DealFormData> = {};

		if (!formData.name.trim()) {
			newErrors.name = 'Deal name is required';
		}

		if (formData.value <= 0) {
			newErrors.value = 'Deal value must be greater than 0';
		}

		if (!formData.companyId) {
			newErrors.companyId = 'Company is required';
		}

		if (!formData.contactId) {
			newErrors.contactId = 'Contact is required';
		}

		if (formData.probability < 0 || formData.probability > 100) {
			newErrors.probability = 'Probability must be between 0 and 100';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (validateForm()) {
			onSubmit(formData);
		}
	};

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			minimumFractionDigits: 0,
			maximumFractionDigits: 0,
		}).format(amount);
	};

	const filteredContacts = contacts.filter(
		(contact) =>
			!formData.companyId || contact.companyId === formData.companyId
	);

	const isClosedStage = ['closed_won', 'closed_lost'].includes(
		formData.stage
	);

	return (
		<Card className='p-6'>
			<form onSubmit={handleSubmit} className='space-y-6'>
				<div className='flex items-center justify-between'>
					<div className='flex items-center space-x-3'>
						<DollarSign className='h-6 w-6 text-green-600' />
						<h2 className='text-xl font-semibold text-gray-900'>
							{initialData.name ? 'Edit Deal' : 'Add Deal'}
						</h2>
					</div>
					{onCancel && (
						<button
							type='button'
							onClick={onCancel}
							className='p-2 text-gray-400 hover:text-gray-600 touch-manipulation'
							style={{ minHeight: '44px', minWidth: '44px' }}
						>
							<X className='h-5 w-5' />
						</button>
					)}
				</div>

				<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
					{/* Deal Name */}
					<div className='md:col-span-2'>
						<label className='block text-sm font-medium text-gray-700 mb-2'>
							Deal Name *
						</label>
						<input
							type='text'
							value={formData.name}
							onChange={(e) =>
								handleChange('name', e.target.value)
							}
							className={`w-full px-3 py-3 lg:py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent touch-manipulation ${
								errors.name
									? 'border-red-300'
									: 'border-gray-300'
							}`}
							placeholder='Enter deal name'
						/>
						{errors.name && (
							<p className='mt-1 text-sm text-red-600'>
								{errors.name}
							</p>
						)}
					</div>

					{/* Deal Value */}
					<div>
						<label className='block text-sm font-medium text-gray-700 mb-2'>
							<DollarSign className='inline h-4 w-4 mr-1' />
							Deal Value *
						</label>
						<div className='relative'>
							<span className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500'>
								$
							</span>
							<input
								type='number'
								value={formData.value}
								onChange={(e) =>
									handleChange(
										'value',
										parseInt(e.target.value) || 0
									)
								}
								className={`w-full pl-8 pr-3 py-3 lg:py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent touch-manipulation ${
									errors.value
										? 'border-red-300'
										: 'border-gray-300'
								}`}
								placeholder='0'
								min='0'
								step='1000'
							/>
						</div>
						{errors.value && (
							<p className='mt-1 text-sm text-red-600'>
								{errors.value}
							</p>
						)}
						<p className='mt-1 text-xs text-gray-500'>
							{formatCurrency(formData.value)}
						</p>
					</div>

					{/* Probability */}
					<div>
						<label className='block text-sm font-medium text-gray-700 mb-2'>
							<TrendingUp className='inline h-4 w-4 mr-1' />
							Probability (%)
						</label>
						<input
							type='number'
							value={formData.probability}
							onChange={(e) =>
								handleChange(
									'probability',
									parseInt(e.target.value) || 0
								)
							}
							className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
								errors.probability
									? 'border-red-300'
									: 'border-gray-300'
							}`}
							min='0'
							max='100'
						/>
						{errors.probability && (
							<p className='mt-1 text-sm text-red-600'>
								{errors.probability}
							</p>
						)}
					</div>

					{/* Stage */}
					<div>
						<label className='block text-sm font-medium text-gray-700 mb-2'>
							Stage
						</label>
						<select
							value={formData.stage}
							onChange={(e) =>
								handleChange('stage', e.target.value)
							}
							className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
						>
							{STAGE_OPTIONS.map((option) => (
								<option key={option.value} value={option.value}>
									{option.label}
								</option>
							))}
						</select>
					</div>

					{/* Company */}
					<div>
						<label className='block text-sm font-medium text-gray-700 mb-2'>
							<Building2 className='inline h-4 w-4 mr-1' />
							Company *
						</label>
						<select
							value={formData.companyId}
							onChange={(e) => {
								handleChange('companyId', e.target.value);
								handleChange('contactId', ''); // Reset contact when company changes
							}}
							className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
								errors.companyId
									? 'border-red-300'
									: 'border-gray-300'
							}`}
						>
							<option value=''>Select company</option>
							{companies.map((company) => (
								<option key={company.id} value={company.id}>
									{company.name}
								</option>
							))}
						</select>
						{errors.companyId && (
							<p className='mt-1 text-sm text-red-600'>
								{errors.companyId}
							</p>
						)}
					</div>

					{/* Contact */}
					<div>
						<label className='block text-sm font-medium text-gray-700 mb-2'>
							<User className='inline h-4 w-4 mr-1' />
							Contact *
						</label>
						<select
							value={formData.contactId}
							onChange={(e) =>
								handleChange('contactId', e.target.value)
							}
							className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
								errors.contactId
									? 'border-red-300'
									: 'border-gray-300'
							}`}
							disabled={!formData.companyId}
						>
							<option value=''>Select contact</option>
							{filteredContacts.map((contact) => (
								<option key={contact.id} value={contact.id}>
									{contact.firstName} {contact.lastName}
								</option>
							))}
						</select>
						{errors.contactId && (
							<p className='mt-1 text-sm text-red-600'>
								{errors.contactId}
							</p>
						)}
						{!formData.companyId && (
							<p className='mt-1 text-xs text-gray-500'>
								Select a company first
							</p>
						)}
					</div>

					{/* Expected Close Date */}
					{!isClosedStage && (
						<div>
							<label className='block text-sm font-medium text-gray-700 mb-2'>
								<Calendar className='inline h-4 w-4 mr-1' />
								Expected Close Date
							</label>
							<input
								type='date'
								value={formData.expectedCloseDate || ''}
								onChange={(e) =>
									handleChange(
										'expectedCloseDate',
										e.target.value || undefined
									)
								}
								className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
							/>
						</div>
					)}

					{/* Actual Close Date */}
					{isClosedStage && (
						<div>
							<label className='block text-sm font-medium text-gray-700 mb-2'>
								<Calendar className='inline h-4 w-4 mr-1' />
								Actual Close Date
							</label>
							<input
								type='date'
								value={formData.actualCloseDate || ''}
								onChange={(e) =>
									handleChange(
										'actualCloseDate',
										e.target.value || undefined
									)
								}
								className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
							/>
						</div>
					)}

					{/* Service Type */}
					<div>
						<label className='block text-sm font-medium text-gray-700 mb-2'>
							Service Type
						</label>
						<select
							value={formData.serviceType}
							onChange={(e) =>
								handleChange('serviceType', e.target.value)
							}
							className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
						>
							<option value=''>Select service type</option>
							{SERVICE_TYPE_OPTIONS.map((option) => (
								<option key={option.value} value={option.value}>
									{option.label}
								</option>
							))}
						</select>
					</div>

					{/* Project Duration */}
					<div>
						<label className='block text-sm font-medium text-gray-700 mb-2'>
							<Clock className='inline h-4 w-4 mr-1' />
							Project Duration
						</label>
						<select
							value={formData.projectDuration}
							onChange={(e) =>
								handleChange('projectDuration', e.target.value)
							}
							className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
						>
							<option value=''>Select duration</option>
							{PROJECT_DURATION_OPTIONS.map((option) => (
								<option key={option.value} value={option.value}>
									{option.label}
								</option>
							))}
						</select>
					</div>

					{/* Lost Reason */}
					{formData.stage === 'closed_lost' && (
						<div className='md:col-span-2'>
							<label className='block text-sm font-medium text-gray-700 mb-2'>
								Lost Reason
							</label>
							<textarea
								value={formData.lostReason}
								onChange={(e) =>
									handleChange('lostReason', e.target.value)
								}
								rows={3}
								className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
								placeholder='Why was this deal lost?'
							/>
						</div>
					)}
				</div>

				{/* Actions */}
				<div className='flex items-center justify-end space-x-3 pt-6 border-t'>
					{onCancel && (
						<button
							type='button'
							onClick={onCancel}
							className='px-4 py-3 lg:py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors touch-manipulation'
							style={{ minHeight: '44px' }}
						>
							Cancel
						</button>
					)}
					<button
						type='submit'
						disabled={isLoading}
						className='flex items-center space-x-2 bg-blue-600 text-white px-4 py-3 lg:py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors touch-manipulation'
						style={{ minHeight: '44px' }}
					>
						<Save className='h-4 w-4' />
						<span>{isLoading ? 'Saving...' : 'Save Deal'}</span>
					</button>
				</div>
			</form>
		</Card>
	);
}
