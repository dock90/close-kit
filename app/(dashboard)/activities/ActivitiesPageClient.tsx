'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { ActivityList } from '@/components/activities';
import { ActivityForm } from '@/components/activities';
import { useRouter } from 'next/navigation';

interface Activity {
	id: string;
	type: string;
	subject?: string | null;
	notes?: string | null;
	scheduledDate?: Date | string | null;
	completedDate?: Date | string | null;
	status: string;
	company?: {
		name: string;
	} | null;
	contact?: {
		firstName: string;
		lastName: string;
	} | null;
	deal?: {
		name: string;
	} | null;
	createdAt: Date | string;
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

interface ActivitiesPageClientProps {
	initialActivities: Activity[];
	companies: Company[];
	contacts: Contact[];
	deals: Deal[];
}

export function ActivitiesPageClient({
	initialActivities,
	companies,
	contacts,
	deals,
}: ActivitiesPageClientProps) {
	// Convert serialized dates back to Date objects and handle null values
	const parsedActivities = initialActivities.map((activity) => ({
		...activity,
		subject: activity.subject ?? undefined,
		notes: activity.notes ?? undefined,
		company: activity.company ?? undefined,
		contact: activity.contact ?? undefined,
		deal: activity.deal ?? undefined,
		scheduledDate: activity.scheduledDate
			? new Date(activity.scheduledDate)
			: undefined,
		completedDate: activity.completedDate
			? new Date(activity.completedDate)
			: undefined,
		createdAt: new Date(activity.createdAt),
	}));

	const [activities, setActivities] = useState(parsedActivities);
	const [showForm, setShowForm] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	const handleSubmit = async (data: any) => {
		setIsLoading(true);
		try {
			// Clean up the data - convert empty strings to null for optional fields
			const cleanedData = {
				...data,
				dealId: data.dealId === '' ? null : data.dealId,
				contactId: data.contactId === '' ? null : data.contactId,
				notes: data.notes === '' ? null : data.notes,
				subject: data.subject === '' ? null : data.subject,
			};

			const response = await fetch('/api/activities', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(cleanedData),
			});

			// Check if response is ok before parsing JSON
			if (!response.ok) {
				let errorMessage = 'Failed to create activity';
				try {
					const errorData = await response.json();
					errorMessage = errorData.error || errorMessage;
				} catch {
					// If response is not JSON, use status text
					errorMessage = response.statusText || errorMessage;
				}
				throw new Error(errorMessage);
			}

			const newActivity = await response.json();
			setActivities([newActivity, ...activities]);
			setShowForm(false);
			router.refresh();
		} catch (error) {
			console.error('Error creating activity:', error);
			const errorMessage =
				error instanceof Error
					? error.message
					: 'Failed to create activity. Please try again.';
			alert(errorMessage);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className='space-y-6'>
			<div className='flex justify-between items-center'>
				<div>
					<h1 className='text-3xl font-bold text-gray-900'>
						Activities
					</h1>
					<p className='text-gray-600'>
						Track your sales activities and outreach
					</p>
				</div>
				<button
					onClick={() => setShowForm(true)}
					className='inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
				>
					<Plus className='h-4 w-4 mr-2' />
					Log Activity
				</button>
			</div>

			{/* Activity Form */}
			{showForm && (
				<ActivityForm
					companies={companies}
					contacts={contacts}
					deals={deals}
					onSubmit={handleSubmit}
					onCancel={() => setShowForm(false)}
					isLoading={isLoading}
				/>
			)}

			{/* Activity List */}
			<ActivityList activities={activities} showFilters={true} />
		</div>
	);
}
