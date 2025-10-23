'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
	BarChart3,
	Building2,
	Users,
	TrendingUp,
	Activity,
	FileText,
	Settings,
	Home,
	Mail,
	LogOut,
} from 'lucide-react';
import { SignOutButton } from '@clerk/nextjs';

const navigationGroups = [
	[
		{ name: 'Dashboard', href: '/dashboard', icon: Home },
		{ name: 'Deals', href: '/deals', icon: TrendingUp },
		{ name: 'Activities', href: '/activities', icon: Activity },
	],
	[
		{ name: 'Contacts', href: '/contacts', icon: Users },
		{ name: 'Companies', href: '/companies', icon: Building2 },
	],
	[
		{ name: 'Templates', href: '/templates', icon: Mail },
		{ name: 'Reports', href: '/reports', icon: FileText },
		{ name: 'Settings', href: '/settings', icon: Settings },
	],
];

export function Sidebar() {
	const pathname = usePathname();

	return (
		<div className='hidden lg:flex lg:flex-col w-64 bg-white shadow-lg'>
			<div className='p-6'>
				<h1 className='text-2xl font-bold text-gray-900'>CloseKit</h1>
			</div>

			<nav className='mt-6 flex-1'>
				<div className='px-3'>
					{navigationGroups.map((group, groupIndex) => (
						<div key={groupIndex}>
							<div className='space-y-1'>
								{group.map((item) => {
									const isActive =
										item.href === '/dashboard'
											? pathname === item.href
											: pathname === item.href ||
											  pathname.startsWith(item.href + '/');
									return (
										<Link
											key={item.name}
											href={item.href}
											className={cn(
												'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors touch-manipulation',
												isActive
													? 'bg-indigo-100 text-indigo-700'
													: 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
											)}
											style={{ minHeight: '44px' }}
										>
											<item.icon
												className={cn(
													'mr-3 h-5 w-5 flex-shrink-0',
													isActive
														? 'text-indigo-500'
														: 'text-gray-400 group-hover:text-gray-500'
												)}
											/>
											{item.name}
										</Link>
									);
								})}
							</div>
							{groupIndex < navigationGroups.length - 1 && (
								<div className='my-3 border-t border-gray-200' />
							)}
						</div>
					))}
				</div>
			</nav>

			<div className='p-3 border-t border-gray-200'>
				<SignOutButton>
					<button
						className='w-full flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md transition-colors touch-manipulation'
						style={{ minHeight: '44px' }}
					>
						<LogOut className='mr-3 h-5 w-5 flex-shrink-0 text-gray-400' />
						Sign Out
					</button>
				</SignOutButton>
			</div>
		</div>
	);
}
