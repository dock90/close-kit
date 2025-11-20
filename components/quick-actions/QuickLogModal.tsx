'use client';

import React, { useState, useEffect } from 'react';
import {
	Mail,
	MessageSquare,
	Phone,
	DollarSign,
	Clock,
	X,
	Save,
	Building2,
	User,
} from 'lucide-react';
import { Card } from '@/components/ui/card';

type QuickActionType = 'email' | 'linkedin' | 'call' | 'deal' | 'reminder';

interface QuickLogModalProps {
	type: QuickActionType;
	onClose: () => void;
}

interface Company {
	id: string;
	name: string;
}

interface Contact {
	id: string;
	firstName: string;
	lastName: string;
	companyId: string;
}

interface Deal {
	id: string;
	name: string;
	companyId: string;
}

export function QuickLogModal({ type, onClose }: QuickLogModalProps) {
	const [isLoading, setIsLoading] = useState(false);
	const [companies, setCompanies] = useState<Company[]>([]);
	const [contacts, setContacts] = useState<Contact[]>([]);
	const [deals, setDeals] = useState<Deal[]>([]);

	const [formData, setFormData] = useState({
		companyId: '',
		contactId: '',
		dealId: '',
		subject: '',
		notes: '',
		value: '',
		scheduledDate: '',
	});

	useEffect(() => {
		fetchData();
	}, []);

	const fetchData = async () => {
		try {
			const [companiesRes, contactsRes, dealsRes] = await Promise.all([
				fetch('/api/companies'),
				fetch('/api/contacts'),
				fetch('/api/deals'),
			]);

			if (companiesRes.ok) {
				const companiesData = await companiesRes.json();
				setCompanies(companiesData);
			}
			if (contactsRes.ok) {
				const contactsData = await contactsRes.json();
				setContacts(contactsData);
			}
			if (dealsRes.ok) {
				const dealsData = await dealsRes.json();
				setDeals(dealsData);
			}
		} catch (error) {
			console.error('Error fetching data:', error);
		}
	};

	const getModalConfig = () => {
		switch (type) {
			case 'email':
				return {
					title: 'Log Email Sent',
					icon: Mail,
					color: 'text-blue-600',
					activityType: 'email_sent',
				};
			case 'linkedin':
				return {
					title: 'Log LinkedIn Message',
					icon: MessageSquare,
					color: 'text-indigo-600',
					activityType: 'linkedin_message',
				};
			case 'call':
				return {
					title: 'Log Call',
					icon: Phone,
					color: 'text-green-600',
					activityType: 'call',
				};
			case 'deal':
				return {
					title: 'Create New Deal',
					icon: DollarSign,
					color: 'text-purple-600',
					activityType: null,
				};
			case 'reminder':
				return {
					title: 'Add Follow-Up Reminder',
					icon: Clock,
					color: 'text-orange-600',
					activityType: null,
				};
		}
	};

	const config = getModalConfig();
	const filteredContacts = contacts.filter(
		(contact) =>
			!formData.companyId || contact.companyId === formData.companyId
	);
	const filteredDeals = deals.filter(
		(deal) => !formData.companyId || deal.companyId === formData.companyId
	);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		console.log('Form submitted, type:', type);
		console.log('Form data:', formData);
		setIsLoading(true);

		try {
			if (type === 'deal') {
			// Create deal
			const response = await fetch('/api/deals', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					name: formData.subject,
					value: parseInt(formData.value),
					stage: 'lead',
					companyId: formData.companyId,
					contactId: formData.contactId,
				}),
			});

			if (!response.ok) {
				const errorData = await response.json();
				console.error('Failed to create deal:', errorData);
				throw new Error('Failed to create deal');
			}

			// Dispatch custom event to notify components to refresh
			window.dispatchEvent(new CustomEvent('dealCreated'));
		} else if (type === 'reminder') {
				// Create reminder
				console.log('Creating reminder with data:', {
					type: 'custom',
					title: formData.subject,
					description: formData.notes,
					dueDate: formData.scheduledDate,
					contactId: formData.contactId,
					dealId: formData.dealId,
				});

				const response = await fetch('/api/reminders', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						type: 'custom',
						title: formData.subject,
						description: formData.notes,
						dueDate: new Date(formData.scheduledDate).toISOString(),
						contactId: formData.contactId || undefined,
						dealId: formData.dealId || undefined,
					}),
				});

				if (!response.ok) {
					const errorData = await response.json();
					console.error('Failed to create reminder:', errorData);
					throw new Error('Failed to create reminder');
				}

			const reminderResult = await response.json();
			console.log('Reminder created successfully:', reminderResult);

			// Dispatch custom event to notify ReminderBell to refresh
			window.dispatchEvent(new CustomEvent('reminderCreated'));
		} else {
				// Log activity
				const response = await fetch('/api/activities', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						type: config.activityType,
						subject: formData.subject,
						notes: formData.notes,
						status: 'completed',
						completedDate: new Date().toISOString(),
						companyId: formData.companyId || undefined,
						contactId: formData.contactId || undefined,
						dealId: formData.dealId || undefined,
					}),
				});

				if (!response.ok) {
					const errorData = await response.json();
					console.error('Failed to log activity:', errorData);
					throw new Error('Failed to log activity');
				}

			const activityResult = await response.json();
			console.log('Activity logged successfully:', activityResult);

			// Dispatch custom event to notify components to refresh
			window.dispatchEvent(new CustomEvent('activityCreated'));
		}

		// Show success message
		alert(type === 'reminder' ? 'Reminder created successfully!' : type === 'deal' ? 'Deal created successfully!' : 'Activity logged successfully!');
		onClose();
		} catch (error) {
			console.error('Error:', error);
			alert(`Failed to save: ${error instanceof Error ? error.message : 'Unknown error'}. Check console for details.`);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
			<Card className='w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto'>
				<form onSubmit={handleSubmit} className='space-y-4'>
					{/* Header */}
					<div className='flex items-center justify-between mb-4'>
						<div className='flex items-center space-x-3'>
							<config.icon className={`h-6 w-6 ${config.color}`} />
							<h2 className='text-xl font-semibold text-gray-900'>
								{config.title}
							</h2>
						</div>
						<button
							type='button'
							onClick={onClose}
							className='p-2 text-gray-400 hover:text-gray-600'
						>
							<X className='h-5 w-5' />
						</button>
					</div>

					{/* Company */}
					<div>
						<label className='block text-sm font-medium text-gray-700 mb-2'>
							<Building2 className='inline h-4 w-4 mr-1' />
							Company {type !== 'reminder' && '*'}
						</label>
						<select
							required={type !== 'reminder'}
							value={formData.companyId}
							onChange={(e) => {
								setFormData({
									...formData,
									companyId: e.target.value,
									contactId: '',
									dealId: '',
								});
							}}
							className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
						>
							<option value=''>Select company</option>
							{companies.map((company) => (
								<option key={company.id} value={company.id}>
									{company.name}
								</option>
							))}
						</select>
					</div>

					{/* Contact */}
					<div>
						<label className='block text-sm font-medium text-gray-700 mb-2'>
							<User className='inline h-4 w-4 mr-1' />
							Contact {type !== 'reminder' && '*'}
						</label>
						<select
							required={type !== 'reminder'}
							value={formData.contactId}
							onChange={(e) =>
								setFormData({
									...formData,
									contactId: e.target.value,
								})
							}
							disabled={!formData.companyId}
							className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100'
						>
							<option value=''>Select contact</option>
							{filteredContacts.map((contact) => (
								<option key={contact.id} value={contact.id}>
									{contact.firstName} {contact.lastName}
								</option>
							))}
						</select>
					</div>

					{/* Deal (Optional for activities) */}
					{type !== 'deal' && type !== 'reminder' && (
						<div>
							<label className='block text-sm font-medium text-gray-700 mb-2'>
								<DollarSign className='inline h-4 w-4 mr-1' />
								Deal (Optional)
							</label>
							<select
								value={formData.dealId}
								onChange={(e) =>
									setFormData({
										...formData,
										dealId: e.target.value,
									})
								}
								disabled={!formData.companyId}
								className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100'
							>
								<option value=''>Select deal (optional)</option>
								{filteredDeals.map((deal) => (
									<option key={deal.id} value={deal.id}>
										{deal.name}
									</option>
								))}
							</select>
						</div>
					)}

					{/* Subject/Name */}
					<div>
						<label className='block text-sm font-medium text-gray-700 mb-2'>
							{type === 'deal' ? 'Deal Name' : 'Subject'} *
						</label>
						<input
							type='text'
							required
							value={formData.subject}
							onChange={(e) =>
								setFormData({
									...formData,
									subject: e.target.value,
								})
							}
							className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
							placeholder={
								type === 'deal'
									? 'Enter deal name'
									: 'Enter subject'
							}
						/>
					</div>

					{/* Deal Value */}
					{type === 'deal' && (
						<div>
							<label className='block text-sm font-medium text-gray-700 mb-2'>
								Deal Value ($) *
							</label>
							<input
								type='number'
								required
								min='0'
								step='0.01'
								value={formData.value}
								onChange={(e) =>
									setFormData({
										...formData,
										value: e.target.value,
									})
								}
								className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
								placeholder='Enter deal value'
							/>
						</div>
					)}

					{/* Scheduled Date for Reminder */}
					{type === 'reminder' && (
						<div>
							<label className='block text-sm font-medium text-gray-700 mb-2'>
								Due Date *
							</label>
							<input
								type='date'
								required
								min={new Date().toISOString().split('T')[0]}
								value={formData.scheduledDate}
								onChange={(e) =>
									setFormData({
										...formData,
										scheduledDate: e.target.value,
									})
								}
								className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
							/>
						</div>
					)}

					{/* Notes */}
					<div>
						<label className='block text-sm font-medium text-gray-700 mb-2'>
							{type === 'reminder' ? 'Description' : 'Notes'}
						</label>
						<textarea
							value={formData.notes}
							onChange={(e) =>
								setFormData({ ...formData, notes: e.target.value })
							}
							rows={3}
							className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
							placeholder='Add any additional details...'
						/>
					</div>

					{/* Actions */}
					<div className='flex items-center justify-end space-x-3 pt-4 border-t'>
						<button
							type='button'
							onClick={onClose}
							className='px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors'
						>
							Cancel
						</button>
						<button
							type='submit'
							disabled={isLoading}
							className='flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
						>
							<Save className='h-4 w-4' />
							<span>{isLoading ? 'Saving...' : 'Save'}</span>
						</button>
					</div>
				</form>
			</Card>
		</div>
	);
}
