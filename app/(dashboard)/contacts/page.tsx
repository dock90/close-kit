'use client';

import { useState } from 'react';
import { ContactList, ContactForm } from '@/components/contacts';

interface Contact {
	id: string;
	firstName: string;
	lastName: string;
	email?: string | null;
	phone?: string | null;
	title?: string | null;
	linkedinUrl?: string | null;
	companyId: string;
}

export default function ContactsPage() {
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
		setEditingContact(contact);
		setShowContactForm(true);
	};

	const handleCancel = () => {
		setShowContactForm(false);
		setEditingContact(null);
	};

	return (
		<>
			{showContactForm ? (
				<div className='space-y-6'>
					<ContactForm
						contact={editingContact || undefined}
						onSubmit={editingContact ? handleContactUpdate : handleContactCreate}
						onCancel={handleCancel}
						isLoading={isLoading}
					/>
				</div>
			) : (
				<ContactList
					onContactCreate={() => setShowContactForm(true)}
					onContactSelect={(contact) => {
						// TODO: Implement contact detail view
						console.log('View contact:', contact);
					}}
					onContactEdit={handleEdit}
					onContactDelete={async (contact) => {
						// TODO: Implement contact deletion with confirmation
						console.log('Delete contact:', contact);
					}}
				/>
			)}
		</>
	);
}
