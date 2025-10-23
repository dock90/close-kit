import React from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface DealStageSelectorProps {
	currentStage: string;
	onStageChange: (stage: string) => void;
	disabled?: boolean;
}

const STAGES = [
	{ value: 'lead', label: 'Lead', color: 'bg-gray-100 text-gray-800' },
	{
		value: 'contacted',
		label: 'Contacted',
		color: 'bg-blue-100 text-blue-800',
	},
	{
		value: 'discovery',
		label: 'Discovery',
		color: 'bg-yellow-100 text-yellow-800',
	},
	{
		value: 'proposal',
		label: 'Proposal',
		color: 'bg-orange-100 text-orange-800',
	},
	{
		value: 'negotiation',
		label: 'Negotiation',
		color: 'bg-purple-100 text-purple-800',
	},
	{
		value: 'closed_won',
		label: 'Closed Won',
		color: 'bg-green-100 text-green-800',
	},
	{
		value: 'closed_lost',
		label: 'Closed Lost',
		color: 'bg-red-100 text-red-800',
	},
];

export function DealStageSelector({
	currentStage,
	onStageChange,
	disabled = false,
}: DealStageSelectorProps) {
	const currentStageData = STAGES.find(
		(stage) => stage.value === currentStage
	);

	return (
		<div className='relative'>
			<select
				value={currentStage}
				onChange={(e) => onStageChange(e.target.value)}
				disabled={disabled}
				className={`appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
					currentStageData?.color || 'bg-gray-100 text-gray-800'
				} ${
					disabled
						? 'opacity-50 cursor-not-allowed'
						: 'cursor-pointer'
				}`}
			>
				{STAGES.map((stage) => (
					<option key={stage.value} value={stage.value}>
						{stage.label}
					</option>
				))}
			</select>
			<div className='absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none'>
				<ChevronDown className='h-4 w-4 text-gray-400' />
			</div>
		</div>
	);
}
