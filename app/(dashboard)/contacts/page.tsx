'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ContactList, ContactForm } from '@/components/contacts';

interface Contact {
	id: string;
	firstName: string;
	lastName: string;
	email?: string | null;
	phone?: string | null;
	title?: string | null;
	linkedinUrl?: string | null;
	companyId?: string | null;
}

export default function ContactsPage() {
	const router = useRouter();
	const [showContactForm, setShowContactForm] = useState(false);
	const [editingContact, setEditingContact] = useState<Contact | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const handleContactCreate = async (formData: any) => {
		setIsLoading(true);
		try {
			const response = await fetch('/api/contacts', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(formData),
			});

			if (response.ok) {
				setShowContactForm(false);
				window.location.reload();
			} else {
				const error = await response.json();
				console.error('Error creating contact:', error);
				alert('Failed to create contact. Please try again.');
			}
		} catch (error) {
			console.error('Error creating contact:', error);
			alert('Failed to create contact. Please try again.');
		} finally {
			setIsLoading(false);
		}
	};

	const handleContactUpdate = async (formData: any) => {
		if (!editingContact) return;

		setIsLoading(true);
		try {
			const response = await fetch(`/api/contacts/${editingContact.id}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(formData),
			});

			if (response.ok) {
				setShowContactForm(false);
				setEditingContact(null);
				window.location.reload();
			} else {
				const error = await response.json();
				console.error('Error updating contact:', error);
				alert('Failed to update contact. Please try again.');
			}
		} catch (error) {
			console.error('Error updating contact:', error);
			alert('Failed to update contact. Please try again.');
		} finally {
			setIsLoading(false);
		}
	};

	const handleEdit = (contact: Contact) => {
		router.push(`/contacts/${contact.id}`);
	};

	const handleCancel = () => {
		setShowContactForm(false);
		setEditingContact(null);
	};

	return (
		<>
			<ContactList
				onContactCreate={() => setShowContactForm(true)}
				onContactSelect={(contact) => {
					router.push(`/contacts/${contact.id}`);
				}}
				onContactEdit={handleEdit}
				onContactDelete={async (contact) => {
					// TODO: Implement contact deletion with confirmation
					console.log('Delete contact:', contact);
				}}
			/>

			{showContactForm && (
				<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
					<div className='bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
						<ContactForm
							contact={editingContact || undefined}
							onSubmit={editingContact ? handleContactUpdate : handleContactCreate}
							onCancel={handleCancel}
							isLoading={isLoading}
						/>
					</div>
				</div>
			)}
		</>
	);
}
