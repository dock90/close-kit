import React from 'react';
import { Card } from '@/components/ui/card';
import {
	Building2,
	Globe,
	MapPin,
	Users,
	ExternalLink,
	DollarSign,
	Calendar,
	Edit,
	Trash2,
} from 'lucide-react';
import { Company } from '@/lib/stores';

interface CompanyCardProps {
	company: Company;
	onEdit?: (company: Company) => void;
	onDelete?: (company: Company) => void;
	onViewDetails?: (company: Company) => void;
}

export function CompanyCard({
	company,
	onEdit,
	onDelete,
	onViewDetails,
}: CompanyCardProps) {
	const formatDate = (date: string) => {
		return new Intl.DateTimeFormat('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
		}).format(new Date(date));
	};

	const formatIndustry = (industry?: string) => {
		if (!industry) return null;
		return industry.charAt(0).toUpperCase() + industry.slice(1);
	};

	const formatFundingStage = (stage?: string) => {
		if (!stage) return null;
		return stage
			.split('-')
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');
	};

	const handleCardClick = () => {
		onViewDetails?.(company);
	};

	const handleActionClick = (e: React.MouseEvent, action: () => void) => {
		e.stopPropagation();
		action();
	};

	return (
		<Card
			className='p-6 hover:shadow-lg transition-all duration-200 cursor-pointer group'
			onClick={handleCardClick}
		>
			<div className='space-y-4'>
				{/* Header */}
				<div className='flex items-start justify-between'>
					<div className='flex items-center space-x-3'>
						<div className='w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center'>
							<Building2 className='h-6 w-6 text-blue-600' />
						</div>
						<div>
							<h3 className='text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors'>
								{company.name}
							</h3>
							{company.website && (
								<div className='flex items-center space-x-1 text-sm text-gray-500'>
									<Globe className='h-3 w-3' />
									<span>{company.website}</span>
								</div>
							)}
						</div>
					</div>

					{/* Actions */}
					<div className='flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity'>
						{onEdit && (
							<button
								onClick={(e) =>
									handleActionClick(e, () => onEdit(company))
								}
								className='p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors'
								title='Edit company'
							>
								<Edit className='h-4 w-4' />
							</button>
						)}
						{onDelete && (
							<button
								onClick={(e) =>
									handleActionClick(e, () =>
										onDelete(company)
									)
								}
								className='p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors'
								title='Delete company'
							>
								<Trash2 className='h-4 w-4' />
							</button>
						)}
					</div>
				</div>

				{/* Tags */}
				<div className='flex flex-wrap gap-2'>
					{company.industry && (
						<span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800'>
							{formatIndustry(company.industry)}
						</span>
					)}
					{company.fundingStage && (
						<span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800'>
							{formatFundingStage(company.fundingStage)}
						</span>
					)}
				</div>

				{/* Details */}
				<div className='space-y-2'>
					{company.location && (
						<div className='flex items-center space-x-2 text-sm text-gray-600'>
							<MapPin className='h-4 w-4' />
							<span>{company.location}</span>
						</div>
					)}

					{company.employeeCount && (
						<div className='flex items-center space-x-2 text-sm text-gray-600'>
							<Users className='h-4 w-4' />
							<span>{company.employeeCount} employees</span>
						</div>
					)}

					{company.linkedinUrl && (
						<div className='flex items-center space-x-2 text-sm text-gray-600'>
							<ExternalLink className='h-4 w-4' />
							<a
								href={company.linkedinUrl}
								target='_blank'
								rel='noopener noreferrer'
								className='text-blue-600 hover:text-blue-800 transition-colors'
								onClick={(e) => e.stopPropagation()}
							>
								LinkedIn Profile
							</a>
						</div>
					)}
				</div>

				{/* Notes Preview */}
				{company.notes && (
					<div className='bg-gray-50 rounded-lg p-3'>
						<p className='text-sm text-gray-700 line-clamp-3'>
							{company.notes}
						</p>
					</div>
				)}

				{/* Footer */}
				<div className='flex items-center justify-between pt-4 border-t'>
				<div className='flex items-center space-x-4 text-sm text-gray-500'>
					<div className='flex items-center space-x-1'>
						<Users className='h-4 w-4' />
						<span>
							{company._count?.contacts || company.contacts?.length || 0} contacts
						</span>
					</div>
					<div className='flex items-center space-x-1'>
						<DollarSign className='h-4 w-4' />
						<span>{company._count?.deals || company.deals?.length || 0} deals</span>
					</div>
				</div>
					<div className='flex items-center space-x-1 text-xs text-gray-400'>
						<Calendar className='h-3 w-3' />
						<span>Added {formatDate(company.createdAt)}</span>
					</div>
				</div>
			</div>
		</Card>
	);
}
