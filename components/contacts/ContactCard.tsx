import React from 'react';
import { Card } from '@/components/ui/card';
import {
	User,
	Mail,
	Phone,
	Building2,
	ExternalLink,
	Calendar,
	Edit,
	Trash2,
	Briefcase,
	DollarSign,
	Activity,
} from 'lucide-react';

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

interface ContactCardProps {
	contact: Contact;
	onEdit?: (contact: Contact) => void;
	onDelete?: (contact: Contact) => void;
	onViewDetails?: (contact: Contact) => void;
}

export function ContactCard({
	contact,
	onEdit,
	onDelete,
	onViewDetails,
}: ContactCardProps) {
	const formatDate = (date: string) => {
		return new Intl.DateTimeFormat('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
		}).format(new Date(date));
	};

	const handleCardClick = () => {
		onViewDetails?.(contact);
	};

	const handleActionClick = (e: React.MouseEvent, action: () => void) => {
		e.stopPropagation();
		action();
	};

	return (
		<Card
			className='p-6 hover:shadow-lg transition-all duration-200 cursor-pointer group'
			onClick={handleCardClick}
		>
			<div className='space-y-4'>
				{/* Header */}
				<div className='flex items-start justify-between'>
					<div className='flex items-center space-x-3'>
						<div className='w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center'>
							<User className='h-6 w-6 text-indigo-600' />
						</div>
						<div>
							<h3 className='text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors'>
								{contact.firstName} {contact.lastName}
							</h3>
							{contact.title && (
								<div className='flex items-center space-x-1 text-sm text-gray-500'>
									<Briefcase className='h-3 w-3' />
									<span>{contact.title}</span>
								</div>
							)}
						</div>
					</div>

					{/* Actions */}
					<div className='flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity'>
						{onEdit && (
							<button
								onClick={(e) =>
									handleActionClick(e, () => onEdit(contact))
								}
								className='p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors'
								title='Edit contact'
							>
								<Edit className='h-4 w-4' />
							</button>
						)}
						{onDelete && (
							<button
								onClick={(e) =>
									handleActionClick(e, () =>
										onDelete(contact)
									)
								}
								className='p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors'
								title='Delete contact'
							>
								<Trash2 className='h-4 w-4' />
							</button>
						)}
					</div>
				</div>

				{/* Company */}
				{contact.company && (
					<div className='flex items-center space-x-2 text-sm text-gray-600'>
						<Building2 className='h-4 w-4' />
						<span>{contact.company.name}</span>
					</div>
				)}

				{/* Contact Details */}
				<div className='space-y-2'>
					{contact.email && (
						<div className='flex items-center space-x-2 text-sm text-gray-600'>
							<Mail className='h-4 w-4' />
							<a
								href={`mailto:${contact.email}`}
								className='text-indigo-600 hover:text-indigo-800 transition-colors'
								onClick={(e) => e.stopPropagation()}
							>
								{contact.email}
							</a>
						</div>
					)}

					{contact.phone && (
						<div className='flex items-center space-x-2 text-sm text-gray-600'>
							<Phone className='h-4 w-4' />
							<a
								href={`tel:${contact.phone}`}
								className='text-indigo-600 hover:text-indigo-800 transition-colors'
								onClick={(e) => e.stopPropagation()}
							>
								{contact.phone}
							</a>
						</div>
					)}

					{contact.linkedinUrl && (
						<div className='flex items-center space-x-2 text-sm text-gray-600'>
							<ExternalLink className='h-4 w-4' />
							<a
								href={contact.linkedinUrl}
								target='_blank'
								rel='noopener noreferrer'
								className='text-indigo-600 hover:text-indigo-800 transition-colors'
								onClick={(e) => e.stopPropagation()}
							>
								LinkedIn Profile
							</a>
						</div>
					)}
				</div>

				{/* Footer */}
				<div className='flex items-center justify-between pt-4 border-t'>
					<div className='flex items-center space-x-4 text-sm text-gray-500'>
						<div className='flex items-center space-x-1'>
							<DollarSign className='h-4 w-4' />
							<span>
								{contact._count?.deals || 0} deals
							</span>
						</div>
						<div className='flex items-center space-x-1'>
							<Activity className='h-4 w-4' />
							<span>
								{contact._count?.activities || 0} activities
							</span>
						</div>
					</div>
					<div className='flex items-center space-x-1 text-xs text-gray-400'>
						<Calendar className='h-3 w-3' />
						<span>Added {formatDate(contact.createdAt)}</span>
					</div>
				</div>
			</div>
		</Card>
	);
}
