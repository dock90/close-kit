'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function SettingsLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const pathname = usePathname();

	const tabs = [
		{ name: 'General', href: '/settings' },
		{ name: 'Team', href: '/settings/team' },
		{ name: 'Billing', href: '/settings/billing' },
	];

	return (
		<div className='space-y-6'>
			<div>
				<h1 className='text-3xl font-bold text-gray-900'>Settings</h1>
				<p className='text-gray-600 mt-2'>
					Manage your account and organization settings
				</p>
			</div>

			{/* Tab Navigation */}
			<div className='border-b border-gray-200'>
				<nav className='-mb-px flex space-x-8'>
					{tabs.map((tab) => {
						const isActive = pathname === tab.href;
						return (
							<Link
								key={tab.name}
								href={tab.href}
								className={`
									whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
									${
										isActive
											? 'border-indigo-600 text-indigo-600'
											: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
									}
								`}
							>
								{tab.name}
							</Link>
						);
					})}
				</nav>
			</div>

			{/* Tab Content */}
			<div>{children}</div>
		</div>
	);
}

