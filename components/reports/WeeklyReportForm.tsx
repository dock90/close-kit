import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import {
	Mail,
	MessageSquare,
	Phone,
	Calendar,
	FileText,
	DollarSign,
	Save,
	X,
	TrendingUp,
	AlertTriangle,
} from 'lucide-react';

interface WeeklyReportFormData {
	weekStartDate: Date;
	weekEndDate: Date;
	emailsSent: number;
	linkedinMessages: number;
	callsBooked: number;
	proposalsSent: number;
	dealsClosed: number;
	revenueGenerated: number;
	roadblocks: string;
}

interface WeeklyReportFormProps {
	initialData?: Partial<WeeklyReportFormData>;
	onSubmit: (data: WeeklyReportFormData) => void;
	onCancel?: () => void;
	isLoading?: boolean;
}

export function WeeklyReportForm({
	initialData = {},
	onSubmit,
	onCancel,
	isLoading = false,
}: WeeklyReportFormProps) {
	const [formData, setFormData] = useState<WeeklyReportFormData>({
		weekStartDate: new Date(),
		weekEndDate: new Date(),
		emailsSent: 0,
		linkedinMessages: 0,
		callsBooked: 0,
		proposalsSent: 0,
		dealsClosed: 0,
		revenueGenerated: 0,
		roadblocks: '',
		...initialData,
	});

	const [errors, setErrors] = useState<Partial<WeeklyReportFormData>>({});

	const handleChange = (
		field: keyof WeeklyReportFormData,
		value: string | number | Date
	) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		if (errors[field]) {
			setErrors((prev) => ({ ...prev, [field]: undefined }));
		}
	};

	const validateForm = () => {
		const newErrors: Partial<WeeklyReportFormData> = {};

		if (!formData.weekStartDate) {
			newErrors.weekStartDate = 'Week start date is required';
		}

		if (!formData.weekEndDate) {
			newErrors.weekEndDate = 'Week end date is required';
		}

		if (
			formData.weekStartDate &&
			formData.weekEndDate &&
			formData.weekStartDate >= formData.weekEndDate
		) {
			newErrors.weekEndDate = 'Week end date must be after start date';
		}

		if (formData.emailsSent < 0) {
			newErrors.emailsSent = 'Emails sent cannot be negative';
		}

		if (formData.linkedinMessages < 0) {
			newErrors.linkedinMessages = 'LinkedIn messages cannot be negative';
		}

		if (formData.callsBooked < 0) {
			newErrors.callsBooked = 'Calls booked cannot be negative';
		}

		if (formData.proposalsSent < 0) {
			newErrors.proposalsSent = 'Proposals sent cannot be negative';
		}

		if (formData.dealsClosed < 0) {
			newErrors.dealsClosed = 'Deals closed cannot be negative';
		}

		if (formData.revenueGenerated < 0) {
			newErrors.revenueGenerated = 'Revenue generated cannot be negative';
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

	const formatDate = (date: Date) => {
		return new Intl.DateTimeFormat('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
		}).format(date);
	};

	const getWeekRange = () => {
		if (formData.weekStartDate && formData.weekEndDate) {
			return `${formatDate(formData.weekStartDate)} - ${formatDate(
				formData.weekEndDate
			)}`;
		}
		return '';
	};

	const totalActivities =
		formData.emailsSent +
		formData.linkedinMessages +
		formData.callsBooked +
		formData.proposalsSent;

	return (
		<Card className='p-6'>
			<form onSubmit={handleSubmit} className='space-y-6'>
				<div className='flex items-center justify-between'>
					<div className='flex items-center space-x-3'>
						<TrendingUp className='h-6 w-6 text-blue-600' />
						<h2 className='text-xl font-semibold text-gray-900'>
							{initialData.weekStartDate
								? 'Edit Weekly Report'
								: 'Weekly Report'}
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

				{/* Week Range */}
				<div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
					<h3 className='text-sm font-medium text-blue-800 mb-2'>
						Reporting Period
					</h3>
					<p className='text-sm text-blue-700'>{getWeekRange()}</p>
				</div>

				<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
					{/* Week Start Date */}
					<div>
						<label className='block text-sm font-medium text-gray-700 mb-2'>
							<Calendar className='inline h-4 w-4 mr-1' />
							Week Start Date *
						</label>
						<input
							type='date'
							value={
								formData.weekStartDate
									? formData.weekStartDate
											.toISOString()
											.split('T')[0]
									: ''
							}
							onChange={(e) =>
								handleChange(
									'weekStartDate',
									new Date(e.target.value)
								)
							}
							className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
								errors.weekStartDate
									? 'border-red-300'
									: 'border-gray-300'
							}`}
						/>
						{errors.weekStartDate && (
							<p className='mt-1 text-sm text-red-600'>
								{errors.weekStartDate}
							</p>
						)}
					</div>

					{/* Week End Date */}
					<div>
						<label className='block text-sm font-medium text-gray-700 mb-2'>
							<Calendar className='inline h-4 w-4 mr-1' />
							Week End Date *
						</label>
						<input
							type='date'
							value={
								formData.weekEndDate
									? formData.weekEndDate
											.toISOString()
											.split('T')[0]
									: ''
							}
							onChange={(e) =>
								handleChange(
									'weekEndDate',
									new Date(e.target.value)
								)
							}
							className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
								errors.weekEndDate
									? 'border-red-300'
									: 'border-gray-300'
							}`}
						/>
						{errors.weekEndDate && (
							<p className='mt-1 text-sm text-red-600'>
								{errors.weekEndDate}
							</p>
						)}
					</div>

					{/* Emails Sent */}
					<div>
						<label className='block text-sm font-medium text-gray-700 mb-2'>
							<Mail className='inline h-4 w-4 mr-1' />
							Emails Sent
						</label>
						<input
							type='number'
							value={formData.emailsSent}
							onChange={(e) =>
								handleChange(
									'emailsSent',
									parseInt(e.target.value) || 0
								)
							}
							className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
								errors.emailsSent
									? 'border-red-300'
									: 'border-gray-300'
							}`}
							min='0'
						/>
						{errors.emailsSent && (
							<p className='mt-1 text-sm text-red-600'>
								{errors.emailsSent}
							</p>
						)}
					</div>

					{/* LinkedIn Messages */}
					<div>
						<label className='block text-sm font-medium text-gray-700 mb-2'>
							<MessageSquare className='inline h-4 w-4 mr-1' />
							LinkedIn Messages
						</label>
						<input
							type='number'
							value={formData.linkedinMessages}
							onChange={(e) =>
								handleChange(
									'linkedinMessages',
									parseInt(e.target.value) || 0
								)
							}
							className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
								errors.linkedinMessages
									? 'border-red-300'
									: 'border-gray-300'
							}`}
							min='0'
						/>
						{errors.linkedinMessages && (
							<p className='mt-1 text-sm text-red-600'>
								{errors.linkedinMessages}
							</p>
						)}
					</div>

					{/* Calls Booked */}
					<div>
						<label className='block text-sm font-medium text-gray-700 mb-2'>
							<Phone className='inline h-4 w-4 mr-1' />
							Calls Booked
						</label>
						<input
							type='number'
							value={formData.callsBooked}
							onChange={(e) =>
								handleChange(
									'callsBooked',
									parseInt(e.target.value) || 0
								)
							}
							className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
								errors.callsBooked
									? 'border-red-300'
									: 'border-gray-300'
							}`}
							min='0'
						/>
						{errors.callsBooked && (
							<p className='mt-1 text-sm text-red-600'>
								{errors.callsBooked}
							</p>
						)}
					</div>

					{/* Proposals Sent */}
					<div>
						<label className='block text-sm font-medium text-gray-700 mb-2'>
							<FileText className='inline h-4 w-4 mr-1' />
							Proposals Sent
						</label>
						<input
							type='number'
							value={formData.proposalsSent}
							onChange={(e) =>
								handleChange(
									'proposalsSent',
									parseInt(e.target.value) || 0
								)
							}
							className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
								errors.proposalsSent
									? 'border-red-300'
									: 'border-gray-300'
							}`}
							min='0'
						/>
						{errors.proposalsSent && (
							<p className='mt-1 text-sm text-red-600'>
								{errors.proposalsSent}
							</p>
						)}
					</div>

					{/* Deals Closed */}
					<div>
						<label className='block text-sm font-medium text-gray-700 mb-2'>
							<TrendingUp className='inline h-4 w-4 mr-1' />
							Deals Closed
						</label>
						<input
							type='number'
							value={formData.dealsClosed}
							onChange={(e) =>
								handleChange(
									'dealsClosed',
									parseInt(e.target.value) || 0
								)
							}
							className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
								errors.dealsClosed
									? 'border-red-300'
									: 'border-gray-300'
							}`}
							min='0'
						/>
						{errors.dealsClosed && (
							<p className='mt-1 text-sm text-red-600'>
								{errors.dealsClosed}
							</p>
						)}
					</div>

					{/* Revenue Generated */}
					<div>
						<label className='block text-sm font-medium text-gray-700 mb-2'>
							<DollarSign className='inline h-4 w-4 mr-1' />
							Revenue Generated
						</label>
						<div className='relative'>
							<span className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500'>
								$
							</span>
							<input
								type='number'
								value={formData.revenueGenerated}
								onChange={(e) =>
									handleChange(
										'revenueGenerated',
										parseInt(e.target.value) || 0
									)
								}
								className={`w-full pl-8 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
									errors.revenueGenerated
										? 'border-red-300'
										: 'border-gray-300'
								}`}
								min='0'
								step='1000'
							/>
						</div>
						{errors.revenueGenerated && (
							<p className='mt-1 text-sm text-red-600'>
								{errors.revenueGenerated}
							</p>
						)}
						<p className='mt-1 text-xs text-gray-500'>
							{formatCurrency(formData.revenueGenerated)}
						</p>
					</div>

					{/* Roadblocks */}
					<div className='md:col-span-2'>
						<label className='block text-sm font-medium text-gray-700 mb-2'>
							<AlertTriangle className='inline h-4 w-4 mr-1' />
							Roadblocks & Challenges
						</label>
						<textarea
							value={formData.roadblocks}
							onChange={(e) =>
								handleChange('roadblocks', e.target.value)
							}
							rows={4}
							className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
							placeholder='Describe any challenges or roadblocks you faced this week...'
						/>
					</div>
				</div>

				{/* Summary */}
				<div className='bg-gray-50 rounded-lg p-4'>
					<h3 className='text-sm font-medium text-gray-900 mb-2'>
						Week Summary
					</h3>
					<div className='grid grid-cols-2 md:grid-cols-4 gap-4 text-sm'>
						<div>
							<p className='text-gray-600'>Total Activities</p>
							<p className='font-semibold text-gray-900'>
								{totalActivities}
							</p>
						</div>
						<div>
							<p className='text-gray-600'>Deals Closed</p>
							<p className='font-semibold text-gray-900'>
								{formData.dealsClosed}
							</p>
						</div>
						<div>
							<p className='text-gray-600'>Revenue</p>
							<p className='font-semibold text-gray-900'>
								{formatCurrency(formData.revenueGenerated)}
							</p>
						</div>
						<div>
							<p className='text-gray-600'>Conversion Rate</p>
							<p className='font-semibold text-gray-900'>
								{totalActivities > 0
									? (
											(formData.dealsClosed /
												totalActivities) *
											100
									  ).toFixed(1)
									: 0}
								%
							</p>
						</div>
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
						<span>{isLoading ? 'Saving...' : 'Save Report'}</span>
					</button>
				</div>
			</form>
		</Card>
	);
}
