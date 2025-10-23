'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type User = {
	id: string;
	email: string;
	firstName: string | null;
	lastName: string | null;
	role: string;
	createdAt: Date;
};

type TeamManagementProps = {
	currentUser: User;
	teamMembers: User[];
};

export function TeamManagement({ currentUser, teamMembers }: TeamManagementProps) {
	const [email, setEmail] = useState('');
	const [role, setRole] = useState('member');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const router = useRouter();

	const isAdmin = currentUser.role === 'admin';

	const handleInvite = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError('');
		setSuccess('');

		try {
			const response = await fetch('/api/organizations/invites', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email, role }),
			});

			if (response.ok) {
				setSuccess(`Invitation sent to ${email}`);
				setEmail('');
				router.refresh();
			} else {
				const data = await response.json();
				setError(data.error || 'Failed to send invitation');
			}
		} catch (error) {
			setError('Failed to send invitation');
		} finally {
			setLoading(false);
		}
	};

	const handleUpdateRole = async (userId: string, newRole: string) => {
		try {
			const response = await fetch(`/api/organizations/members/${userId}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ role: newRole }),
			});

			if (response.ok) {
				router.refresh();
			} else {
				const data = await response.json();
				alert(data.error || 'Failed to update role');
			}
		} catch (error) {
			alert('Failed to update role');
		}
	};

	const handleRemoveMember = async (userId: string, userEmail: string) => {
		if (!confirm(`Are you sure you want to remove ${userEmail} from the team?`)) {
			return;
		}

		try {
			const response = await fetch(`/api/organizations/members/${userId}`, {
				method: 'DELETE',
			});

			if (response.ok) {
				router.refresh();
			} else {
				const data = await response.json();
				alert(data.error || 'Failed to remove member');
			}
		} catch (error) {
			alert('Failed to remove member');
		}
	};

	return (
		<div className='space-y-6'>
			{/* Invite form - only visible to admins */}
			{isAdmin && (
				<div className='bg-white shadow rounded-lg p-6'>
					<h2 className='text-lg font-medium text-gray-900 mb-4'>
						Invite Team Member
					</h2>
					<form onSubmit={handleInvite} className='space-y-4'>
						<div>
							<label
								htmlFor='email'
								className='block text-sm font-medium text-gray-700'
							>
								Email Address
							</label>
							<input
								type='email'
								id='email'
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
								className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
								placeholder='colleague@example.com'
							/>
						</div>

						<div>
							<label
								htmlFor='role'
								className='block text-sm font-medium text-gray-700'
							>
								Role
							</label>
							<select
								id='role'
								value={role}
								onChange={(e) => setRole(e.target.value)}
								className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
							>
								<option value='member'>Member</option>
								<option value='admin'>Admin</option>
							</select>
						</div>

						{error && (
							<div className='text-sm text-red-600'>{error}</div>
						)}
						{success && (
							<div className='text-sm text-green-600'>{success}</div>
						)}

						<button
							type='submit'
							disabled={loading}
							className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50'
						>
							{loading ? 'Sending...' : 'Send Invitation'}
						</button>
					</form>
				</div>
			)}

			{/* Team members list */}
			<div className='bg-white shadow rounded-lg overflow-hidden'>
				<div className='px-6 py-4 border-b border-gray-200'>
					<h2 className='text-lg font-medium text-gray-900'>
						Team Members ({teamMembers.length})
					</h2>
				</div>

				<ul className='divide-y divide-gray-200'>
					{teamMembers.map((member) => (
						<li
							key={member.id}
							className='px-6 py-4 flex items-center justify-between'
						>
							<div className='flex items-center'>
								<div className='flex-shrink-0 h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium'>
									{member.firstName?.[0] || member.email[0].toUpperCase()}
								</div>
								<div className='ml-4'>
									<div className='text-sm font-medium text-gray-900'>
										{member.firstName && member.lastName
											? `${member.firstName} ${member.lastName}`
											: member.email}
										{member.id === currentUser.id && (
											<span className='ml-2 text-xs text-gray-500'>
												(You)
											</span>
										)}
									</div>
									<div className='text-sm text-gray-500'>
										{member.email}
									</div>
								</div>
							</div>

							<div className='flex items-center space-x-4'>
								{isAdmin && member.id !== currentUser.id ? (
									<>
										<select
											value={member.role}
											onChange={(e) =>
												handleUpdateRole(member.id, e.target.value)
											}
											className='text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
										>
											<option value='member'>Member</option>
											<option value='admin'>Admin</option>
										</select>
										<button
											onClick={() =>
												handleRemoveMember(member.id, member.email)
											}
											className='text-sm text-red-600 hover:text-red-800'
										>
											Remove
										</button>
									</>
								) : (
									<span className='text-sm text-gray-500 capitalize'>
										{member.role}
									</span>
								)}
							</div>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}
