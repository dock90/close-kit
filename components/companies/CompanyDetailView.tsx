import React, { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { CompanyForm } from './CompanyForm';
import { Industry } from '@/lib/stores';
import {
	Building2,
	Globe,
	MapPin,
	Users,
	ExternalLink,
	DollarSign,
	Calendar,
	Edit,
	ArrowLeft,
	Mail,
	Phone,
	MessageSquare,
	FileText,
	Archive,
	ArchiveRestore,
} from 'lucide-react';

interface Company {
	id: string;
	name: string;
	website?: string;
	industry?: Industry | '';
	employeeCount?: string;
	fundingStage?: string;
	location?: string;
	linkedinUrl?: string;
	notes?: string;
	archived?: boolean;
	createdAt: Date;
	contacts?: Contact[];
	deals?: Deal[];
	activities?: Activity[];
}

interface Contact {
	id: string;
	firstName: string;
	lastName: string;
	email?: string;
	phone?: string;
	title?: string;
	linkedinUrl?: string;
}

interface Deal {
	id: string;
	name: string;
	value: number;
	stage: string;
	probability: number;
	expectedCloseDate?: Date;
	serviceType?: string;
	projectDuration?: string;
}

interface Activity {
	id: string;
	type: string;
	subject?: string;
	notes?: string;
	completedDate?: Date;
	scheduledDate?: Date;
	status: string;
	contact?: Contact;
}

interface CompanyDetailViewProps {
	company: Company;
	onBack?: () => void;
	onUpdate?: (companyData: any) => Promise<void>;
	onArchive?: (company: Company) => void;
	onUnarchive?: (company: Company) => void;
	onContactAdd?: (companyId: string) => void;
	onDealAdd?: (companyId: string) => void;
	onActivityAdd?: (companyId: string) => void;
	isUpdating?: boolean;
}

const TABS = [
	{ key: 'overview', label: 'Overview' },
	{ key: 'contacts', label: 'Contacts' },
	{ key: 'deals', label: 'Deals' },
	{ key: 'activities', label: 'Activities' },
];

export function CompanyDetailView({
	company,
	onBack,
	onUpdate,
	onArchive,
	onUnarchive,
	onContactAdd,
	onDealAdd,
	onActivityAdd,
	isUpdating = false,
}: CompanyDetailViewProps) {
	const [activeTab, setActiveTab] = useState('overview');
	const [isEditing, setIsEditing] = useState(false);

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

	const formatIndustry = (industry?: string) => {
		if (!industry) return 'Not specified';
		return industry.charAt(0).toUpperCase() + industry.slice(1);
	};

	const formatFundingStage = (stage?: string) => {
		if (!stage) return 'Not specified';
		return stage
			.split('-')
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');
	};

	const getDealStageColor = (stage: string) => {
		const colors = {
			lead: 'bg-gray-100 text-gray-800',
			contacted: 'bg-blue-100 text-blue-800',
			discovery: 'bg-yellow-100 text-yellow-800',
			proposal: 'bg-orange-100 text-orange-800',
			negotiation: 'bg-purple-100 text-purple-800',
			closed_won: 'bg-green-100 text-green-800',
			closed_lost: 'bg-red-100 text-red-800',
		};
		return (
			colors[stage as keyof typeof colors] || 'bg-gray-100 text-gray-800'
		);
	};

	const getActivityIcon = (type: string) => {
		const icons = {
			email_sent: Mail,
			linkedin_request: MessageSquare,
			linkedin_message: MessageSquare,
			call: Phone,
			meeting: Calendar,
			proposal_sent: FileText,
			follow_up: Calendar,
			note: FileText,
		};
		return icons[type as keyof typeof icons] || FileText;
	};

	const addUtmParams = (url: string) => {
		if (!url) return '';

		// Ensure the URL has a protocol
		const fullUrl = url.startsWith('http') ? url : `https://${url}`;

		try {
			const urlObj = new URL(fullUrl);
			urlObj.searchParams.set('utm_source', 'close-kit');
			urlObj.searchParams.set('utm_medium', 'crm');
			urlObj.searchParams.set('utm_campaign', 'company-profile');
			return urlObj.toString();
		} catch {
			return fullUrl;
		}
	};

	const totalDealValue =
		company.deals?.reduce((sum, deal) => sum + deal.value, 0) || 0;
	const activeDeals =
		company.deals?.filter(
			(deal) => !['closed_won', 'closed_lost'].includes(deal.stage)
		).length || 0;

	const handleUpdate = async (formData: any) => {
		if (onUpdate) {
			await onUpdate(formData);
			setIsEditing(false);
		}
	};

	if (isEditing) {
		// Convert Date to string for the form
		const companyForForm = {
			...company,
			createdAt: company.createdAt.toISOString(),
			updatedAt: company.createdAt.toISOString(),
		};

		return (
			<div className='space-y-6'>
				<div className='flex items-center justify-between mb-4'>
					<button
						onClick={() => setIsEditing(false)}
						className='flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors'
					>
						<ArrowLeft className='h-5 w-5' />
						<span>Back to Details</span>
					</button>
				</div>

				<CompanyForm
					company={companyForForm}
					onSubmit={handleUpdate}
					onCancel={() => setIsEditing(false)}
					isLoading={isUpdating}
				/>
			</div>
		);
	}

	return (
		<div className='space-y-6'>
			{/* Header */}
			<div className='flex items-center justify-between'>
				<div className='flex items-center space-x-4'>
					{onBack && (
						<button
							onClick={onBack}
							className='p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors'
						>
							<ArrowLeft className='h-5 w-5' />
						</button>
					)}
					<div className='flex items-center space-x-3'>
						<div className='w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center'>
							<Building2 className='h-6 w-6 text-blue-600' />
						</div>
						<div>
							<div className='flex items-center gap-3'>
								<h1 className='text-2xl font-bold text-gray-900'>
									{company.name}
								</h1>
								{company.archived && (
									<span className='text-sm bg-gray-200 text-gray-700 px-3 py-1 rounded'>
										Archived
									</span>
								)}
							</div>
							{company.website && (
								<div className='flex items-center space-x-1 text-sm text-gray-500'>
									<Globe className='h-3 w-3' />
									<a
										href={addUtmParams(company.website)}
										target='_blank'
										rel='noopener noreferrer'
										className='hover:text-blue-600 transition-colors'
									>
										{company.website}
									</a>
								</div>
							)}
						</div>
					</div>
				</div>

				<div className='flex items-center gap-2'>
					{company.archived ? (
						onUnarchive && (
							<button
								onClick={() => onUnarchive(company)}
								className='flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors'
							>
								<ArchiveRestore className='h-4 w-4' />
								<span>Unarchive</span>
							</button>
						)
					) : (
						<>
							{onUpdate && (
								<button
									onClick={() => setIsEditing(true)}
									className='flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors'
								>
									<Edit className='h-4 w-4' />
									<span>Edit</span>
								</button>
							)}
							{onArchive && (
								<button
									onClick={() => onArchive(company)}
									className='flex items-center space-x-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors'
								>
									<Archive className='h-4 w-4' />
									<span>Archive</span>
								</button>
							)}
						</>
					)}
				</div>
			</div>

			{/* Quick Stats */}
			<div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
				<Card className='p-4'>
					<div className='flex items-center space-x-3'>
						<Users className='h-8 w-8 text-blue-600' />
						<div>
							<p className='text-sm text-gray-600'>Contacts</p>
							<p className='text-xl font-semibold text-gray-900'>
								{company.contacts?.length || 0}
							</p>
						</div>
					</div>
				</Card>

				<Card className='p-4'>
					<div className='flex items-center space-x-3'>
						<DollarSign className='h-8 w-8 text-green-600' />
						<div>
							<p className='text-sm text-gray-600'>
								Active Deals
							</p>
							<p className='text-xl font-semibold text-gray-900'>
								{activeDeals}
							</p>
						</div>
					</div>
				</Card>

				<Card className='p-4'>
					<div className='flex items-center space-x-3'>
						<DollarSign className='h-8 w-8 text-purple-600' />
						<div>
							<p className='text-sm text-gray-600'>
								Pipeline Value
							</p>
							<p className='text-xl font-semibold text-gray-900'>
								{formatCurrency(totalDealValue)}
							</p>
						</div>
					</div>
				</Card>

				<Card className='p-4'>
					<div className='flex items-center space-x-3'>
						<Calendar className='h-8 w-8 text-orange-600' />
						<div>
							<p className='text-sm text-gray-600'>Activities</p>
							<p className='text-xl font-semibold text-gray-900'>
								{company.activities?.length || 0}
							</p>
						</div>
					</div>
				</Card>
			</div>

			{/* Tabs */}
			<div className='border-b border-gray-200'>
				<nav className='-mb-px flex space-x-8'>
					{TABS.map((tab) => (
						<button
							key={tab.key}
							onClick={() => setActiveTab(tab.key)}
							className={`py-2 px-1 border-b-2 font-medium text-sm ${
								activeTab === tab.key
									? 'border-blue-500 text-blue-600'
									: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
							}`}
						>
							{tab.label}
						</button>
					))}
				</nav>
			</div>

			{/* Tab Content */}
			<div className='space-y-6'>
				{activeTab === 'overview' && (
					<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
						{/* Company Details */}
						<Card className='p-6'>
							<h3 className='text-lg font-semibold text-gray-900 mb-4'>
								Company Details
							</h3>
							<div className='space-y-4'>
								<div className='grid grid-cols-2 gap-4'>
									<div>
										<p className='text-sm text-gray-600'>
											Industry
										</p>
										<p className='font-medium text-gray-900'>
											{formatIndustry(company.industry)}
										</p>
									</div>
									<div>
										<p className='text-sm text-gray-600'>
											Funding Stage
										</p>
										<p className='font-medium text-gray-900'>
											{formatFundingStage(
												company.fundingStage
											)}
										</p>
									</div>
									<div>
										<p className='text-sm text-gray-600'>
											Employee Count
										</p>
										<p className='font-medium text-gray-900'>
											{company.employeeCount ||
												'Not specified'}
										</p>
									</div>
									<div>
										<p className='text-sm text-gray-600'>
											Location
										</p>
										<p className='font-medium text-gray-900'>
											{company.location ||
												'Not specified'}
										</p>
									</div>
								</div>

								{company.linkedinUrl && (
									<div>
										<p className='text-sm text-gray-600'>
											LinkedIn
										</p>
										<a
											href={company.linkedinUrl}
											target='_blank'
											rel='noopener noreferrer'
											className='text-blue-600 hover:text-blue-800 transition-colors'
										>
											<ExternalLink className='inline h-4 w-4 mr-1' />
											View LinkedIn Profile
										</a>
									</div>
								)}

								{company.notes && (
									<div>
										<p className='text-sm text-gray-600'>
											Notes
										</p>
										<p className='text-gray-900 mt-1'>
											{company.notes}
										</p>
									</div>
								)}
							</div>
						</Card>

						{/* Recent Activities */}
						<Card className='p-6'>
							<div className='flex items-center justify-between mb-4'>
								<h3 className='text-lg font-semibold text-gray-900'>
									Recent Activities
								</h3>
								{onActivityAdd && (
									<button
										onClick={() =>
											onActivityAdd(company.id)
										}
										className='text-sm text-blue-600 hover:text-blue-800 transition-colors'
									>
										+ Add Activity
									</button>
								)}
							</div>
							<div className='space-y-3'>
								{company.activities
									?.slice(0, 5)
									.map((activity) => {
										const Icon = getActivityIcon(
											activity.type
										);
										return (
											<div
												key={activity.id}
												className='flex items-center space-x-3'
											>
												<div className='w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center'>
													<Icon className='h-4 w-4 text-gray-600' />
												</div>
												<div className='flex-1'>
													<p className='text-sm font-medium text-gray-900'>
														{activity.subject ||
															activity.type.replace(
																'_',
																' '
															)}
													</p>
													<p className='text-xs text-gray-500'>
														{activity.completedDate
															? formatDate(
																	activity.completedDate
															  )
															: 'Scheduled'}
													</p>
												</div>
											</div>
										);
									})}
								{(!company.activities ||
									company.activities.length === 0) && (
									<p className='text-sm text-gray-500 text-center py-4'>
										No recent activities
									</p>
								)}
							</div>
						</Card>
					</div>
				)}

				{activeTab === 'contacts' && (
					<Card className='p-6'>
						<div className='flex items-center justify-between mb-4'>
							<h3 className='text-lg font-semibold text-gray-900'>
								Contacts
							</h3>
							{onContactAdd && (
								<button
									onClick={() => onContactAdd(company.id)}
									className='flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors'
								>
									<Users className='h-4 w-4' />
									<span>Add Contact</span>
								</button>
							)}
						</div>
						<div className='space-y-4'>
							{company.contacts?.map((contact) => (
								<Link
									key={contact.id}
									href={`/contacts/${contact.id}`}
									className='flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer group'
								>
									<div className='flex items-center space-x-3'>
										<div className='w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-blue-100'>
											<span className='text-sm font-medium text-gray-600 group-hover:text-blue-600'>
												{contact.firstName[0]}
												{contact.lastName[0]}
											</span>
										</div>
										<div>
											<p className='font-medium text-gray-900 group-hover:text-blue-600'>
												{contact.firstName}{' '}
												{contact.lastName}
											</p>
											{contact.title && (
												<p className='text-sm text-gray-600'>
													{contact.title}
												</p>
											)}
											{contact.email && (
												<p className='text-sm text-gray-500'>
													{contact.email}
												</p>
											)}
										</div>
									</div>
									<div className='flex items-center space-x-2'>
										{contact.email && (
											<button
												onClick={(e) => {
													e.preventDefault();
													window.location.href = `mailto:${contact.email}`;
												}}
												className='p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition-colors'
											>
												<Mail className='h-4 w-4' />
											</button>
										)}
										{contact.phone && (
											<button
												onClick={(e) => {
													e.preventDefault();
													window.location.href = `tel:${contact.phone}`;
												}}
												className='p-2 text-gray-400 hover:text-green-600 hover:bg-green-100 rounded-lg transition-colors'
											>
												<Phone className='h-4 w-4' />
											</button>
										)}
										<ExternalLink className='h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors' />
									</div>
								</Link>
							))}
							{(!company.contacts ||
								company.contacts.length === 0) && (
								<div className='text-center py-8'>
									<Users className='h-12 w-12 text-gray-400 mx-auto mb-4' />
									<p className='text-gray-500'>
										No contacts added yet
									</p>
								</div>
							)}
						</div>
					</Card>
				)}

				{activeTab === 'deals' && (
					<Card className='p-6'>
						<div className='flex items-center justify-between mb-4'>
							<h3 className='text-lg font-semibold text-gray-900'>
								Deals
							</h3>
							{onDealAdd && (
								<button
									onClick={() => onDealAdd(company.id)}
									className='flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors'
								>
									<DollarSign className='h-4 w-4' />
									<span>Add Deal</span>
								</button>
							)}
						</div>
						<div className='space-y-4'>
							{company.deals?.map((deal) => (
								<div
									key={deal.id}
									className='flex items-center justify-between p-4 border border-gray-200 rounded-lg'
								>
									<div className='flex-1'>
										<div className='flex items-center space-x-3'>
											<h4 className='font-medium text-gray-900'>
												{deal.name}
											</h4>
											<span
												className={`px-2 py-1 rounded-full text-xs font-medium ${getDealStageColor(
													deal.stage
												)}`}
											>
												{deal.stage.replace('_', ' ')}
											</span>
										</div>
										<div className='flex items-center space-x-4 mt-2 text-sm text-gray-600'>
											<span>
												{formatCurrency(deal.value)}
											</span>
											<span>
												{deal.probability}% probability
											</span>
											{deal.expectedCloseDate && (
												<span>
													Due{' '}
													{formatDate(
														deal.expectedCloseDate
													)}
												</span>
											)}
										</div>
									</div>
								</div>
							))}
							{(!company.deals || company.deals.length === 0) && (
								<div className='text-center py-8'>
									<DollarSign className='h-12 w-12 text-gray-400 mx-auto mb-4' />
									<p className='text-gray-500'>
										No deals added yet
									</p>
								</div>
							)}
						</div>
					</Card>
				)}

				{activeTab === 'activities' && (
					<Card className='p-6'>
						<div className='flex items-center justify-between mb-4'>
							<h3 className='text-lg font-semibold text-gray-900'>
								Activities
							</h3>
							{onActivityAdd && (
								<button
									onClick={() => onActivityAdd(company.id)}
									className='flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors'
								>
									<Calendar className='h-4 w-4' />
									<span>Add Activity</span>
								</button>
							)}
						</div>
						<div className='space-y-4'>
							{company.activities?.map((activity) => {
								const Icon = getActivityIcon(activity.type);
								return (
									<div
										key={activity.id}
										className='flex items-start space-x-3 p-4 border border-gray-200 rounded-lg'
									>
										<div className='w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center'>
											<Icon className='h-4 w-4 text-gray-600' />
										</div>
										<div className='flex-1'>
											<div className='flex items-center justify-between'>
												<h4 className='font-medium text-gray-900'>
													{activity.subject ||
														activity.type.replace(
															'_',
															' '
														)}
												</h4>
												<span className='text-xs text-gray-500'>
													{activity.completedDate
														? formatDate(
																activity.completedDate
														  )
														: 'Scheduled'}
												</span>
											</div>
											{activity.notes && (
												<p className='text-sm text-gray-600 mt-1'>
													{activity.notes}
												</p>
											)}
											{activity.contact && (
												<p className='text-xs text-gray-500 mt-1'>
													With{' '}
													{activity.contact.firstName}{' '}
													{activity.contact.lastName}
												</p>
											)}
										</div>
									</div>
								);
							})}
							{(!company.activities ||
								company.activities.length === 0) && (
								<div className='text-center py-8'>
									<Calendar className='h-12 w-12 text-gray-400 mx-auto mb-4' />
									<p className='text-gray-500'>
										No activities logged yet
									</p>
								</div>
							)}
						</div>
					</Card>
				)}
			</div>
		</div>
	);
}
