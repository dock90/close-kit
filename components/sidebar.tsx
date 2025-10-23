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
} from 'lucide-react';

const navigation = [
	{ name: 'Dashboard', href: '/dashboard', icon: Home },
	{ name: 'Companies', href: '/companies', icon: Building2 },
	{ name: 'Contacts', href: '/contacts', icon: Users },
	{ name: 'Deals', href: '/deals', icon: TrendingUp },
	{ name: 'Activities', href: '/activities', icon: Activity },
	{ name: 'Reports', href: '/reports', icon: FileText },
	{ name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
	const pathname = usePathname();

	return (
		<div className='w-64 bg-white shadow-lg'>
			<div className='p-6'>
				<h1 className='text-2xl font-bold text-gray-900'>CloseKit</h1>
			</div>

			<nav className='mt-6'>
				<div className='px-3 space-y-1'>
					{navigation.map((item) => {
						const isActive =
							pathname === item.href ||
							pathname.startsWith(item.href + '/');
						return (
							<Link
								key={item.name}
								href={item.href}
								className={cn(
									'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
									isActive
										? 'bg-indigo-100 text-indigo-700'
										: 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
								)}
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
			</nav>
		</div>
	);
}
