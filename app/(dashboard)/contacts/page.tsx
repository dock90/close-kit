'use client';

import { useState } from 'react';
import { ContactList, ContactForm } from '@/components/contacts';

export default function ContactsPage() {
	const [showContactForm, setShowContactForm] = useState(false);
	const [isCreating, setIsCreating] = useState(false);

	const handleContactCreate = async (formData: any) => {
		setIsCreating(true);
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
				// Refresh the page to show the new contact
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
			setIsCreating(false);
		}
	};

	return (
		<>
			{showContactForm ? (
				<div className='space-y-6'>
					<ContactForm
						onSubmit={handleContactCreate}
						onCancel={() => setShowContactForm(false)}
						isLoading={isCreating}
					/>
				</div>
			) : (
				<ContactList
					onContactCreate={() => setShowContactForm(true)}
					onContactSelect={(contact) => {
						// TODO: Implement contact detail view
						console.log('View contact:', contact);
					}}
					onContactEdit={(contact) => {
						// TODO: Implement contact editing
						console.log('Edit contact:', contact);
					}}
					onContactDelete={async (contact) => {
						// TODO: Implement contact deletion with confirmation
						console.log('Delete contact:', contact);
					}}
				/>
			)}
		</>
	);
}
