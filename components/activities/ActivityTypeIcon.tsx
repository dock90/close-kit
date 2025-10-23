import React from 'react';
import {
	Mail,
	MessageSquare,
	Phone,
	Calendar,
	FileText,
	Clock,
	LucideIcon,
} from 'lucide-react';

interface ActivityTypeIconProps {
	type: string;
	size?: 'sm' | 'md' | 'lg';
	className?: string;
}

const ACTIVITY_ICONS: Record<string, LucideIcon> = {
	email_sent: Mail,
	linkedin_request: MessageSquare,
	linkedin_message: MessageSquare,
	call: Phone,
	meeting: Calendar,
	proposal_sent: FileText,
	follow_up: Clock,
	note: FileText,
};

const ACTIVITY_COLORS: Record<string, string> = {
	email_sent: 'text-blue-600 bg-blue-100',
	linkedin_request: 'text-purple-600 bg-purple-100',
	linkedin_message: 'text-purple-600 bg-purple-100',
	call: 'text-green-600 bg-green-100',
	meeting: 'text-orange-600 bg-orange-100',
	proposal_sent: 'text-red-600 bg-red-100',
	follow_up: 'text-yellow-600 bg-yellow-100',
	note: 'text-gray-600 bg-gray-100',
};

const SIZE_CLASSES = {
	sm: 'h-3 w-3',
	md: 'h-4 w-4',
	lg: 'h-5 w-5',
};

const CONTAINER_SIZE_CLASSES = {
	sm: 'w-6 h-6',
	md: 'w-8 h-8',
	lg: 'w-10 h-10',
};

export function ActivityTypeIcon({
	type,
	size = 'md',
	className = '',
}: ActivityTypeIconProps) {
	const Icon = ACTIVITY_ICONS[type] || FileText;
	const colorClass = ACTIVITY_COLORS[type] || 'text-gray-600 bg-gray-100';
	const iconSizeClass = SIZE_CLASSES[size];
	const containerSizeClass = CONTAINER_SIZE_CLASSES[size];

	return (
		<div
			className={`${containerSizeClass} ${colorClass} rounded-full flex items-center justify-center ${className}`}
		>
			<Icon className={iconSizeClass} />
		</div>
	);
}
