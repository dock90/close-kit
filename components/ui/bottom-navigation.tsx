'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
	Home,
	Building2,
	TrendingUp,
	Activity,
	Menu,
} from 'lucide-react';

const navigation = [
	{ name: 'Dashboard', href: '/dashboard', icon: Home },
	{ name: 'Companies', href: '/dashboard/companies', icon: Building2 },
	{ name: 'Deals', href: '/dashboard/deals', icon: TrendingUp },
	{ name: 'Activities', href: '/dashboard/activities', icon: Activity },
	{ name: 'More', href: '/dashboard/settings', icon: Menu },
];

export function BottomNavigation() {
	const pathname = usePathname();

	return (
		<nav className='fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg lg:hidden'>
			<div className='flex items-center justify-around h-16'>
				{navigation.map((item) => {
					const isActive = item.href === '/dashboard'
						? pathname === item.href
						: pathname === item.href || pathname.startsWith(item.href + '/');
					
					return (
						<Link
							key={item.name}
							href={item.href}
							className={cn(
								'flex flex-col items-center justify-center flex-1 h-full space-y-1 transition-colors touch-manipulation',
								isActive
									? 'text-indigo-600'
									: 'text-gray-500 hover:text-gray-900'
							)}
							style={{ minHeight: '44px' }}
						>
							<item.icon
								className={cn(
									'h-6 w-6',
									isActive ? 'text-indigo-600' : 'text-gray-500'
								)}
							/>
							<span className='text-xs font-medium'>
								{item.name}
							</span>
						</Link>
					);
				})}
			</div>
		</nav>
	);
}
