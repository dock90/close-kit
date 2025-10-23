import React from 'react';
import { Card } from '@/components/ui/card';
import {
	Mail,
	MessageSquare,
	Phone,
	Calendar,
	FileText,
	Clock,
	Plus,
} from 'lucide-react';

interface QuickLogButtonsProps {
	onQuickLog: (type: string) => void;
	disabled?: boolean;
}

const QUICK_LOG_OPTIONS = [
	{
		type: 'email_sent',
		label: 'Email',
		icon: Mail,
		color: 'bg-blue-100 text-blue-600 hover:bg-blue-200',
		description: 'Log an email sent',
	},
	{
		type: 'linkedin_message',
		label: 'LinkedIn',
		icon: MessageSquare,
		color: 'bg-purple-100 text-purple-600 hover:bg-purple-200',
		description: 'Log a LinkedIn message',
	},
	{
		type: 'call',
		label: 'Call',
		icon: Phone,
		color: 'bg-green-100 text-green-600 hover:bg-green-200',
		description: 'Log a phone call',
	},
	{
		type: 'meeting',
		label: 'Meeting',
		icon: Calendar,
		color: 'bg-orange-100 text-orange-600 hover:bg-orange-200',
		description: 'Log a meeting',
	},
	{
		type: 'proposal_sent',
		label: 'Proposal',
		icon: FileText,
		color: 'bg-red-100 text-red-600 hover:bg-red-200',
		description: 'Log a proposal sent',
	},
	{
		type: 'follow_up',
		label: 'Follow Up',
		icon: Clock,
		color: 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200',
		description: 'Schedule a follow up',
	},
];

export function QuickLogButtons({
	onQuickLog,
	disabled = false,
}: QuickLogButtonsProps) {
	return (
		<Card className='p-6'>
			<div className='space-y-4'>
				<div className='flex items-center space-x-2'>
					<Plus className='h-5 w-5 text-gray-600' />
					<h3 className='text-lg font-semibold text-gray-900'>
						Quick Log
					</h3>
				</div>

				<p className='text-sm text-gray-600'>
					Quickly log common activities without filling out the full
					form.
				</p>

				<div className='grid grid-cols-2 md:grid-cols-3 gap-3'>
					{QUICK_LOG_OPTIONS.map((option) => {
						const Icon = option.icon;

						return (
							<button
								key={option.type}
								onClick={() => onQuickLog(option.type)}
								disabled={disabled}
								className={`flex flex-col items-center space-y-2 p-4 rounded-lg border border-gray-200 transition-all duration-200 ${
									option.color
								} ${
									disabled
										? 'opacity-50 cursor-not-allowed'
										: 'cursor-pointer hover:shadow-md'
								}`}
								title={option.description}
							>
								<Icon className='h-6 w-6' />
								<span className='text-sm font-medium'>
									{option.label}
								</span>
							</button>
						);
					})}
				</div>

				<div className='text-xs text-gray-500 text-center'>
					Click any button to quickly log that activity type
				</div>
			</div>
		</Card>
	);
}
