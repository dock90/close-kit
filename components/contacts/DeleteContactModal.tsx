import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface DeleteContactModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	contactName: string;
	isDeleting?: boolean;
}

export function DeleteContactModal({
	isOpen,
	onClose,
	onConfirm,
	contactName,
	isDeleting = false,
}: DeleteContactModalProps) {
	if (!isOpen) return null;

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center'>
			{/* Backdrop */}
			<div
				className='absolute inset-0 bg-black bg-opacity-50'
				onClick={onClose}
			/>

			{/* Modal */}
			<Card className='relative w-full max-w-md mx-4 p-6 shadow-xl'>
				<div className='space-y-4'>
					{/* Header */}
					<div className='flex items-start justify-between'>
						<div className='flex items-center space-x-3'>
							<div className='p-2 bg-red-100 rounded-full'>
								<AlertTriangle className='h-6 w-6 text-red-600' />
							</div>
							<h3 className='text-lg font-semibold text-gray-900'>
								Delete Contact
							</h3>
						</div>
						<button
							onClick={onClose}
							className='p-1 text-gray-400 hover:text-gray-600'
							disabled={isDeleting}
						>
							<X className='h-5 w-5' />
						</button>
					</div>

					{/* Content */}
					<div className='space-y-3 pt-2'>
						<p className='text-gray-700'>
							Are you sure you want to delete{' '}
							<span className='font-semibold'>{contactName}</span>?
						</p>
						<div className='p-3 bg-amber-50 border border-amber-200 rounded-lg'>
							<p className='text-sm text-amber-800'>
								<strong>Warning:</strong> This action cannot be
								reversed. All associated data including notes,
								activities, and related records will no longer be
								accessible.
							</p>
						</div>
					</div>

					{/* Actions */}
					<div className='flex items-center justify-end space-x-3 pt-4'>
						<button
							onClick={onClose}
							disabled={isDeleting}
							className='px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
						>
							Cancel
						</button>
						<button
							onClick={onConfirm}
							disabled={isDeleting}
							className='px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
						>
							{isDeleting ? 'Deleting...' : 'Delete Contact'}
						</button>
					</div>
				</div>
			</Card>
		</div>
	);
}
