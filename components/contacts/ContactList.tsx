'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { ContactCard } from './ContactCard';
import { PullToRefresh } from '@/components/ui/pull-to-refresh';
import { FilterDrawer } from '@/components/ui/filter-drawer';
import { Search, Filter, Plus, User } from 'lucide-react';

interface Contact {
	id: string;
	firstName: string;
	lastName: string;
	email?: string | null;
	phone?: string | null;
	title?: string | null;
	linkedinUrl?: string | null;
	companyId: string;
	company?: {
		id: string;
		name: string;
	};
	createdAt: string;
	updatedAt: string;
	_count?: {
		deals: number;
		activities: number;
	};
}

interface ContactListProps {
	onContactSelect?: (contact: Contact) => void;
	onContactCreate?: () => void;
	onContactEdit?: (contact: Contact) => void;
	onContactDelete?: (contact: Contact) => void;
}

export function ContactList({
	onContactSelect,
	onContactCreate,
	onContactEdit,
	onContactDelete,
}: ContactListProps) {
	const [contacts, setContacts] = useState<Contact[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [searchTerm, setSearchTerm] = useState('');
	const [companyFilter, setCompanyFilter] = useState('all');
	const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
	const [isRefreshing, setIsRefreshing] = useState(false);

	// Fetch contacts from API
	const fetchContacts = async () => {
		try {
			setLoading(true);
			setError(null);

			const params = new URLSearchParams();
			if (searchTerm) {
				params.append('search', searchTerm);
			}
			if (companyFilter !== 'all') {
				params.append('companyId', companyFilter);
			}

			const response = await fetch(`/api/contacts?${params.toString()}`);
			if (!response.ok) {
				throw new Error('Failed to fetch contacts');
			}

			const data = await response.json();
			setContacts(data);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'An error occurred');
		} finally {
			setLoading(false);
		}
	};

	// Fetch contacts on mount and when filters change
	useEffect(() => {
		fetchContacts();
	}, [searchTerm, companyFilter]);

	const handleRefresh = async () => {
		setIsRefreshing(true);
		await fetchContacts();
		setIsRefreshing(false);
	};

	// Get unique companies for filter
	const companies = Array.from(
		new Map(
			contacts
				.filter((c) => c.company)
				.map((c) => [c.company!.id, c.company!])
		).values()
	);

	const formatDate = (date: string) => {
		return new Intl.DateTimeFormat('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
		}).format(new Date(date));
	};

	if (loading && !isRefreshing) {
		return (
			<div className='flex items-center justify-center py-12'>
				<div className='text-center'>
					<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
					<p className='text-gray-600'>Loading contacts...</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<Card className='p-12 text-center'>
				<div className='text-red-600 mb-4'>
					<svg
						className='h-12 w-12 mx-auto'
						fill='none'
						stroke='currentColor'
						viewBox='0 0 24 24'
					>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={2}
							d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
						/>
					</svg>
				</div>
				<h3 className='text-lg font-medium text-gray-900 mb-2'>
					Error loading contacts
				</h3>
				<p className='text-gray-500 mb-4'>{error}</p>
				<button
					onClick={fetchContacts}
					className='bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors'
				>
					Try Again
				</button>
			</Card>
		);
	}

	return (
		<PullToRefresh onRefresh={handleRefresh}>
			<div className='space-y-6'>
				{/* Header */}
				<div className='flex items-center justify-between'>
					<div>
						<h2 className='text-2xl font-bold text-gray-900'>
							Contacts
						</h2>
						<p className='text-gray-600'>
							{contacts.length} total contacts
						</p>
					</div>
					<button
						onClick={onContactCreate}
						className='flex items-center space-x-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors touch-manipulation'
						style={{ minHeight: '44px' }}
					>
						<Plus className='h-5 w-5' />
						<span className='hidden sm:inline'>Add Contact</span>
					</button>
				</div>

				{/* Mobile Search & Filter Button */}
				<div className='lg:hidden'>
					<Card className='p-4'>
						<div className='flex gap-2'>
							<div className='flex-1 relative'>
								<Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400' />
								<input
									type='text'
									placeholder='Search contacts...'
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent touch-manipulation'
									style={{ minHeight: '44px' }}
								/>
							</div>
							<button
								onClick={() => setIsFilterDrawerOpen(true)}
								className='flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors touch-manipulation'
								style={{ minHeight: '44px' }}
							>
								<Filter className='h-5 w-5 text-gray-600' />
							</button>
						</div>
					</Card>
				</div>

				{/* Desktop Filters */}
				<Card className='p-4 hidden lg:block'>
					<div className='flex flex-col md:flex-row gap-4'>
						<div className='flex-1'>
							<div className='relative'>
								<Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
								<input
									type='text'
									placeholder='Search contacts...'
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
								/>
							</div>
						</div>

						<div className='flex gap-2'>
							<select
								value={companyFilter}
								onChange={(e) => setCompanyFilter(e.target.value)}
								className='px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
							>
								<option value='all'>All Companies</option>
								{companies.map((company) => (
									<option key={company.id} value={company.id}>
										{company.name}
									</option>
								))}
							</select>
						</div>
					</div>
				</Card>

				{/* Filter Drawer for Mobile */}
				<FilterDrawer
					isOpen={isFilterDrawerOpen}
					onClose={() => setIsFilterDrawerOpen(false)}
					title='Filter Contacts'
				>
					<div className='space-y-4'>
						<div>
							<label className='block text-sm font-medium text-gray-700 mb-2'>
								Company
							</label>
							<select
								value={companyFilter}
								onChange={(e) => setCompanyFilter(e.target.value)}
								className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent touch-manipulation'
								style={{ minHeight: '44px' }}
							>
								<option value='all'>All Companies</option>
								{companies.map((company) => (
									<option key={company.id} value={company.id}>
										{company.name}
									</option>
								))}
							</select>
						</div>
					</div>
				</FilterDrawer>

				{/* Contact Grid */}
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20 lg:pb-6'>
					{contacts.map((contact) => (
						<ContactCard
							key={contact.id}
							contact={contact}
							onEdit={onContactEdit}
							onDelete={onContactDelete}
							onViewDetails={onContactSelect}
						/>
					))}
				</div>

				{contacts.length === 0 && (
					<Card className='p-12 text-center'>
						<User className='h-12 w-12 text-gray-400 mx-auto mb-4' />
						<h3 className='text-lg font-medium text-gray-900 mb-2'>
							No contacts found
						</h3>
						<p className='text-gray-500 mb-4'>
							{searchTerm || companyFilter !== 'all'
								? 'Try adjusting your search or filters'
								: 'Get started by adding your first contact'}
						</p>
						{!searchTerm && companyFilter === 'all' && (
							<button
								onClick={onContactCreate}
								className='bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors touch-manipulation'
								style={{ minHeight: '44px' }}
							>
								Add Contact
							</button>
						)}
					</Card>
				)}
			</div>
		</PullToRefresh>
	);
}
