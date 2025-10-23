'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function OnboardingForm() {
	const [name, setName] = useState('');
	const [slug, setSlug] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const router = useRouter();

	const generateSlug = (name: string) => {
		return name
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/(^-|-$)/g, '');
	};

	const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setName(value);
		setSlug(generateSlug(value));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError('');

		try {
			const response = await fetch('/api/organizations', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ name, slug }),
			});

			if (response.ok) {
				router.push('/dashboard');
			} else {
				const errorData = await response.json();
				setError(errorData.error || 'Failed to create organization');
			}
		} catch (err) {
			console.error('Error creating organization:', err);
			setError('An unexpected error occurred. Please try again.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className='space-y-6'>
			{error && (
				<div className='rounded-md bg-red-50 p-4'>
					<div className='flex'>
						<div className='ml-3'>
							<h3 className='text-sm font-medium text-red-800'>
								{error}
							</h3>
						</div>
					</div>
				</div>
			)}
			<div>
				<label
					htmlFor='name'
					className='block text-sm font-medium text-gray-700'
				>
					Organization Name
				</label>
				<input
					type='text'
					id='name'
					value={name}
					onChange={handleNameChange}
					required
					className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
					placeholder='Enter your organization name'
				/>
			</div>

			<div>
				<label
					htmlFor='slug'
					className='block text-sm font-medium text-gray-700'
				>
					Organization Slug
				</label>
				<input
					type='text'
					id='slug'
					value={slug}
					onChange={(e) => setSlug(e.target.value)}
					required
					className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
					placeholder='organization-slug'
				/>
				<p className='mt-1 text-sm text-gray-500'>
					This will be used in your organization URL
				</p>
			</div>

			<button
				type='submit'
				disabled={loading || !name || !slug}
				className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed'
			>
				{loading ? 'Creating...' : 'Create Organization'}
			</button>
		</form>
	);
}
