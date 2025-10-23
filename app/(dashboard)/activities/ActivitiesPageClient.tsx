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
	companyId?: string;
	contactId?: string;
	dealId?: string;
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
	const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
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

		const isEditing = editingActivity !== null;
		const url = isEditing
			? `/api/activities/${editingActivity.id}`
			: '/api/activities';
		const method = isEditing ? 'PATCH' : 'POST';

			const response = await fetch(url, {
				method,
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(cleanedData),
			});

			// Check if response is ok before parsing JSON
			if (!response.ok) {
				let errorMessage = isEditing
					? 'Failed to update activity'
					: 'Failed to create activity';
				try {
					const errorData = await response.json();
					errorMessage = errorData.error || errorMessage;
				} catch {
					// If response is not JSON, use status text
					errorMessage = response.statusText || errorMessage;
				}
				throw new Error(errorMessage);
			}

			const updatedActivity = await response.json();

			if (isEditing) {
				// Update the existing activity in the list
				setActivities(
					activities.map((a) =>
						a.id === editingActivity.id
							? {
									...updatedActivity,
									scheduledDate: updatedActivity.scheduledDate
										? new Date(
												updatedActivity.scheduledDate
										  )
										: undefined,
									completedDate: updatedActivity.completedDate
										? new Date(
												updatedActivity.completedDate
										  )
										: undefined,
									createdAt: new Date(
										updatedActivity.createdAt
									),
							  }
							: a
					)
				);
				setEditingActivity(null);
			} else {
				// Add the new activity to the list
				setActivities([updatedActivity, ...activities]);
			}

			setShowForm(false);
			router.refresh();
		} catch (error) {
			console.error('Error saving activity:', error);
			const errorMessage =
				error instanceof Error
					? error.message
					: 'Failed to save activity. Please try again.';
			alert(errorMessage);
		} finally {
			setIsLoading(false);
		}
	};

	const handleEdit = (activity: Activity) => {
		setEditingActivity(activity);
		setShowForm(true);
	};

	const handleDelete = async (activity: Activity) => {
		if (
			!confirm(
				'Are you sure you want to delete this activity? This action cannot be undone.'
			)
		) {
			return;
		}

		try {
			const response = await fetch(`/api/activities/${activity.id}`, {
				method: 'DELETE',
			});

			if (!response.ok) {
				let errorMessage = 'Failed to delete activity';
				try {
					const errorData = await response.json();
					errorMessage = errorData.error || errorMessage;
				} catch {
					errorMessage = response.statusText || errorMessage;
				}
				throw new Error(errorMessage);
			}

			// Remove the activity from the list
			setActivities(activities.filter((a) => a.id !== activity.id));
			router.refresh();
		} catch (error) {
			console.error('Error deleting activity:', error);
			const errorMessage =
				error instanceof Error
					? error.message
					: 'Failed to delete activity. Please try again.';
			alert(errorMessage);
		}
	};

	const handleCancelForm = () => {
		setShowForm(false);
		setEditingActivity(null);
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
					onClick={() => {
						setEditingActivity(null);
						setShowForm(true);
					}}
					className='inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
				>
					<Plus className='h-4 w-4 mr-2' />
					Log Activity
				</button>
			</div>

			{/* Activity Form */}
			{showForm && (
				<ActivityForm
					initialData={
						editingActivity
							? {
									type: editingActivity.type,
									subject: editingActivity.subject || '',
									notes: editingActivity.notes || '',
									scheduledDate: editingActivity.scheduledDate
										? editingActivity.scheduledDate instanceof Date
											? editingActivity.scheduledDate
											: new Date(editingActivity.scheduledDate)
										: undefined,
									completedDate: editingActivity.completedDate
										? editingActivity.completedDate instanceof Date
											? editingActivity.completedDate
											: new Date(editingActivity.completedDate)
										: undefined,
									status: editingActivity.status,
									companyId: editingActivity.companyId || '',
									contactId:
										editingActivity.contactId || '',
									dealId: editingActivity.dealId || '',
							  }
							: undefined
					}
					companies={companies}
					contacts={contacts}
					deals={deals}
					onSubmit={handleSubmit}
					onCancel={handleCancelForm}
					isLoading={isLoading}
				/>
			)}

			{/* Activity List */}
			<ActivityList
				activities={activities}
				showFilters={true}
				onActivityEdit={handleEdit}
				onActivityDelete={handleDelete}
			/>
		</div>
	);
}
