'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ContactForm } from '@/components/contacts/ContactForm';
import { DeleteContactModal } from '@/components/contacts/DeleteContactModal';
import { Trash2 } from 'lucide-react';

interface ContactPageProps {
	params: Promise<{
		id: string;
	}>;
}

export default function ContactPage({ params }: ContactPageProps) {
	const router = useRouter();
	const [contact, setContact] = useState<any>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [isSaving, setIsSaving] = useState(false);
	const [contactId, setContactId] = useState<string | null>(null);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);

	useEffect(() => {
		const initializeParams = async () => {
			const resolvedParams = await params;
			setContactId(resolvedParams.id);
		};
		initializeParams();
	}, [params]);

	useEffect(() => {
		if (!contactId) return;

		const fetchContact = async () => {
			try {
				setIsLoading(true);
				const response = await fetch(`/api/contacts/${contactId}`);

				if (!response.ok) {
					throw new Error('Failed to fetch contact details');
				}

				const data = await response.json();
				setContact(data);
				setError(null);
			} catch (err) {
				console.error('Error fetching contact details:', err);
				setError(
					err instanceof Error
						? err.message
						: 'Failed to fetch contact details'
				);
			} finally {
				setIsLoading(false);
			}
		};

		fetchContact();
	}, [contactId]);

	const handleUpdateContact = async (formData: any) => {
		if (!contact) return;

		setIsSaving(true);
		try {
			const response = await fetch(`/api/contacts/${contact.id}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(formData),
			});

			if (!response.ok) {
				throw new Error('Failed to update contact');
			}

			const updatedContact = await response.json();
			setContact(updatedContact);
			router.push('/contacts');
		} catch (err) {
			console.error('Error updating contact:', err);
			alert('Failed to update contact. Please try again.');
		} finally {
			setIsSaving(false);
		}
	};

	const handleCancel = () => {
		router.back();
	};

	const handleDeleteContact = async () => {
		if (!contact) return;

		setIsDeleting(true);
		try {
			const response = await fetch(`/api/contacts/${contact.id}`, {
				method: 'DELETE',
			});

			if (!response.ok) {
				throw new Error('Failed to delete contact');
			}

			router.push('/contacts');
		} catch (err) {
			console.error('Error deleting contact:', err);
			alert('Failed to delete contact. Please try again.');
			setIsDeleting(false);
			setIsDeleteModalOpen(false);
		}
	};

	if (isLoading) {
		return (
			<div className='flex items-center justify-center py-12'>
				<div className='text-center'>
					<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
					<p className='text-gray-600'>Loading contact...</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className='flex items-center justify-center min-h-[400px]'>
				<div className='text-center'>
					<p className='text-red-600 mb-4'>Error: {error}</p>
					<button
						onClick={() => router.push('/contacts')}
						className='bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700'
					>
						Back to Contacts
					</button>
				</div>
			</div>
		);
	}

	if (!contact) {
		return (
			<div className='flex items-center justify-center min-h-[400px]'>
				<div className='text-center'>
					<p className='text-gray-600 mb-4'>Contact not found</p>
					<button
						onClick={() => router.push('/contacts')}
						className='bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700'
					>
						Back to Contacts
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className='space-y-6'>
			<div className='flex items-center justify-between mb-4'>
				<h1 className='text-2xl font-bold text-gray-900'>
					Edit Contact
				</h1>
				<button
					onClick={() => setIsDeleteModalOpen(true)}
					className='flex items-center space-x-2 px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors'
				>
					<Trash2 className='h-4 w-4' />
					<span>Delete Contact</span>
				</button>
			</div>

			<ContactForm
				contact={contact}
				onSubmit={handleUpdateContact}
				onCancel={handleCancel}
				isLoading={isSaving}
			/>

			<DeleteContactModal
				isOpen={isDeleteModalOpen}
				onClose={() => setIsDeleteModalOpen(false)}
				onConfirm={handleDeleteContact}
				contactName={`${contact.firstName} ${contact.lastName}`}
				isDeleting={isDeleting}
			/>
		</div>
	);
}
