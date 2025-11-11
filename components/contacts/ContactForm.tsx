import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import {
	User,
	Mail,
	Phone,
	Briefcase,
	ExternalLink,
	Building2,
	Save,
	X,
} from 'lucide-react';

interface ContactFormData {
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	title: string;
	linkedinUrl: string;
	companyId: string;
}

interface ContactFormErrors {
	firstName?: string;
	lastName?: string;
	email?: string;
	phone?: string;
	title?: string;
	linkedinUrl?: string;
	companyId?: string;
}

interface Company {
	id: string;
	name: string;
}

interface ContactFormProps {
	contact?: any;
	initialData?: Partial<ContactFormData>;
	onSubmit: (data: ContactFormData) => void;
	onCancel?: () => void;
	isLoading?: boolean;
}

export function ContactForm({
	contact,
	initialData = {},
	onSubmit,
	onCancel,
	isLoading = false,
}: ContactFormProps) {
	const [formData, setFormData] = useState<ContactFormData>({
		firstName: contact?.firstName || '',
		lastName: contact?.lastName || '',
		email: contact?.email || '',
		phone: contact?.phone || '',
		title: contact?.title || '',
		linkedinUrl: contact?.linkedinUrl || '',
		companyId: contact?.companyId || '',
		...initialData,
	});

	const [errors, setErrors] = useState<ContactFormErrors>({});
	const [companies, setCompanies] = useState<Company[]>([]);
	const [loadingCompanies, setLoadingCompanies] = useState(true);

	// Update form data when contact prop changes
	useEffect(() => {
		if (contact) {
			setFormData({
				firstName: contact.firstName || '',
				lastName: contact.lastName || '',
				email: contact.email || '',
				phone: contact.phone || '',
				title: contact.title || '',
				linkedinUrl: contact.linkedinUrl || '',
				companyId: contact.companyId || '',
				...initialData,
			});
		}
	}, [contact, initialData]);

	// Fetch companies for dropdown
	useEffect(() => {
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
				setLoadingCompanies(false);
			}
		};

		fetchCompanies();
	}, []);

	const handleChange = (field: keyof ContactFormData, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		if (errors[field]) {
			setErrors((prev) => ({ ...prev, [field]: undefined }));
		}
	};

	const validateForm = () => {
		const newErrors: ContactFormErrors = {};

		if (!formData.firstName.trim()) {
			newErrors.firstName = 'First name is required';
		}

		if (!formData.lastName.trim()) {
			newErrors.lastName = 'Last name is required';
		}

		if (!formData.companyId) {
			newErrors.companyId = 'Company is required';
		}

		if (formData.email && !isValidEmail(formData.email)) {
			newErrors.email = 'Please enter a valid email address';
		}

		if (formData.phone && !isValidPhone(formData.phone)) {
			newErrors.phone = 'Please enter a valid phone number';
		}

		if (formData.linkedinUrl && !isValidLinkedInUrl(formData.linkedinUrl)) {
			newErrors.linkedinUrl = 'Please enter a valid LinkedIn URL';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const isValidEmail = (email: string) => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	};

	const isValidPhone = (phone: string) => {
		const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
		return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
	};

	const isValidLinkedInUrl = (url: string) => {
		return (
			url.includes('linkedin.com/in/') ||
			url.includes('linkedin.com/company/')
		);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (validateForm()) {
			onSubmit(formData);
		}
	};

	return (
		<Card className='p-6'>
			<form onSubmit={handleSubmit} className='space-y-6'>
				<div className='flex items-center justify-between'>
					<div className='flex items-center space-x-3'>
						<User className='h-6 w-6 text-indigo-600' />
						<h2 className='text-xl font-semibold text-gray-900'>
							{contact ? 'Edit Contact' : 'Add Contact'}
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
					{/* First Name */}
					<div>
						<label className='block text-sm font-medium text-gray-700 mb-2'>
							First Name *
						</label>
						<input
							type='text'
							value={formData.firstName}
							onChange={(e) =>
								handleChange('firstName', e.target.value)
							}
							className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
								errors.firstName
									? 'border-red-300'
									: 'border-gray-300'
							}`}
							placeholder='Enter first name'
						/>
						{errors.firstName && (
							<p className='mt-1 text-sm text-red-600'>
								{errors.firstName}
							</p>
						)}
					</div>

					{/* Last Name */}
					<div>
						<label className='block text-sm font-medium text-gray-700 mb-2'>
							Last Name *
						</label>
						<input
							type='text'
							value={formData.lastName}
							onChange={(e) =>
								handleChange('lastName', e.target.value)
							}
							className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
								errors.lastName
									? 'border-red-300'
									: 'border-gray-300'
							}`}
							placeholder='Enter last name'
						/>
						{errors.lastName && (
							<p className='mt-1 text-sm text-red-600'>
								{errors.lastName}
							</p>
						)}
					</div>

					{/* Email */}
					<div>
						<label className='block text-sm font-medium text-gray-700 mb-2'>
							<Mail className='inline h-4 w-4 mr-1' />
							Email
						</label>
						<input
							type='email'
							value={formData.email}
							onChange={(e) =>
								handleChange('email', e.target.value)
							}
							className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
								errors.email
									? 'border-red-300'
									: 'border-gray-300'
							}`}
							placeholder='contact@company.com'
						/>
						{errors.email && (
							<p className='mt-1 text-sm text-red-600'>
								{errors.email}
							</p>
						)}
					</div>

					{/* Phone */}
					<div>
						<label className='block text-sm font-medium text-gray-700 mb-2'>
							<Phone className='inline h-4 w-4 mr-1' />
							Phone
						</label>
						<input
							type='tel'
							value={formData.phone}
							onChange={(e) =>
								handleChange('phone', e.target.value)
							}
							className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
								errors.phone
									? 'border-red-300'
									: 'border-gray-300'
							}`}
							placeholder='+1 (555) 123-4567'
						/>
						{errors.phone && (
							<p className='mt-1 text-sm text-red-600'>
								{errors.phone}
							</p>
						)}
					</div>

					{/* Title */}
					<div>
						<label className='block text-sm font-medium text-gray-700 mb-2'>
							<Briefcase className='inline h-4 w-4 mr-1' />
							Title
						</label>
						<input
							type='text'
							value={formData.title}
							onChange={(e) =>
								handleChange('title', e.target.value)
							}
							className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
							placeholder='CEO, CTO, etc.'
						/>
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
							className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
								errors.linkedinUrl
									? 'border-red-300'
									: 'border-gray-300'
							}`}
							placeholder='linkedin.com/in/username'
						/>
						{errors.linkedinUrl && (
							<p className='mt-1 text-sm text-red-600'>
								{errors.linkedinUrl}
							</p>
						)}
					</div>

					{/* Company */}
					<div className='md:col-span-2'>
						<label className='block text-sm font-medium text-gray-700 mb-2'>
							<Building2 className='inline h-4 w-4 mr-1' />
							Company *
						</label>
						<select
							value={formData.companyId}
							onChange={(e) =>
								handleChange('companyId', e.target.value)
							}
							className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
								errors.companyId
									? 'border-red-300'
									: 'border-gray-300'
							}`}
							disabled={loadingCompanies}
						>
							<option value=''>
								{loadingCompanies
									? 'Loading companies...'
									: 'Select company'}
							</option>
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
						disabled={isLoading || loadingCompanies}
						className='flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
					>
						<Save className='h-4 w-4' />
						<span>{isLoading ? 'Saving...' : 'Save Contact'}</span>
					</button>
				</div>
			</form>
		</Card>
	);
}
