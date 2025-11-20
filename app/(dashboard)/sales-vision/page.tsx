'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, Edit2, X } from 'lucide-react';

interface SalesVision {
	id: string;
	q1Vision: string;
	twelveMonthGoal: number;
	bigProblem: string;
	approach: string;
	whatNotToDo: string;
	strategyStatement: string;
	q1Focus1: string;
	q1Focus2: string;
	q1Focus3: string;
	weeklyCadence1: string;
	weeklyCadence2: string;
	weeklyCadence3: string;
	metric: string;
}

export default function SalesVisionPage() {
	const [salesVision, setSalesVision] = useState<SalesVision | null>(null);
	const [isEditing, setIsEditing] = useState(false);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [message, setMessage] = useState<{
		type: 'success' | 'error';
		text: string;
	} | null>(null);

	const [formData, setFormData] = useState({
		q1Vision: '',
		twelveMonthGoal: '',
		bigProblem: '',
		approach: '',
		whatNotToDo: '',
		strategyStatement: '',
		q1Focus1: '',
		q1Focus2: '',
		q1Focus3: '',
		weeklyCadence1: '',
		weeklyCadence2: '',
		weeklyCadence3: '',
		metric: '',
	});

	useEffect(() => {
		fetchSalesVision();
	}, []);

	const fetchSalesVision = async () => {
		try {
			setLoading(true);
			const response = await fetch('/api/sales-vision');
			if (response.ok) {
				const data = await response.json();
				if (data) {
					setSalesVision(data);
					setFormData({
						q1Vision: data.q1Vision || '',
						twelveMonthGoal: data.twelveMonthGoal?.toString() || '',
						bigProblem: data.bigProblem || '',
						approach: data.approach || '',
						whatNotToDo: data.whatNotToDo || '',
						strategyStatement: data.strategyStatement || '',
						q1Focus1: data.q1Focus1 || '',
						q1Focus2: data.q1Focus2 || '',
						q1Focus3: data.q1Focus3 || '',
						weeklyCadence1: data.weeklyCadence1 || '',
						weeklyCadence2: data.weeklyCadence2 || '',
						weeklyCadence3: data.weeklyCadence3 || '',
						metric: data.metric || '',
					});
				}
			}
		} catch (error) {
			console.error('Error fetching sales vision:', error);
		} finally {
			setLoading(false);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setSaving(true);
		setMessage(null);

		try {
			const response = await fetch('/api/sales-vision', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					...formData,
					twelveMonthGoal: parseFloat(formData.twelveMonthGoal) || 0,
				}),
			});

			if (response.ok) {
				const data = await response.json();
				setSalesVision(data);
				setIsEditing(false);
				setMessage({
					type: 'success',
					text: 'Sales vision saved successfully',
				});
			} else {
				throw new Error('Failed to save sales vision');
			}
		} catch (error) {
			console.error('Error saving sales vision:', error);
			setMessage({ type: 'error', text: 'Failed to save sales vision' });
		} finally {
			setSaving(false);
		}
	};

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			minimumFractionDigits: 0,
			maximumFractionDigits: 0,
		}).format(amount);
	};

	if (loading) {
		return (
			<div className='flex items-center justify-center py-12'>
				<div className='text-center'>
					<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
					<p className='text-gray-600'>Loading...</p>
				</div>
			</div>
		);
	}

	return (
		<div className='space-y-6'>
			<div className='flex items-center justify-between'>
				<div>
					<h1 className='text-3xl font-bold text-gray-900'>
						Q1 Sales Vision
					</h1>
					<p className='text-gray-600 mt-2'>
						Define your sales strategy and goals
					</p>
				</div>
				{!isEditing && (
					<button
						onClick={() => setIsEditing(true)}
						className='flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors'
					>
						<Edit2 className='h-4 w-4' />
						<span>Edit</span>
					</button>
				)}
			</div>

			{message && (
				<div
					className={`p-4 rounded-lg ${
						message.type === 'success'
							? 'bg-green-50 text-green-800'
							: 'bg-red-50 text-red-800'
					}`}
				>
					{message.text}
				</div>
			)}

			{isEditing ? (
				<form onSubmit={handleSubmit} className='space-y-6'>
					{/* Q1 Vision */}
					<Card>
						<CardHeader>
							<CardTitle>Q1 Sales Vision</CardTitle>
						</CardHeader>
						<CardContent>
							<textarea
								value={formData.q1Vision}
								onChange={(e) =>
									setFormData({
										...formData,
										q1Vision: e.target.value,
									})
								}
								rows={4}
								className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
								placeholder='Describe your Q1 sales vision...'
							/>
						</CardContent>
					</Card>

					{/* 12-Month Goal */}
					<Card>
						<CardHeader>
							<CardTitle>12-Month Goal</CardTitle>
						</CardHeader>
						<CardContent>
							<div className='relative'>
								<span className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500'>
									$
								</span>
								<input
									type='number'
									value={formData.twelveMonthGoal}
									onChange={(e) =>
										setFormData({
											...formData,
											twelveMonthGoal: e.target.value,
										})
									}
									className='w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
									placeholder='0'
									min='0'
									step='1000'
								/>
							</div>
						</CardContent>
					</Card>

					{/* Big Problem */}
					<Card>
						<CardHeader>
							<CardTitle>Big Problem</CardTitle>
						</CardHeader>
						<CardContent>
							<textarea
								value={formData.bigProblem}
								onChange={(e) =>
									setFormData({
										...formData,
										bigProblem: e.target.value,
									})
								}
								rows={4}
								className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
								placeholder='What is the big problem you are solving?'
							/>
						</CardContent>
					</Card>

					{/* Approach */}
					<Card>
						<CardHeader>
							<CardTitle>Approach</CardTitle>
						</CardHeader>
						<CardContent>
							<textarea
								value={formData.approach}
								onChange={(e) =>
									setFormData({
										...formData,
										approach: e.target.value,
									})
								}
								rows={4}
								className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
								placeholder='How will you approach this problem?'
							/>
						</CardContent>
					</Card>

					{/* What I will NOT do */}
					<Card>
						<CardHeader>
							<CardTitle>What I will NOT do</CardTitle>
						</CardHeader>
						<CardContent>
							<textarea
								value={formData.whatNotToDo}
								onChange={(e) =>
									setFormData({
										...formData,
										whatNotToDo: e.target.value,
									})
								}
								rows={4}
								className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
								placeholder='What activities will you avoid?'
							/>
						</CardContent>
					</Card>

					{/* Strategy Statement */}
					<Card>
						<CardHeader>
							<CardTitle>Strategy Statement</CardTitle>
						</CardHeader>
						<CardContent>
							<textarea
								value={formData.strategyStatement}
								onChange={(e) =>
									setFormData({
										...formData,
										strategyStatement: e.target.value,
									})
								}
								rows={4}
								className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
								placeholder='Your overall strategy statement...'
							/>
						</CardContent>
					</Card>

					{/* Q1 Focus */}
					<Card>
						<CardHeader>
							<CardTitle>Q1 Focus</CardTitle>
						</CardHeader>
						<CardContent className='space-y-3'>
							<input
								type='text'
								value={formData.q1Focus1}
								onChange={(e) =>
									setFormData({
										...formData,
										q1Focus1: e.target.value,
									})
								}
								className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
								placeholder='Focus area 1'
							/>
							<input
								type='text'
								value={formData.q1Focus2}
								onChange={(e) =>
									setFormData({
										...formData,
										q1Focus2: e.target.value,
									})
								}
								className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
								placeholder='Focus area 2'
							/>
							<input
								type='text'
								value={formData.q1Focus3}
								onChange={(e) =>
									setFormData({
										...formData,
										q1Focus3: e.target.value,
									})
								}
								className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
								placeholder='Focus area 3'
							/>
						</CardContent>
					</Card>

					{/* Weekly Cadence */}
					<Card>
						<CardHeader>
							<CardTitle>Weekly Cadence</CardTitle>
						</CardHeader>
						<CardContent className='space-y-3'>
							<input
								type='text'
								value={formData.weeklyCadence1}
								onChange={(e) =>
									setFormData({
										...formData,
										weeklyCadence1: e.target.value,
									})
								}
								className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
								placeholder='Weekly activity 1'
							/>
							<input
								type='text'
								value={formData.weeklyCadence2}
								onChange={(e) =>
									setFormData({
										...formData,
										weeklyCadence2: e.target.value,
									})
								}
								className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
								placeholder='Weekly activity 2'
							/>
							<input
								type='text'
								value={formData.weeklyCadence3}
								onChange={(e) =>
									setFormData({
										...formData,
										weeklyCadence3: e.target.value,
									})
								}
								className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
								placeholder='Weekly activity 3'
							/>
						</CardContent>
					</Card>

					{/* Metric */}
					<Card>
						<CardHeader>
							<CardTitle>Metric</CardTitle>
						</CardHeader>
						<CardContent>
							<input
								type='text'
								value={formData.metric}
								onChange={(e) =>
									setFormData({
										...formData,
										metric: e.target.value,
									})
								}
								className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
								placeholder='What metric will you track?'
							/>
						</CardContent>
					</Card>

					{/* Actions */}
					<div className='flex items-center justify-end space-x-3'>
						<button
							type='button'
							onClick={() => {
								setIsEditing(false);
								if (salesVision) {
									setFormData({
										q1Vision: salesVision.q1Vision || '',
										twelveMonthGoal:
											salesVision.twelveMonthGoal?.toString() ||
											'',
										bigProblem: salesVision.bigProblem || '',
										approach: salesVision.approach || '',
										whatNotToDo: salesVision.whatNotToDo || '',
										strategyStatement:
											salesVision.strategyStatement || '',
										q1Focus1: salesVision.q1Focus1 || '',
										q1Focus2: salesVision.q1Focus2 || '',
										q1Focus3: salesVision.q1Focus3 || '',
										weeklyCadence1:
											salesVision.weeklyCadence1 || '',
										weeklyCadence2:
											salesVision.weeklyCadence2 || '',
										weeklyCadence3:
											salesVision.weeklyCadence3 || '',
										metric: salesVision.metric || '',
									});
								}
							}}
							className='flex items-center space-x-2 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors'
						>
							<X className='h-4 w-4' />
							<span>Cancel</span>
						</button>
						<button
							type='submit'
							disabled={saving}
							className='flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
						>
							<Save className='h-4 w-4' />
							<span>{saving ? 'Saving...' : 'Save'}</span>
						</button>
					</div>
				</form>
			) : (
				<div className='space-y-6'>
					{/* View Mode */}
					{salesVision ? (
						<>
							<Card>
								<CardHeader>
									<CardTitle>Q1 Sales Vision</CardTitle>
								</CardHeader>
								<CardContent>
									<p className='text-gray-700 whitespace-pre-wrap'>
										{salesVision.q1Vision || 'Not set'}
									</p>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>12-Month Goal</CardTitle>
								</CardHeader>
								<CardContent>
									<p className='text-2xl font-bold text-green-600'>
										{formatCurrency(
											salesVision.twelveMonthGoal || 0
										)}
									</p>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Big Problem</CardTitle>
								</CardHeader>
								<CardContent>
									<p className='text-gray-700 whitespace-pre-wrap'>
										{salesVision.bigProblem || 'Not set'}
									</p>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Approach</CardTitle>
								</CardHeader>
								<CardContent>
									<p className='text-gray-700 whitespace-pre-wrap'>
										{salesVision.approach || 'Not set'}
									</p>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>What I will NOT do</CardTitle>
								</CardHeader>
								<CardContent>
									<p className='text-gray-700 whitespace-pre-wrap'>
										{salesVision.whatNotToDo || 'Not set'}
									</p>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Strategy Statement</CardTitle>
								</CardHeader>
								<CardContent>
									<p className='text-gray-700 whitespace-pre-wrap'>
										{salesVision.strategyStatement || 'Not set'}
									</p>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Q1 Focus</CardTitle>
								</CardHeader>
								<CardContent>
									<ol className='list-decimal list-inside space-y-2 text-gray-700'>
										<li>{salesVision.q1Focus1 || 'Not set'}</li>
										<li>{salesVision.q1Focus2 || 'Not set'}</li>
										<li>{salesVision.q1Focus3 || 'Not set'}</li>
									</ol>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Weekly Cadence</CardTitle>
								</CardHeader>
								<CardContent>
									<ol className='list-decimal list-inside space-y-2 text-gray-700'>
										<li>
											{salesVision.weeklyCadence1 || 'Not set'}
										</li>
										<li>
											{salesVision.weeklyCadence2 || 'Not set'}
										</li>
										<li>
											{salesVision.weeklyCadence3 || 'Not set'}
										</li>
									</ol>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Metric</CardTitle>
								</CardHeader>
								<CardContent>
									<p className='text-gray-700'>
										{salesVision.metric || 'Not set'}
									</p>
								</CardContent>
							</Card>
						</>
					) : (
						<Card>
							<CardContent className='py-12 text-center'>
								<p className='text-gray-600 mb-4'>
									No sales vision defined yet
								</p>
								<button
									onClick={() => setIsEditing(true)}
									className='bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors'
								>
									Create Sales Vision
								</button>
							</CardContent>
						</Card>
					)}
				</div>
			)}
		</div>
	);
}

