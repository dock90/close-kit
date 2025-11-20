import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import {
	FileText,
	Download,
	Mail,
	Copy,
	Building2,
	User,
	DollarSign,
	Calendar,
	Clock,
	CheckCircle,
} from 'lucide-react';

interface Deal {
	id: string;
	name: string;
	value: number;
	stage: string;
	probability: number;
	expectedCloseDate?: Date;
	serviceType?: string;
	projectDuration?: string;
	company: {
		name: string;
		website?: string;
	};
	contact: {
		firstName: string;
		lastName: string;
		email?: string;
		title?: string;
	};
}

interface ProposalTemplateProps {
	deal: Deal;
	onSendProposal?: (proposal: string) => void;
	onDownloadProposal?: (proposal: string) => void;
}

export function ProposalTemplate({
	deal,
	onSendProposal,
	onDownloadProposal,
}: ProposalTemplateProps) {
	const [proposal, setProposal] = useState('');
	const [isGenerating, setIsGenerating] = useState(false);

	const formatCurrency = (amount: number) => {
		// Convert from cents to dollars
		const dollars = amount / 100;
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			minimumFractionDigits: 0,
			maximumFractionDigits: 0,
		}).format(dollars);
	};

	const formatDate = (date: Date) => {
		return new Intl.DateTimeFormat('en-US', {
			month: 'long',
			day: 'numeric',
			year: 'numeric',
		}).format(date);
	};

	const getServiceDescription = (serviceType?: string) => {
		switch (serviceType) {
			case 'nextjs_sanity':
				return 'Next.js application with Sanity CMS integration';
			case 'hydrogen_sanity':
				return 'Shopify Hydrogen storefront with Sanity CMS';
			case 'custom':
				return 'Custom web application development';
			default:
				return 'Web application development';
		}
	};

	const generateProposal = async () => {
		setIsGenerating(true);

		// Simulate API call delay
		await new Promise((resolve) => setTimeout(resolve, 2000));

		const today = new Date();
		const deliveryDate = deal.projectDuration
			? new Date(
					today.getTime() +
						parseInt(deal.projectDuration.split('-')[0]) *
							7 *
							24 *
							60 *
							60 *
							1000
			  )
			: new Date(today.getTime() + 8 * 7 * 24 * 60 * 60 * 1000); // Default 8 weeks

		const proposalText = `PROPOSAL FOR ${deal.company.name.toUpperCase()}

Dear ${deal.contact.firstName} ${deal.contact.lastName},

Thank you for considering our services for your upcoming project. We're excited about the opportunity to work with ${
			deal.company.name
		} and help bring your vision to life.

PROJECT OVERVIEW
Project Name: ${deal.name}
Service Type: ${getServiceDescription(deal.serviceType)}
Project Duration: ${deal.projectDuration || '8-10 weeks'}
Investment: ${formatCurrency(deal.value)}

SCOPE OF WORK
We will deliver a comprehensive ${getServiceDescription(
			deal.serviceType
		)} that includes:

• Modern, responsive web application built with industry best practices
• Clean, intuitive user interface and user experience design
• Content management system integration for easy content updates
• Mobile-first responsive design ensuring optimal performance across all devices
• SEO optimization and performance optimization
• Comprehensive testing and quality assurance
• Deployment and hosting setup
• Documentation and training materials

DELIVERABLES
• Fully functional web application
• Source code and documentation
• Deployment to production environment
• User training and handover documentation
• 30-day post-launch support

TIMELINE
Project Start: ${formatDate(today)}
Expected Delivery: ${formatDate(deliveryDate)}
Duration: ${deal.projectDuration || '8-10 weeks'}

INVESTMENT BREAKDOWN
Total Project Cost: ${formatCurrency(deal.value)}
Payment Schedule:
• 50% upfront payment to begin project
• 50% upon project completion and delivery

NEXT STEPS
1. Review and approve this proposal
2. Sign the project agreement
3. Provide initial payment to begin development
4. Schedule project kickoff meeting

We're confident that our team can deliver exceptional results for ${
			deal.company.name
		}. Our track record of successful projects and commitment to quality ensures that your investment will yield significant returns.

If you have any questions or would like to discuss any aspect of this proposal, please don't hesitate to reach out.

We look forward to partnering with you on this exciting project.

Best regards,
[Your Name]
[Your Company]
[Contact Information]

---
Generated on ${formatDate(today)}`;

		setProposal(proposalText);
		setIsGenerating(false);
	};

	const copyToClipboard = async () => {
		try {
			await navigator.clipboard.writeText(proposal);
			// You could add a toast notification here
		} catch (err) {
			console.error('Failed to copy text: ', err);
		}
	};

	const handleSendProposal = () => {
		if (proposal && onSendProposal) {
			onSendProposal(proposal);
		}
	};

	const handleDownloadProposal = () => {
		if (proposal && onDownloadProposal) {
			onDownloadProposal(proposal);
		}
	};

	return (
		<Card className='p-6'>
			<div className='space-y-6'>
				{/* Header */}
				<div className='flex items-center justify-between'>
					<div className='flex items-center space-x-3'>
						<FileText className='h-6 w-6 text-blue-600' />
						<h2 className='text-xl font-semibold text-gray-900'>
							Proposal Template
						</h2>
					</div>
					{!proposal && (
						<button
							onClick={generateProposal}
							disabled={isGenerating}
							className='flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
						>
							<FileText className='h-4 w-4' />
							<span>
								{isGenerating
									? 'Generating...'
									: 'Generate Proposal'}
							</span>
						</button>
					)}
				</div>

				{/* Deal Summary */}
				<div className='bg-gray-50 rounded-lg p-4'>
					<h3 className='font-medium text-gray-900 mb-3'>
						Deal Summary
					</h3>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
						<div className='space-y-2'>
							<div className='flex items-center space-x-2'>
								<Building2 className='h-4 w-4 text-gray-400' />
								<span className='text-gray-600'>Company:</span>
								<span className='font-medium'>
									{deal.company.name}
								</span>
							</div>
							<div className='flex items-center space-x-2'>
								<User className='h-4 w-4 text-gray-400' />
								<span className='text-gray-600'>Contact:</span>
								<span className='font-medium'>
									{deal.contact.firstName}{' '}
									{deal.contact.lastName}
								</span>
							</div>
							<div className='flex items-center space-x-2'>
								<DollarSign className='h-4 w-4 text-gray-400' />
								<span className='text-gray-600'>Value:</span>
								<span className='font-medium'>
									{formatCurrency(deal.value)}
								</span>
							</div>
						</div>
						<div className='space-y-2'>
							<div className='flex items-center space-x-2'>
								<FileText className='h-4 w-4 text-gray-400' />
								<span className='text-gray-600'>Service:</span>
								<span className='font-medium'>
									{getServiceDescription(deal.serviceType)}
								</span>
							</div>
							<div className='flex items-center space-x-2'>
								<Clock className='h-4 w-4 text-gray-400' />
								<span className='text-gray-600'>Duration:</span>
								<span className='font-medium'>
									{deal.projectDuration || '8-10 weeks'}
								</span>
							</div>
							{deal.expectedCloseDate && (
								<div className='flex items-center space-x-2'>
									<Calendar className='h-4 w-4 text-gray-400' />
									<span className='text-gray-600'>
										Expected Close:
									</span>
									<span className='font-medium'>
										{formatDate(deal.expectedCloseDate)}
									</span>
								</div>
							)}
						</div>
					</div>
				</div>

				{/* Proposal Content */}
				{proposal && (
					<div className='space-y-4'>
						<div className='flex items-center justify-between'>
							<h3 className='font-medium text-gray-900'>
								Generated Proposal
							</h3>
							<div className='flex items-center space-x-2'>
								<button
									onClick={copyToClipboard}
									className='flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition-colors'
								>
									<Copy className='h-4 w-4' />
									<span>Copy</span>
								</button>
								{onDownloadProposal && (
									<button
										onClick={handleDownloadProposal}
										className='flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition-colors'
									>
										<Download className='h-4 w-4' />
										<span>Download</span>
									</button>
								)}
								{onSendProposal && (
									<button
										onClick={handleSendProposal}
										className='flex items-center space-x-1 px-3 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors'
									>
										<Mail className='h-4 w-4' />
										<span>Send</span>
									</button>
								)}
							</div>
						</div>

						<div className='bg-white border border-gray-200 rounded-lg p-6'>
							<pre className='whitespace-pre-wrap text-sm text-gray-800 font-mono leading-relaxed'>
								{proposal}
							</pre>
						</div>
					</div>
				)}

				{/* Instructions */}
				{!proposal && !isGenerating && (
					<div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
						<div className='flex items-start space-x-3'>
							<CheckCircle className='h-5 w-5 text-blue-600 mt-0.5' />
							<div>
								<h4 className='text-sm font-medium text-blue-800'>
									Proposal Generation
								</h4>
								<p className='text-sm text-blue-700 mt-1'>
									Click "Generate Proposal" to create a
									professional proposal template based on your
									deal details. You can then customize the
									content, copy it to your clipboard, or send
									it directly to your client.
								</p>
							</div>
						</div>
					</div>
				)}
			</div>
		</Card>
	);
}
