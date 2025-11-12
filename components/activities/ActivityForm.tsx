import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import {
	Mail,
	MessageSquare,
	Phone,
	Calendar,
	FileText,
	Clock,
	Save,
	X,
	Building2,
	User,
	DollarSign,
	Trash2,
} from 'lucide-react';

interface ActivityFormData {
	type: string;
	subject: string;
	notes: string;
	scheduledDate?: Date;
	completedDate?: Date;
	status: string;
	companyId: string;
	contactId: string;
	dealId: string;
}

interface ActivityFormErrors {
	type?: string;
	subject?: string;
	notes?: string;
	scheduledDate?: string;
	completedDate?: string;
	status?: string;
	companyId?: string;
	contactId?: string;
	dealId?: string;
}

interface ActivityFormProps {
	initialData?: Partial<ActivityFormData> & { id?: string };
	companies: Array<{ id: string; name: string }>;
	contacts: Array<{
		id: string;
		firstName: string;
		lastName: string;
		companyId: string | null;
	}>;
	deals: Array<{ id: string; name: string; companyId: string }>;
	onSubmit: (data: ActivityFormData) => void;
	onCancel?: () => void;
	onDelete?: () => void;
	isLoading?: boolean;
}

const ACTIVITY_TYPES = [
	{ value: 'email_sent', label: 'Email Sent', icon: Mail },
	{
		value: 'linkedin_request',
		label: 'LinkedIn Request',
		icon: MessageSquare,
	},
	{
		value: 'linkedin_message',
		label: 'LinkedIn Message',
		icon: MessageSquare,
	},
	{ value: 'call', label: 'Call', icon: Phone },
	{ value: 'meeting', label: 'Meeting', icon: Calendar },
	{ value: 'proposal_sent', label: 'Proposal Sent', icon: FileText },
	{ value: 'follow_up', label: 'Follow Up', icon: Clock },
	{ value: 'note', label: 'Note', icon: FileText },
];

const STATUS_OPTIONS = [
	{ value: 'scheduled', label: 'Scheduled' },
	{ value: 'completed', label: 'Completed' },
	{ value: 'cancelled', label: 'Cancelled' },
];

