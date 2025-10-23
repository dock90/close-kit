import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs/server';
import {
	BarChart3,
	CheckCircle2,
	Clock,
	DollarSign,
	FileText,
	Kanban,
	Mail,
	Target,
	TrendingUp,
	Users,
	Zap,
} from 'lucide-react';
import Link from 'next/link';

export default async function HomePage() {
	const user = await currentUser();

	if (user) {
		redirect('/dashboard');
	}

	return (
		<div className='min-h-screen bg-white'>
			{/* Navigation */}
			<nav className='fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 z-50'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='flex justify-between items-center h-16'>
						<div className='flex items-center'>
							<span className='text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent'>
								CloseKit
							</span>
						</div>
						<div className='flex items-center gap-4'>
							<Link
								href='/sign-in'
								className='text-gray-600 hover:text-gray-900 font-medium'
							>
								Sign In
							</Link>
							<Link
								href='/sign-up'
								className='px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium'
							>
								Start Free Trial
							</Link>
						</div>
					</div>
				</div>
			</nav>

			{/* Hero Section */}
			<section className='pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-50 via-white to-purple-50'>
				<div className='max-w-7xl mx-auto'>
					<div className='grid lg:grid-cols-2 gap-12 items-center'>
						<div>
							<h1 className='text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6'>
								Hit Your Revenue Goals with{' '}
								<span className='bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent'>
									Sales Pipeline CRM
								</span>
							</h1>
							<p className='text-xl text-gray-600 mb-8'>
								Built for freelancers and agencies closing $100k+ deals
							</p>
							<div className='flex flex-col sm:flex-row gap-4'>
								<Link
									href='/sign-up'
									className='inline-flex items-center justify-center px-8 py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold text-lg shadow-lg hover:shadow-xl'
								>
									Start Free Trial
									<Zap className='ml-2 h-5 w-5' />
								</Link>
								<button className='inline-flex items-center justify-center px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-indigo-600 hover:text-indigo-600 transition-colors font-semibold text-lg'>
									Watch Demo
								</button>
							</div>
							<p className='mt-4 text-sm text-gray-500'>
								✓ No credit card required • ✓ 14-day free trial • ✓ Cancel
								anytime
							</p>
						</div>
						<div className='relative'>
							<div className='relative rounded-xl shadow-2xl overflow-hidden border border-gray-200 bg-white p-4'>
								<div className='aspect-video bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center'>
									<div className='text-center'>
										<Kanban className='h-24 w-24 text-indigo-600 mx-auto mb-4' />
										<p className='text-gray-600 font-medium'>
											Dashboard Screenshot
										</p>
									</div>
								</div>
							</div>
							<div className='absolute -z-10 top-10 left-10 w-full h-full bg-gradient-to-br from-indigo-200 to-purple-200 rounded-xl blur-3xl opacity-30'></div>
						</div>
					</div>
				</div>
			</section>

			{/* Problem/Solution Section */}
			<section className='py-20 px-4 sm:px-6 lg:px-8 bg-white'>
				<div className='max-w-6xl mx-auto'>
					<div className='grid md:grid-cols-2 gap-12 items-center'>
						<div className='bg-red-50 border-2 border-red-200 rounded-2xl p-8'>
							<div className='inline-flex items-center justify-center w-12 h-12 bg-red-100 rounded-lg mb-4'>
								<FileText className='h-6 w-6 text-red-600' />
							</div>
							<h3 className='text-2xl font-bold text-gray-900 mb-4'>
								The Problem
							</h3>
							<p className='text-lg text-gray-700'>
								Tracking deals in spreadsheets is messy, error-prone, and makes
								it impossible to see your real pipeline health.
							</p>
						</div>
						<div className='bg-green-50 border-2 border-green-200 rounded-2xl p-8'>
							<div className='inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4'>
								<CheckCircle2 className='h-6 w-6 text-green-600' />
							</div>
							<h3 className='text-2xl font-bold text-gray-900 mb-4'>
								The Solution
							</h3>
							<p className='text-lg text-gray-700'>
								Visualize your pipeline, track outreach activities, and hit your
								revenue goals with data-driven accountability.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section className='py-20 px-4 sm:px-6 lg:px-8 bg-gray-50'>
				<div className='max-w-7xl mx-auto'>
					<div className='text-center mb-16'>
						<h2 className='text-4xl md:text-5xl font-bold text-gray-900 mb-4'>
							Everything You Need to Close More Deals
						</h2>
						<p className='text-xl text-gray-600'>
							Powerful features designed for high-performing sales teams
						</p>
					</div>

					<div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
						{/* Feature 1 */}
						<div className='bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100'>
							<div className='inline-flex items-center justify-center w-14 h-14 bg-indigo-100 rounded-lg mb-4'>
								<Kanban className='h-7 w-7 text-indigo-600' />
							</div>
							<h3 className='text-xl font-bold text-gray-900 mb-3'>
								Deal Pipeline Management
							</h3>
							<p className='text-gray-600'>
								Visual kanban boards to track deals from prospecting to closed.
								Drag, drop, and never lose track of an opportunity.
							</p>
						</div>

						{/* Feature 2 */}
						<div className='bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100'>
							<div className='inline-flex items-center justify-center w-14 h-14 bg-purple-100 rounded-lg mb-4'>
								<Clock className='h-7 w-7 text-purple-600' />
							</div>
							<h3 className='text-xl font-bold text-gray-900 mb-3'>
								Activity Tracking & Reminders
							</h3>
							<p className='text-gray-600'>
								Log calls, emails, and meetings. Set reminders and never miss a
								follow-up. Stay on top of every touchpoint.
							</p>
						</div>

						{/* Feature 3 */}
						<div className='bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100'>
							<div className='inline-flex items-center justify-center w-14 h-14 bg-green-100 rounded-lg mb-4'>
								<Target className='h-7 w-7 text-green-600' />
							</div>
							<h3 className='text-xl font-bold text-gray-900 mb-3'>
								Revenue Goal Tracking
							</h3>
							<p className='text-gray-600'>
								Set monthly targets and track progress in real-time. Know
								exactly where you stand and what you need to close.
							</p>
						</div>

						{/* Feature 4 */}
						<div className='bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100'>
							<div className='inline-flex items-center justify-center w-14 h-14 bg-blue-100 rounded-lg mb-4'>
								<BarChart3 className='h-7 w-7 text-blue-600' />
							</div>
							<h3 className='text-xl font-bold text-gray-900 mb-3'>
								Weekly Accountability Reports
							</h3>
							<p className='text-gray-600'>
								Automated weekly summaries of activities, deals closed, and goal
								progress. Perfect for solo founders and team check-ins.
							</p>
						</div>

						{/* Feature 5 */}
						<div className='bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100'>
							<div className='inline-flex items-center justify-center w-14 h-14 bg-orange-100 rounded-lg mb-4'>
								<Mail className='h-7 w-7 text-orange-600' />
							</div>
							<h3 className='text-xl font-bold text-gray-900 mb-3'>
								Email & LinkedIn Templates
							</h3>
							<p className='text-gray-600'>
								Pre-built templates for outreach, follow-ups, and proposals.
								Customize and send without starting from scratch.
							</p>
						</div>

						{/* Feature 6 */}
						<div className='bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100'>
							<div className='inline-flex items-center justify-center w-14 h-14 bg-pink-100 rounded-lg mb-4'>
								<Users className='h-7 w-7 text-pink-600' />
							</div>
							<h3 className='text-xl font-bold text-gray-900 mb-3'>
								Multi-Tenant (for agencies)
							</h3>
							<p className='text-gray-600'>
								Manage multiple client pipelines in one place. Perfect for
								agencies running sales for multiple brands.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Pricing Section */}
			<section className='py-20 px-4 sm:px-6 lg:px-8 bg-white'>
				<div className='max-w-7xl mx-auto'>
					<div className='text-center mb-16'>
						<h2 className='text-4xl md:text-5xl font-bold text-gray-900 mb-4'>
							Simple, Transparent Pricing
						</h2>
						<p className='text-xl text-gray-600'>
							Start free, upgrade when you're ready
						</p>
					</div>

					<div className='grid md:grid-cols-3 gap-8 max-w-5xl mx-auto'>
						{/* Free Plan */}
						<div className='bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-indigo-600 transition-colors'>
							<h3 className='text-2xl font-bold text-gray-900 mb-2'>Free</h3>
							<div className='mb-6'>
								<span className='text-4xl font-bold text-gray-900'>$0</span>
								<span className='text-gray-600'>/month</span>
							</div>
							<ul className='space-y-3 mb-8'>
								<li className='flex items-start'>
									<CheckCircle2 className='h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0' />
									<span className='text-gray-700'>1 user</span>
								</li>
								<li className='flex items-start'>
									<CheckCircle2 className='h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0' />
									<span className='text-gray-700'>Up to 50 companies</span>
								</li>
								<li className='flex items-start'>
									<CheckCircle2 className='h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0' />
									<span className='text-gray-700'>Basic pipeline management</span>
								</li>
								<li className='flex items-start'>
									<CheckCircle2 className='h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0' />
									<span className='text-gray-700'>Activity tracking</span>
								</li>
							</ul>
							<Link
								href='/sign-up'
								className='block w-full text-center px-6 py-3 border-2 border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors font-semibold'
							>
								Start Free
							</Link>
						</div>

						{/* Pro Plan */}
						<div className='bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl transform scale-105 relative'>
							<div className='absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-gray-900 px-4 py-1 rounded-full text-sm font-bold'>
								MOST POPULAR
							</div>
							<h3 className='text-2xl font-bold mb-2'>Pro</h3>
							<div className='mb-6'>
								<span className='text-4xl font-bold'>$29</span>
								<span className='text-indigo-100'>/month</span>
							</div>
							<ul className='space-y-3 mb-8'>
								<li className='flex items-start'>
									<CheckCircle2 className='h-5 w-5 text-green-300 mr-2 mt-0.5 flex-shrink-0' />
									<span>Unlimited users</span>
								</li>
								<li className='flex items-start'>
									<CheckCircle2 className='h-5 w-5 text-green-300 mr-2 mt-0.5 flex-shrink-0' />
									<span>Unlimited companies & deals</span>
								</li>
								<li className='flex items-start'>
									<CheckCircle2 className='h-5 w-5 text-green-300 mr-2 mt-0.5 flex-shrink-0' />
									<span>Revenue goal tracking</span>
								</li>
								<li className='flex items-start'>
									<CheckCircle2 className='h-5 w-5 text-green-300 mr-2 mt-0.5 flex-shrink-0' />
									<span>Weekly reports</span>
								</li>
								<li className='flex items-start'>
									<CheckCircle2 className='h-5 w-5 text-green-300 mr-2 mt-0.5 flex-shrink-0' />
									<span>Email & LinkedIn templates</span>
								</li>
								<li className='flex items-start'>
									<CheckCircle2 className='h-5 w-5 text-green-300 mr-2 mt-0.5 flex-shrink-0' />
									<span>Priority support</span>
								</li>
							</ul>
							<Link
								href='/sign-up'
								className='block w-full text-center px-6 py-3 bg-white text-indigo-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold'
							>
								Start Free Trial
							</Link>
						</div>

						{/* Agency Plan */}
						<div className='bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-indigo-600 transition-colors'>
							<h3 className='text-2xl font-bold text-gray-900 mb-2'>Agency</h3>
							<div className='mb-6'>
								<span className='text-4xl font-bold text-gray-900'>$99</span>
								<span className='text-gray-600'>/month</span>
							</div>
							<ul className='space-y-3 mb-8'>
								<li className='flex items-start'>
									<CheckCircle2 className='h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0' />
									<span className='text-gray-700'>Up to 5 users</span>
								</li>
								<li className='flex items-start'>
									<CheckCircle2 className='h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0' />
									<span className='text-gray-700'>Multi-tenant support</span>
								</li>
								<li className='flex items-start'>
									<CheckCircle2 className='h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0' />
									<span className='text-gray-700'>White-label options</span>
								</li>
								<li className='flex items-start'>
									<CheckCircle2 className='h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0' />
									<span className='text-gray-700'>Everything in Pro</span>
								</li>
								<li className='flex items-start'>
									<CheckCircle2 className='h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0' />
									<span className='text-gray-700'>Dedicated account manager</span>
								</li>
							</ul>
							<Link
								href='/sign-up'
								className='block w-full text-center px-6 py-3 border-2 border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors font-semibold'
							>
								Start Free Trial
							</Link>
						</div>
					</div>
				</div>
			</section>

			{/* Final CTA Section */}
			<section className='py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-600 to-purple-600'>
				<div className='max-w-4xl mx-auto text-center'>
					<h2 className='text-4xl md:text-5xl font-bold text-white mb-6'>
						Start Your 14-Day Free Trial
					</h2>
					<p className='text-xl text-indigo-100 mb-8'>
						No credit card required. Get started in under 2 minutes.
					</p>
					<div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
						<Link
							href='/sign-up'
							className='inline-flex items-center justify-center px-8 py-4 bg-white text-indigo-600 rounded-lg hover:bg-gray-100 transition-colors font-bold text-lg shadow-xl'
						>
							Get Started Free
							<TrendingUp className='ml-2 h-5 w-5' />
						</Link>
						<Link
							href='/sign-in'
							className='inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-white/10 transition-colors font-bold text-lg'
						>
							Sign In
						</Link>
					</div>
					<div className='mt-8 flex items-center justify-center gap-8 text-indigo-100'>
						<div className='flex items-center'>
							<CheckCircle2 className='h-5 w-5 mr-2' />
							<span>14-day trial</span>
						</div>
						<div className='flex items-center'>
							<CheckCircle2 className='h-5 w-5 mr-2' />
							<span>No credit card</span>
						</div>
						<div className='flex items-center'>
							<CheckCircle2 className='h-5 w-5 mr-2' />
							<span>Cancel anytime</span>
						</div>
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className='bg-gray-900 text-gray-400 py-12 px-4 sm:px-6 lg:px-8'>
				<div className='max-w-7xl mx-auto text-center'>
					<p className='text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-4'>
						CloseKit
					</p>
					<p className='mb-4'>
						Sales Pipeline CRM for Freelancers & Agencies
					</p>
					<p className='text-sm'>
						© 2025 CloseKit. All rights reserved.
					</p>
				</div>
			</footer>
		</div>
	);
}
