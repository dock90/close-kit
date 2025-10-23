'use client';

import { ContactList } from '@/components/contacts';

export default function ContactsPage() {
	return (
		<div className='space-y-6'>
			<div className='flex justify-between items-center'>
				<div>
					<h1 className='text-3xl font-bold text-gray-900'>
						Contacts
					</h1>
					<p className='text-gray-600'>
						Manage your prospect contacts
					</p>
				</div>
			</div>

			<ContactList
				onContactCreate={() => {
					// TODO: Implement contact creation
					console.log('Create contact');
				}}
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
		</div>
	);
}