export function ActivityForm({
	initialData = {},
	companies,
	contacts,
	deals,
	onSubmit,
	onCancel,
	onDelete,
	isLoading = false,
}: ActivityFormProps) {
	const [formData, setFormData] = useState<ActivityFormData>({
		type: 'email_sent',
		subject: '',
		notes: '',
		scheduledDate: undefined,
		completedDate: undefined,
		status: 'completed',
		companyId: '',
		contactId: '',
		dealId: '',
		...initialData,
	});

	const [errors, setErrors] = useState<ActivityFormErrors>({});

	const handleChange = (
		field: keyof ActivityFormData,
		value: string | Date | undefined
	) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		if (errors[field as keyof ActivityFormErrors]) {
			setErrors((prev) => ({
				...prev,
				[field as keyof ActivityFormErrors]: undefined,
			}));
		}
	};

	const validateForm = () => {
		const newErrors: ActivityFormErrors = {};

		if (!formData.subject.trim()) {
			newErrors.subject = 'Subject is required';
		}

		if (!formData.companyId) {
			newErrors.companyId = 'Company is required';
		}

		if (!formData.contactId) {
			newErrors.contactId = 'Contact is required';
		}

		if (formData.status === 'scheduled' && !formData.scheduledDate) {
			newErrors.scheduledDate =
				'Scheduled date is required for scheduled activities';
		}

		if (formData.status === 'completed' && !formData.completedDate) {
			newErrors.completedDate =
				'Completed date is required for completed activities';
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

	const filteredContacts = contacts.filter(
		(contact) =>
			!formData.companyId || contact.companyId === formData.companyId
	);

	const filteredDeals = deals.filter(
		(deal) => !formData.companyId || deal.companyId === formData.companyId
	);

	const selectedActivityType = ACTIVITY_TYPES.find(
		(type) => type.value === formData.type
	);

	return (
		<Card className='p-6'>
			<form onSubmit={handleSubmit} className='space-y-6'>
				<div className='flex items-center justify-between'>
					<div className='flex items-center space-x-3'>
						{selectedActivityType && (
							<selectedActivityType.icon className='h-6 w-6 text-blue-600' />
						)}
						<h2 className='text-xl font-semibold text-gray-900'>
							{initialData.subject
								? 'Edit Activity'
								: 'Log Activity'}
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
					{/* Activity Type */}
					<div>
						<label className='block text-sm font-medium text-gray-700 mb-2'>
							Activity Type
						</label>
						<select
							value={formData.type}
							onChange={(e) =>
								handleChange('type', e.target.value)
							}
							className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
						>
							{ACTIVITY_TYPES.map((type) => (
								<option key={type.value} value={type.value}>
									{type.label}
								</option>
							))}
						</select>
					</div>

					{/* Status */}
					<div>
						<label className='block text-sm font-medium text-gray-700 mb-2'>
							Status
						</label>
						<select
							value={formData.status}
							onChange={(e) =>
								handleChange('status', e.target.value)
							}
							className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
						>
							{STATUS_OPTIONS.map((status) => (
								<option key={status.value} value={status.value}>
									{status.label}
								</option>
							))}
						</select>
					</div>

					{/* Subject */}
					<div className='md:col-span-2'>
						<label className='block text-sm font-medium text-gray-700 mb-2'>
							Subject *
						</label>
						<input
							type='text'
							value={formData.subject}
							onChange={(e) =>
								handleChange('subject', e.target.value)
							}
							className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
								errors.subject
									? 'border-red-300'
									: 'border-gray-300'
							}`}
							placeholder='Enter activity subject'
						/>
						{errors.subject && (
							<p className='mt-1 text-sm text-red-600'>
								{errors.subject}
							</p>
						)}
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
								handleChange('dealId', ''); // Reset deal when company changes
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

					{/* Deal */}
					<div>
						<label className='block text-sm font-medium text-gray-700 mb-2'>
							<DollarSign className='inline h-4 w-4 mr-1' />
							Deal (Optional)
						</label>
						<select
							value={formData.dealId}
							onChange={(e) =>
								handleChange('dealId', e.target.value)
							}
							className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
							disabled={!formData.companyId}
						>
							<option value=''>Select deal</option>
							{filteredDeals.map((deal) => (
								<option key={deal.id} value={deal.id}>
									{deal.name}
								</option>
							))}
						</select>
						{!formData.companyId && (
							<p className='mt-1 text-xs text-gray-500'>
								Select a company first
							</p>
						)}
					</div>

					{/* Scheduled Date */}
					{formData.status === 'scheduled' && (
						<div>
							<label className='block text-sm font-medium text-gray-700 mb-2'>
								<Calendar className='inline h-4 w-4 mr-1' />
								Scheduled Date *
							</label>
							<input
								type='datetime-local'
								value={
									formData.scheduledDate
										? formData.scheduledDate
												.toISOString()
												.slice(0, 16)
										: ''
								}
								onChange={(e) =>
									handleChange(
										'scheduledDate',
										e.target.value
											? new Date(e.target.value)
											: undefined
									)
								}
								className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
									errors.scheduledDate
										? 'border-red-300'
										: 'border-gray-300'
								}`}
							/>
							{errors.scheduledDate && (
								<p className='mt-1 text-sm text-red-600'>
									{errors.scheduledDate}
								</p>
							)}
						</div>
					)}

				{/* Completed Date */}
				{formData.status === 'completed' && (
					<div>
						<label className='block text-sm font-medium text-gray-700 mb-2'>
							<Clock className='inline h-4 w-4 mr-1' />
							Completed Date *
						</label>
						<div className='flex gap-2'>
							<input
								type='date'
								value={
									formData.completedDate
										? formData.completedDate
												.toISOString()
												.slice(0, 10)
										: ''
								}
								onChange={(e) =>
									handleChange(
										'completedDate',
										e.target.value
											? new Date(e.target.value)
											: undefined
									)
								}
								className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
									errors.completedDate
										? 'border-red-300'
										: 'border-gray-300'
								}`}
							/>
							<button
								type='button'
								onClick={() => handleChange('completedDate', new Date())}
								className='px-4 py-2 text-sm font-medium text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors whitespace-nowrap'
							>
								Today
							</button>
						</div>
						{errors.completedDate && (
							<p className='mt-1 text-sm text-red-600'>
								{errors.completedDate}
							</p>
						)}
					</div>
				)}

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
							placeholder='Add any additional notes about this activity...'
						/>
					</div>
				</div>

				{/* Actions */}
				<div className='flex items-center justify-between pt-6 border-t'>
					<div>
						{onDelete && initialData.id && (
							<button
								type='button'
								onClick={onDelete}
								className='flex items-center space-x-2 px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors'
								title='Delete activity'
							>
								<Trash2 className='h-4 w-4' />
								<span>Delete</span>
							</button>
						)}
					</div>
					<div className='flex items-center space-x-3'>
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
							<span>{isLoading ? 'Saving...' : 'Save Activity'}</span>
						</button>
					</div>
				</div>
			</form>
		</Card>
	);
}
