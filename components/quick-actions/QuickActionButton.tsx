'use client';

import React, { useState } from 'react';
import {
	Mail,
	MessageSquare,
	Phone,
	DollarSign,
	Clock,
	Plus,
	X,
} from 'lucide-react';
import { QuickLogModal } from './QuickLogModal';

type QuickActionType =
	| 'email'
	| 'linkedin'
	| 'call'
	| 'deal'
	| 'reminder'
	| null;

export function QuickActionButton() {
	const [isOpen, setIsOpen] = useState(false);
	const [activeModal, setActiveModal] = useState<QuickActionType>(null);

	const quickActions = [
		{
			type: 'email' as const,
			label: 'Log Email',
			icon: Mail,
			color: 'bg-blue-500 hover:bg-blue-600',
		},
		{
			type: 'linkedin' as const,
			label: 'Log LinkedIn',
			icon: MessageSquare,
			color: 'bg-indigo-500 hover:bg-indigo-600',
		},
		{
			type: 'call' as const,
			label: 'Log Call',
			icon: Phone,
			color: 'bg-green-500 hover:bg-green-600',
		},
		{
			type: 'deal' as const,
			label: 'New Deal',
			icon: DollarSign,
			color: 'bg-purple-500 hover:bg-purple-600',
		},
		{
			type: 'reminder' as const,
			label: 'Add Reminder',
			icon: Clock,
			color: 'bg-orange-500 hover:bg-orange-600',
		},
	];

	const handleActionClick = (type: QuickActionType) => {
		setActiveModal(type);
		setIsOpen(false);
	};

	return (
		<>
			{/* Floating Action Button */}
			<div className='fixed bottom-6 right-6 z-50'>
				{/* Quick Action Buttons */}
				{isOpen && (
					<div className='mb-4 flex flex-col space-y-3 items-end'>
						{quickActions.map((action) => (
							<button
								key={action.type}
								onClick={() => handleActionClick(action.type)}
								className={`${action.color} text-white px-4 py-3 rounded-full shadow-lg transition-all transform hover:scale-105 flex items-center space-x-2 animate-in slide-in-from-bottom-2 duration-200`}
								title={action.label}
							>
								<action.icon className='h-5 w-5' />
								<span className='text-sm font-medium'>
									{action.label}
								</span>
							</button>
						))}
					</div>
				)}

				{/* Main Toggle Button */}
				<button
					onClick={() => setIsOpen(!isOpen)}
					className={`${
						isOpen
							? 'bg-gray-600 hover:bg-gray-700 rotate-45'
							: 'bg-blue-600 hover:bg-blue-700'
					} text-white p-4 rounded-full shadow-lg transition-all transform hover:scale-110`}
					aria-label='Quick Actions'
				>
					{isOpen ? (
						<X className='h-6 w-6' />
					) : (
						<Plus className='h-6 w-6' />
					)}
				</button>
			</div>

			{/* Quick Log Modal */}
			{activeModal && (
				<QuickLogModal
					type={activeModal}
					onClose={() => setActiveModal(null)}
				/>
			)}
		</>
	);
}
