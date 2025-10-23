'use client';

import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';

interface FilterDrawerProps {
	isOpen: boolean;
	onClose: () => void;
	children: React.ReactNode;
	title?: string;
}

export function FilterDrawer({
	isOpen,
	onClose,
	children,
	title = 'Filters',
}: FilterDrawerProps) {
	// Prevent body scroll when drawer is open
	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = 'unset';
		}
		return () => {
			document.body.style.overflow = 'unset';
		};
	}, [isOpen]);

	return (
		<>
			{/* Backdrop */}
			<div
				className={cn(
					'fixed inset-0 bg-black bg-opacity-50 transition-opacity z-40 lg:hidden',
					isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
				)}
				onClick={onClose}
			/>

			{/* Drawer */}
			<div
				className={cn(
					'fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl transition-transform transform z-50 lg:hidden',
					isOpen ? 'translate-y-0' : 'translate-y-full'
				)}
				style={{ maxHeight: '80vh' }}
			>
				{/* Header */}
				<div className='flex items-center justify-between p-4 border-b border-gray-200'>
					<h3 className='text-lg font-semibold text-gray-900'>{title}</h3>
					<button
						onClick={onClose}
						className='p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors touch-manipulation'
						style={{ minHeight: '44px', minWidth: '44px' }}
					>
						<X className='h-6 w-6' />
					</button>
				</div>

				{/* Content */}
				<div className='overflow-y-auto p-4' style={{ maxHeight: 'calc(80vh - 120px)' }}>
					{children}
				</div>

				{/* Footer */}
				<div className='p-4 border-t border-gray-200'>
					<button
						onClick={onClose}
						className='w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium touch-manipulation'
						style={{ minHeight: '44px' }}
					>
						Apply Filters
					</button>
				</div>
			</div>
		</>
	);
}
