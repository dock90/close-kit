'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	CheckCircle2,
	CreditCard,
	Calendar,
	AlertCircle,
	Settings,
} from 'lucide-react';

interface Organization {
	id: string;
	name: string;
	subscriptionStatus: string;
	subscriptionId: string | null;
	stripeCustomerId: string | null;
	trialEndsAt: string | null;
}

interface BillingManagementProps {
	organization: Organization;
	isAdmin: boolean;
}

export function BillingManagement({
	organization,
	isAdmin,
}: BillingManagementProps) {
	const [loading, setLoading] = useState(false);
	const [portalLoading, setPortalLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const isActive = organization.subscriptionStatus === 'active';
	const isTrial = organization.subscriptionStatus === 'trial';
	const isExpired = organization.subscriptionStatus === 'expired';

	// Calculate trial info
	let daysRemaining = 0;
	let trialExpired = false;
	if (organization.trialEndsAt) {
		const now = new Date();
		const trialEnd = new Date(organization.trialEndsAt);
		trialExpired = now > trialEnd;
		if (!trialExpired) {
			const diffTime = trialEnd.getTime() - now.getTime();
			daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		}
	}

	const handleSubscribe = async () => {
		try {
			setLoading(true);
			setError(null);

			const response = await fetch('/api/checkout', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(
					data.error || 'Failed to create checkout session'
				);
			}

			// Redirect to Stripe Checkout
			if (data.url) {
				window.location.href = data.url;
			}
		} catch (err) {
			console.error('Error creating checkout session:', err);
			setError(
				err instanceof Error ? err.message : 'Something went wrong'
			);
			setLoading(false);
		}
	};

	const handleManageBilling = async () => {
		try {
			setLoading(true);
			setError(null);

			const response = await fetch('/api/billing-portal', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || 'Failed to open billing portal');
			}

			// Redirect to Stripe Billing Portal
			if (data.url) {
				window.location.href = data.url;
			}
		} catch (err) {
			console.error('Error opening billing portal:', err);
			setError(
				err instanceof Error ? err.message : 'Something went wrong'
			);
			setLoading(false);
		}
	};

	const formatDate = (dateString: string) => {
		return new Intl.DateTimeFormat('en-US', {
			month: 'long',
			day: 'numeric',
			year: 'numeric',
		}).format(new Date(dateString));
	};

	const handleManageSubscription = async () => {
		try {
			setPortalLoading(true);
			setError(null);

			const response = await fetch('/api/billing-portal', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || 'Failed to open billing portal');
			}

			// Redirect to Stripe Customer Portal
			if (data.url) {
				window.location.href = data.url;
			}
		} catch (err) {
			console.error('Error opening billing portal:', err);
			setError(
				err instanceof Error ? err.message : 'Something went wrong'
			);
			setPortalLoading(false);
		}
	};

	return (
		<div className='space-y-6'>
			{/* Subscription Status Card */}
			<Card>
				<CardHeader>
					<CardTitle className='flex items-center justify-between'>
						<span>Subscription Status</span>
						{isActive && (
							<span className='inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800'>
								<CheckCircle2 className='h-4 w-4 mr-1' />
								Active
							</span>
						)}
						{isTrial && !trialExpired && (
							<span className='inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800'>
								<Calendar className='h-4 w-4 mr-1' />
								Trial
							</span>
						)}
						{!isActive && (isExpired || trialExpired) && (
							<span className='inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800'>
								<AlertCircle className='h-4 w-4 mr-1' />
								Expired
							</span>
						)}
					</CardTitle>
				</CardHeader>
				<CardContent className='space-y-4'>
					{/* Active Subscription */}
					{isActive && (
						<div className='bg-green-50 border border-green-200 rounded-lg p-4'>
							<div className='flex items-start'>
								<CheckCircle2 className='h-5 w-5 text-green-600 mt-0.5 mr-3 flex-shrink-0' />
								<div className='flex-1'>
									<h3 className='text-sm font-semibold text-green-900'>
										CloseKit Pro - Active
									</h3>
									<p className='text-sm text-green-800 mt-1'>
										Your subscription is active and all
										features are available.
									</p>
									<div className='mt-3 space-y-2'>
										<div className='flex items-center text-sm text-green-700'>
											<CreditCard className='h-4 w-4 mr-2' />
											<span>$29.00 per month</span>
										</div>
										{organization.subscriptionId && (
											<div className='text-xs text-green-600'>
												Subscription ID:{' '}
												{organization.subscriptionId}
											</div>
										)}
									</div>
									{isAdmin && (
										<div className='mt-4'>
											<button
												onClick={
													handleManageSubscription
												}
												disabled={portalLoading}
												className='inline-flex items-center px-4 py-2 bg-white border border-green-300 text-green-700 rounded-lg text-sm font-medium hover:bg-green-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
											>
												<Settings className='h-4 w-4 mr-2' />
												{portalLoading
													? 'Loading...'
													: 'Manage Subscription'}
											</button>
										</div>
									)}
								</div>
							</div>
						</div>
					)}

					{/* Trial Status */}
					{isTrial && !trialExpired && organization.trialEndsAt && (
						<div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4'>
							<div className='flex items-start'>
								<Calendar className='h-5 w-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0' />
								<div className='flex-1'>
									<h3 className='text-sm font-semibold text-yellow-900'>
										Trial Period
									</h3>
									<p className='text-sm text-yellow-800 mt-1'>
										{daysRemaining === 0
											? 'Your trial ends today!'
											: daysRemaining === 1
											? '1 day left in your trial'
											: `${daysRemaining} days left in your trial`}
									</p>
									<p className='text-sm text-yellow-700 mt-2'>
										Trial expires on{' '}
										<strong>
											{formatDate(
												organization.trialEndsAt
											)}
										</strong>
									</p>
								</div>
							</div>
						</div>
					)}

					{/* Expired Status */}
					{!isActive && (isExpired || trialExpired) && (
						<div className='bg-red-50 border border-red-200 rounded-lg p-4'>
							<div className='flex items-start'>
								<AlertCircle className='h-5 w-5 text-red-600 mt-0.5 mr-3 flex-shrink-0' />
								<div className='flex-1'>
									<h3 className='text-sm font-semibold text-red-900'>
										{isTrial
											? 'Trial Expired'
											: 'Subscription Expired'}
									</h3>
									<p className='text-sm text-red-800 mt-1'>
										Subscribe now to regain full access to
										your account.
									</p>
									{organization.trialEndsAt && (
										<p className='text-sm text-red-700 mt-2'>
											Trial ended on{' '}
											<strong>
												{formatDate(
													organization.trialEndsAt
												)}
											</strong>
										</p>
									)}
								</div>
							</div>
						</div>
					)}

					{/* Subscribe Button for Non-Active Users */}
					{!isActive && isAdmin && (
						<div className='pt-4'>
							{error && (
								<div className='mb-4 p-3 bg-red-100 border border-red-300 rounded-lg'>
									<p className='text-sm text-red-800'>
										{error}
									</p>
								</div>
							)}
							<button
								onClick={handleSubscribe}
								disabled={loading}
								className='w-full bg-indigo-600 text-white rounded-lg py-3 px-4 font-semibold hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed'
							>
								{loading
									? 'Loading...'
									: 'Subscribe to CloseKit Pro'}
							</button>
							<p className='text-xs text-gray-500 text-center mt-2'>
								$29/month • Cancel anytime
							</p>
						</div>
					)}

					{!isAdmin && (
						<div className='bg-gray-50 border border-gray-200 rounded-lg p-4'>
							<p className='text-sm text-gray-600'>
								Only organization admins can manage billing.
							</p>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Plan Details Card */}
			<Card>
				<CardHeader>
					<CardTitle>Plan Features</CardTitle>
				</CardHeader>
				<CardContent>
					<div className='space-y-3'>
						<div className='flex items-start'>
							<CheckCircle2 className='h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0' />
							<div>
								<p className='text-sm font-medium text-gray-900'>
									Unlimited Users
								</p>
								<p className='text-sm text-gray-600'>
									Add as many team members as you need
								</p>
							</div>
						</div>
						<div className='flex items-start'>
							<CheckCircle2 className='h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0' />
							<div>
								<p className='text-sm font-medium text-gray-900'>
									Unlimited Companies & Deals
								</p>
								<p className='text-sm text-gray-600'>
									Manage your entire sales pipeline
								</p>
							</div>
						</div>
						<div className='flex items-start'>
							<CheckCircle2 className='h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0' />
							<div>
								<p className='text-sm font-medium text-gray-900'>
									Revenue Goal Tracking
								</p>
								<p className='text-sm text-gray-600'>
									Set and track your revenue targets
								</p>
							</div>
						</div>
						<div className='flex items-start'>
							<CheckCircle2 className='h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0' />
							<div>
								<p className='text-sm font-medium text-gray-900'>
									Weekly Reports & Analytics
								</p>
								<p className='text-sm text-gray-600'>
									Comprehensive insights into your sales
									activities
								</p>
							</div>
						</div>
						<div className='flex items-start'>
							<CheckCircle2 className='h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0' />
							<div>
								<p className='text-sm font-medium text-gray-900'>
									Email & LinkedIn Templates
								</p>
								<p className='text-sm text-gray-600'>
									Save time with customizable templates
								</p>
							</div>
						</div>
						<div className='flex items-start'>
							<CheckCircle2 className='h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0' />
							<div>
								<p className='text-sm font-medium text-gray-900'>
									Priority Support
								</p>
								<p className='text-sm text-gray-600'>
									Get help when you need it
								</p>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Billing Information Card */}
			<Card>
				<CardHeader>
					<CardTitle>Billing Information</CardTitle>
				</CardHeader>
				<CardContent className='space-y-4'>
					<div className='space-y-3'>
						<div className='flex justify-between items-center py-3 border-b border-gray-200'>
							<span className='text-sm font-medium text-gray-700'>
								Organization
							</span>
							<span className='text-sm text-gray-900'>
								{organization.name}
							</span>
						</div>
						<div className='flex justify-between items-center py-3 border-b border-gray-200'>
							<span className='text-sm font-medium text-gray-700'>
								Plan
							</span>
							<span className='text-sm text-gray-900'>
								{isActive
									? 'CloseKit Pro'
									: 'No active subscription'}
							</span>
						</div>
						<div className='flex justify-between items-center py-3 border-b border-gray-200'>
							<span className='text-sm font-medium text-gray-700'>
								Price
							</span>
							<span className='text-sm text-gray-900'>
								{isActive ? '$29.00/month' : '—'}
							</span>
						</div>
						<div className='flex justify-between items-center py-3'>
							<span className='text-sm font-medium text-gray-700'>
								Status
							</span>
							<span className='text-sm text-gray-900 capitalize'>
								{organization.subscriptionStatus}
							</span>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
