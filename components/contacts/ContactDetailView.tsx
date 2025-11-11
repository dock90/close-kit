import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { ContactForm } from './ContactForm';
import { DeleteContactModal } from './DeleteContactModal';
import {
	User,
	Mail,
	Phone,
	Briefcase,
	ExternalLink,
	Building2,
	Edit,
	Trash2,
	ArrowLeft,
	Calendar,
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

interface ContactDetailViewProps {
	contact: Contact;
	onUpdate: (formData: any) => void;
	onDelete: () => void;
	isUpdating?: boolean;
	isDeleting?: boolean;
}

export function ContactDetailView({
	contact,
	onUpdate,
	onDelete,
	isUpdating = false,
	isDeleting = false,
}: ContactDetailViewProps) {
	const router = useRouter();
	const [isEditing, setIsEditing] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

	const formatDate = (date: string) => {
		return new Intl.DateTimeFormat('en-US', {
			month: 'long',
			day: 'numeric',
			year: 'numeric',
		}).format(new Date(date));
	};

	const handleUpdate = async (formData: any) => {
		await onUpdate(formData);
		setIsEditing(false);
	};

	const handleDelete = async () => {
		await onDelete();
	};

	if (isEditing) {
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

				<ContactForm
					contact={contact}
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
				<button
					onClick={() => router.push('/contacts')}
					className='flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors'
				>
					<ArrowLeft className='h-5 w-5' />
					<span>Back to Contacts</span>
				</button>
				<div className='flex items-center space-x-3'>
					<button
						onClick={() => setIsEditing(true)}
						className='flex items-center space-x-2 px-4 py-2 text-indigo-600 border border-indigo-300 rounded-lg hover:bg-indigo-50 transition-colors'
					>
						<Edit className='h-4 w-4' />
						<span>Edit</span>
					</button>
					<button
						onClick={() => setIsDeleteModalOpen(true)}
						className='flex items-center space-x-2 px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors'
					>
						<Trash2 className='h-4 w-4' />
						<span>Delete</span>
					</button>
				</div>
			</div>

			{/* Contact Information Card */}
			<Card className='p-6'>
				<div className='space-y-6'>
					{/* Name and Title */}
					<div className='flex items-start space-x-4'>
						<div className='w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0'>
							<User className='h-8 w-8 text-indigo-600' />
						</div>
						<div className='flex-1'>
							<h1 className='text-3xl font-bold text-gray-900'>
								{contact.firstName} {contact.lastName}
							</h1>
							{contact.title && (
								<div className='flex items-center space-x-2 text-lg text-gray-600 mt-1'>
									<Briefcase className='h-5 w-5' />
									<span>{contact.title}</span>
								</div>
							)}
							{contact.company && (
								<div className='flex items-center space-x-2 text-gray-600 mt-2'>
									<Building2 className='h-5 w-5' />
									<span className='text-lg font-medium'>
										{contact.company.name}
									</span>
								</div>
							)}
						</div>
					</div>

					{/* Divider */}
					<div className='border-t border-gray-200' />

					{/* Contact Details */}
					<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
						{contact.email && (
							<div>
								<label className='block text-sm font-medium text-gray-500 mb-2'>
									Email
								</label>
								<div className='flex items-center space-x-2'>
									<Mail className='h-5 w-5 text-gray-400' />
									<a
										href={`mailto:${contact.email}`}
										className='text-indigo-600 hover:text-indigo-800 transition-colors'
									>
										{contact.email}
									</a>
								</div>
							</div>
						)}

						{contact.phone && (
							<div>
								<label className='block text-sm font-medium text-gray-500 mb-2'>
									Phone
								</label>
								<div className='flex items-center space-x-2'>
									<Phone className='h-5 w-5 text-gray-400' />
									<a
										href={`tel:${contact.phone}`}
										className='text-indigo-600 hover:text-indigo-800 transition-colors'
									>
										{contact.phone}
									</a>
								</div>
							</div>
						)}

						{contact.linkedinUrl && (
							<div className='md:col-span-2'>
								<label className='block text-sm font-medium text-gray-500 mb-2'>
									LinkedIn
								</label>
								<div className='flex items-center space-x-2'>
									<ExternalLink className='h-5 w-5 text-gray-400' />
									<a
										href={contact.linkedinUrl}
										target='_blank'
										rel='noopener noreferrer'
										className='text-indigo-600 hover:text-indigo-800 transition-colors'
									>
										{contact.linkedinUrl}
									</a>
								</div>
							</div>
						)}
					</div>

					{/* Stats */}
					{contact._count && (
						<>
							<div className='border-t border-gray-200' />
							<div className='grid grid-cols-2 gap-4'>
								<div className='bg-gray-50 p-4 rounded-lg'>
									<div className='flex items-center space-x-2 text-gray-600 mb-1'>
										<DollarSign className='h-5 w-5' />
										<span className='text-sm font-medium'>Deals</span>
									</div>
									<p className='text-2xl font-bold text-gray-900'>
										{contact._count.deals || 0}
									</p>
								</div>
								<div className='bg-gray-50 p-4 rounded-lg'>
									<div className='flex items-center space-x-2 text-gray-600 mb-1'>
										<Activity className='h-5 w-5' />
										<span className='text-sm font-medium'>
											Activities
										</span>
									</div>
									<p className='text-2xl font-bold text-gray-900'>
										{contact._count.activities || 0}
									</p>
								</div>
							</div>
						</>
					)}

					{/* Timestamps */}
					<div className='border-t border-gray-200 pt-4'>
						<div className='flex items-center justify-between text-sm text-gray-500'>
							<div className='flex items-center space-x-2'>
								<Calendar className='h-4 w-4' />
								<span>Added {formatDate(contact.createdAt)}</span>
							</div>
							{contact.updatedAt !== contact.createdAt && (
								<div className='flex items-center space-x-2'>
									<Calendar className='h-4 w-4' />
									<span>
										Updated {formatDate(contact.updatedAt)}
									</span>
								</div>
							)}
						</div>
					</div>
				</div>
			</Card>

			{/* Delete Modal */}
			<DeleteContactModal
				isOpen={isDeleteModalOpen}
				onClose={() => setIsDeleteModalOpen(false)}
				onConfirm={handleDelete}
				contactName={`${contact.firstName} ${contact.lastName}`}
				isDeleting={isDeleting}
			/>
		</div>
	);
}
