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
	Users,
	FileText,
	Settings,
	X,
} from 'lucide-react';
import { useState } from 'react';

const mainNavigation = [
	{ name: 'Dashboard', href: '/dashboard', icon: Home },
	{ name: 'Companies', href: '/companies', icon: Building2 },
	{ name: 'Deals', href: '/deals', icon: TrendingUp },
	{ name: 'Activities', href: '/activities', icon: Activity },
];

const moreNavigation = [
	{ name: 'Contacts', href: '/contacts', icon: Users },
	{ name: 'Reports', href: '/reports', icon: FileText },
	{ name: 'Settings', href: '/settings', icon: Settings },
];

export function BottomNavigation() {
	const pathname = usePathname();
	const [isMoreOpen, setIsMoreOpen] = useState(false);

	const isMoreActive = moreNavigation.some(
		(item) => pathname === item.href || pathname.startsWith(item.href + '/')
	);

	return (
		<>
			{/* More Menu Overlay */}
			{isMoreOpen && (
				<div
					className='fixed inset-0 bg-black/20 z-40 lg:hidden'
					onClick={() => setIsMoreOpen(false)}
				/>
			)}

			{/* More Menu Panel */}
			<div
				className={cn(
					'fixed bottom-16 left-0 right-0 bg-white border-t border-gray-200 shadow-lg transition-transform duration-300 z-40 lg:hidden',
					isMoreOpen ? 'translate-y-0' : 'translate-y-full'
				)}
			>
				<div className='p-4 space-y-2'>
					{moreNavigation.map((item) => {
						const isActive =
							pathname === item.href ||
							pathname.startsWith(item.href + '/');
						return (
							<Link
								key={item.name}
								href={item.href}
								onClick={() => setIsMoreOpen(false)}
								className={cn(
									'flex items-center px-4 py-3 rounded-lg transition-colors touch-manipulation',
									isActive
										? 'bg-indigo-100 text-indigo-700'
										: 'text-gray-700 hover:bg-gray-100'
								)}
								style={{ minHeight: '44px' }}
							>
								<item.icon
									className={cn(
										'h-6 w-6 mr-3',
										isActive
											? 'text-indigo-600'
											: 'text-gray-500'
									)}
								/>
								<span className='text-base font-medium'>
									{item.name}
								</span>
							</Link>
						);
					})}
				</div>
			</div>

			{/* Bottom Navigation Bar */}
			<nav className='fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg lg:hidden'>
				<div className='flex items-center justify-around h-16'>
					{mainNavigation.map((item) => {
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
										isActive
											? 'text-indigo-600'
											: 'text-gray-500'
									)}
								/>
								<span className='text-xs font-medium'>
									{item.name}
								</span>
							</Link>
						);
					})}
					{/* More Button */}
					<button
						onClick={() => setIsMoreOpen(!isMoreOpen)}
						className={cn(
							'flex flex-col items-center justify-center flex-1 h-full space-y-1 transition-colors touch-manipulation',
							isMoreOpen || isMoreActive
								? 'text-indigo-600'
								: 'text-gray-500 hover:text-gray-900'
						)}
						style={{ minHeight: '44px' }}
					>
						{isMoreOpen ? (
							<X
								className={cn(
									'h-6 w-6',
									isMoreOpen || isMoreActive
										? 'text-indigo-600'
										: 'text-gray-500'
								)}
							/>
						) : (
							<Menu
								className={cn(
									'h-6 w-6',
									isMoreOpen || isMoreActive
										? 'text-indigo-600'
										: 'text-gray-500'
								)}
							/>
						)}
						<span className='text-xs font-medium'>More</span>
					</button>
				</div>
			</nav>
		</>
	);
}
