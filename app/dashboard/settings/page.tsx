'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface User {
	id: string;
	firstName: string | null;
	lastName: string | null;
	email: string;
	organizationId: string;
	organization?: {
		id: string;
		name: string;
		slug: string;
	};
}

interface RevenueGoal {
	id: string;
	targetAmount: number;
	startDate: string;
	endDate: string;
}

export default function SettingsPage() {
	const [user, setUser] = useState<User | null>(null);
	const [revenueGoal, setRevenueGoal] = useState<RevenueGoal | null>(null);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

	// Profile form state
	const [profileForm, setProfileForm] = useState({
		firstName: '',
		lastName: '',
		email: '',
	});

	// Organization form state
	const [orgForm, setOrgForm] = useState({
		name: '',
		slug: '',
	});

	// Revenue goal form state
	const [goalForm, setGoalForm] = useState({
		targetAmount: '',
		startDate: '',
		endDate: '',
	});

	useEffect(() => {
		fetchData();
	}, []);

	const fetchData = async () => {
		try {
			setLoading(true);
			
			// Fetch user and organization data
			const userRes = await fetch('/api/users/me');
			if (userRes.ok) {
				const userData = await userRes.json();
				setUser(userData);
				setProfileForm({
					firstName: userData.firstName || '',
					lastName: userData.lastName || '',
					email: userData.email || '',
				});
				if (userData.organization) {
					setOrgForm({
						name: userData.organization.name || '',
						slug: userData.organization.slug || '',
					});
				}
			}

			// Fetch current revenue goal
			const goalRes = await fetch('/api/revenue-goals');
			if (goalRes.ok) {
				const goalData = await goalRes.json();
				if (goalData) {
					setRevenueGoal(goalData);
					setGoalForm({
						targetAmount: goalData.targetAmount.toString(),
						startDate: goalData.startDate.split('T')[0],
						endDate: goalData.endDate.split('T')[0],
					});
				}
			}
		} catch (error) {
			console.error('Error fetching data:', error);
			setMessage({ type: 'error', text: 'Failed to load settings' });
		} finally {
			setLoading(false);
		}
	};

	const handleProfileSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setSaving(true);
		setMessage(null);

		try {
			const response = await fetch('/api/users/me', {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(profileForm),
			});

			if (response.ok) {
				const updatedUser = await response.json();
				setUser(updatedUser);
				setMessage({ type: 'success', text: 'Profile updated successfully' });
			} else {
				throw new Error('Failed to update profile');
			}
		} catch (error) {
			console.error('Error updating profile:', error);
			setMessage({ type: 'error', text: 'Failed to update profile' });
		} finally {
			setSaving(false);
		}
	};

	const handleOrgSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!user?.organization?.id) return;

		setSaving(true);
		setMessage(null);

		try {
			const response = await fetch(`/api/organizations/${user.organization.id}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(orgForm),
			});

			if (response.ok) {
				const updatedOrg = await response.json();
				setUser(prev => prev ? { ...prev, organization: updatedOrg } : null);
				setMessage({ type: 'success', text: 'Organization updated successfully' });
			} else {
				throw new Error('Failed to update organization');
			}
		} catch (error) {
			console.error('Error updating organization:', error);
			setMessage({ type: 'error', text: 'Failed to update organization' });
		} finally {
			setSaving(false);
		}
	};

	const handleGoalSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setSaving(true);
		setMessage(null);

		try {
			const goalData = {
				targetAmount: parseFloat(goalForm.targetAmount),
				startDate: new Date(goalForm.startDate).toISOString(),
				endDate: new Date(goalForm.endDate).toISOString(),
			};

			const response = await fetch('/api/revenue-goals', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(goalData),
			});

			if (response.ok) {
				const newGoal = await response.json();
				setRevenueGoal(newGoal);
				setMessage({ type: 'success', text: 'Revenue goal set successfully' });
			} else {
				throw new Error('Failed to set revenue goal');
			}
		} catch (error) {
			console.error('Error setting revenue goal:', error);
			setMessage({ type: 'error', text: 'Failed to set revenue goal' });
		} finally {
			setSaving(false);
		}
	};

	if (loading) {
		return (
			<div className='flex items-center justify-center h-64'>
				<div className='text-gray-600'>Loading settings...</div>
			</div>
		);
	}

	return (
		<div className='space-y-6'>
			<div>
				<h1 className='text-3xl font-bold text-gray-900'>Settings</h1>
				<p className='text-gray-600'>
					Manage your account and organization settings
				</p>
			</div>

			{message && (
				<div
					className={`p-4 rounded-md ${
						message.type === 'success'
							? 'bg-green-50 text-green-800'
							: 'bg-red-50 text-red-800'
					}`}
				>
					{message.text}
				</div>
			)}

			<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
				{/* Profile Settings */}
				<Card>
					<CardHeader>
						<CardTitle>Profile Settings</CardTitle>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleProfileSubmit} className='space-y-4'>
							<div>
								<label
									htmlFor='firstName'
									className='block text-sm font-medium text-gray-700'
								>
									First Name
								</label>
								<input
									type='text'
									id='firstName'
									value={profileForm.firstName}
									onChange={(e) =>
										setProfileForm({ ...profileForm, firstName: e.target.value })
									}
									className='mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
								/>
							</div>
							<div>
								<label
									htmlFor='lastName'
									className='block text-sm font-medium text-gray-700'
								>
									Last Name
								</label>
								<input
									type='text'
									id='lastName'
									value={profileForm.lastName}
									onChange={(e) =>
										setProfileForm({ ...profileForm, lastName: e.target.value })
									}
									className='mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
								/>
							</div>
							<div>
								<label
									htmlFor='email'
									className='block text-sm font-medium text-gray-700'
								>
									Email
								</label>
								<input
									type='email'
									id='email'
									value={profileForm.email}
									onChange={(e) =>
										setProfileForm({ ...profileForm, email: e.target.value })
									}
									className='mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
								/>
							</div>
							<button
								type='submit'
								disabled={saving}
								className='w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed'
							>
								{saving ? 'Saving...' : 'Update Profile'}
							</button>
						</form>
					</CardContent>
				</Card>

				{/* Organization Settings */}
				<Card>
					<CardHeader>
						<CardTitle>Organization Settings</CardTitle>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleOrgSubmit} className='space-y-4'>
							<div>
								<label
									htmlFor='orgName'
									className='block text-sm font-medium text-gray-700'
								>
									Organization Name
								</label>
								<input
									type='text'
									id='orgName'
									value={orgForm.name}
									onChange={(e) =>
										setOrgForm({ ...orgForm, name: e.target.value })
									}
									className='mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
								/>
							</div>
							<div>
								<label
									htmlFor='orgSlug'
									className='block text-sm font-medium text-gray-700'
								>
									Organization URL
								</label>
								<input
									type='text'
									id='orgSlug'
									value={orgForm.slug}
									onChange={(e) =>
										setOrgForm({ ...orgForm, slug: e.target.value })
									}
									className='mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
								/>
							</div>
							<button
								type='submit'
								disabled={saving}
								className='w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed'
							>
								{saving ? 'Saving...' : 'Update Organization'}
							</button>
						</form>
					</CardContent>
				</Card>

				{/* Revenue Goal */}
				<Card>
					<CardHeader>
						<CardTitle>Revenue Goal</CardTitle>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleGoalSubmit} className='space-y-4'>
							<div>
								<label
									htmlFor='targetAmount'
									className='block text-sm font-medium text-gray-700'
								>
									Target Amount ($)
								</label>
								<input
									type='number'
									id='targetAmount'
									value={goalForm.targetAmount}
									onChange={(e) =>
										setGoalForm({ ...goalForm, targetAmount: e.target.value })
									}
									className='mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
									placeholder='100000'
								/>
							</div>
							<div className='grid grid-cols-2 gap-4'>
								<div>
									<label
										htmlFor='startDate'
										className='block text-sm font-medium text-gray-700'
									>
										Start Date
									</label>
									<input
										type='date'
										id='startDate'
										value={goalForm.startDate}
										onChange={(e) =>
											setGoalForm({ ...goalForm, startDate: e.target.value })
										}
										className='mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
									/>
								</div>
								<div>
									<label
										htmlFor='endDate'
										className='block text-sm font-medium text-gray-700'
									>
										End Date
									</label>
									<input
										type='date'
										id='endDate'
										value={goalForm.endDate}
										onChange={(e) =>
											setGoalForm({ ...goalForm, endDate: e.target.value })
										}
										className='mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
									/>
								</div>
							</div>
							<button
								type='submit'
								disabled={saving}
								className='w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed'
							>
								{saving ? 'Saving...' : 'Set Revenue Goal'}
							</button>
						</form>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
