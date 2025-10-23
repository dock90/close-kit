'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { X, Save, Info } from 'lucide-react';

interface Template {
	id: string;
	name: string;
	type: 'email' | 'linkedin';
	subject?: string;
	body: string;
	category?: string;
}

interface TemplateEditorProps {
	template: Template | null;
	onClose: () => void;
	onSave: () => void;
}

export function TemplateEditor({
	template,
	onClose,
	onSave,
}: TemplateEditorProps) {
	const [formData, setFormData] = useState({
		name: template?.name || '',
		type: template?.type || 'email',
		subject: template?.subject || '',
		body: template?.body || '',
		category: template?.category || 'cold_outreach',
	});
	const [isLoading, setIsLoading] = useState(false);

	const categories = [
		{ value: 'cold_outreach', label: 'Cold Outreach' },
		{ value: 'follow_up', label: 'Follow Up' },
		{ value: 'proposal', label: 'Proposal' },
		{ value: 'meeting_request', label: 'Meeting Request' },
		{ value: 'thank_you', label: 'Thank You' },
		{ value: 'other', label: 'Other' },
	];

	const variables = [
		{ var: '{{company_name}}', desc: 'Company name' },
		{ var: '{{contact_name}}', desc: 'Contact first name' },
		{ var: '{{contact_full_name}}', desc: 'Contact full name' },
		{ var: '{{personalization}}', desc: 'Custom personalization note' },
		{ var: '{{your_name}}', desc: 'Your name' },
		{ var: '{{your_title}}', desc: 'Your title' },
	];

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			const url = template
				? `/api/templates/${template.id}`
				: '/api/templates';
			const method = template ? 'PATCH' : 'POST';

			const response = await fetch(url, {
				method,
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(formData),
			});

			if (!response.ok) throw new Error('Failed to save template');

			onSave();
		} catch (error) {
			console.error('Error saving template:', error);
			alert('Failed to save template. Please try again.');
		} finally {
			setIsLoading(false);
		}
	};

	const insertVariable = (variable: string) => {
		const textarea = document.getElementById(
			'template-body'
		) as HTMLTextAreaElement;
		if (textarea) {
			const start = textarea.selectionStart;
			const end = textarea.selectionEnd;
			const newBody =
				formData.body.substring(0, start) +
				variable +
				formData.body.substring(end);
			setFormData({ ...formData, body: newBody });

			// Set cursor position after inserted variable
			setTimeout(() => {
				textarea.focus();
				textarea.setSelectionRange(
					start + variable.length,
					start + variable.length
				);
			}, 0);
		}
	};

	return (
		<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
			<Card className='w-full max-w-3xl p-6 max-h-[90vh] overflow-y-auto'>
				<form onSubmit={handleSubmit} className='space-y-6'>
					{/* Header */}
					<div className='flex items-center justify-between mb-4'>
						<h2 className='text-xl font-semibold text-gray-900'>
							{template ? 'Edit Template' : 'Create Template'}
						</h2>
						<button
							type='button'
							onClick={onClose}
							className='p-2 text-gray-400 hover:text-gray-600'
						>
							<X className='h-5 w-5' />
						</button>
					</div>

					<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
						{/* Template Name */}
						<div className='md:col-span-2'>
							<label className='block text-sm font-medium text-gray-700 mb-2'>
								Template Name *
							</label>
							<input
								type='text'
								required
								value={formData.name}
								onChange={(e) =>
									setFormData({
										...formData,
										name: e.target.value,
									})
								}
								className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
								placeholder='e.g., Initial Outreach - Healthcare'
							/>
						</div>

						{/* Type */}
						<div>
							<label className='block text-sm font-medium text-gray-700 mb-2'>
								Type *
							</label>
							<select
								required
								value={formData.type}
								onChange={(e) =>
									setFormData({
										...formData,
										type: e.target.value as
											| 'email'
											| 'linkedin',
									})
								}
								className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
							>
								<option value='email'>Email</option>
								<option value='linkedin'>LinkedIn</option>
							</select>
						</div>

						{/* Category */}
						<div>
							<label className='block text-sm font-medium text-gray-700 mb-2'>
								Category
							</label>
							<select
								value={formData.category}
								onChange={(e) =>
									setFormData({
										...formData,
										category: e.target.value,
									})
								}
								className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
							>
								{categories.map((cat) => (
									<option key={cat.value} value={cat.value}>
										{cat.label}
									</option>
								))}
							</select>
						</div>

						{/* Subject (for email only) */}
						{formData.type === 'email' && (
							<div className='md:col-span-2'>
								<label className='block text-sm font-medium text-gray-700 mb-2'>
									Subject Line
								</label>
								<input
									type='text'
									value={formData.subject}
									onChange={(e) =>
										setFormData({
											...formData,
											subject: e.target.value,
										})
									}
									className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
									placeholder='e.g., Quick question about {{company_name}}'
								/>
							</div>
						)}

						{/* Body */}
						<div className='md:col-span-2'>
							<label className='block text-sm font-medium text-gray-700 mb-2'>
								Message Body *
							</label>
							<textarea
								id='template-body'
								required
								value={formData.body}
								onChange={(e) =>
									setFormData({
										...formData,
										body: e.target.value,
									})
								}
								rows={10}
								className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm'
								placeholder='Hi {{contact_name}},&#10;&#10;I noticed {{company_name}} is...&#10;&#10;{{personalization}}&#10;&#10;Best regards,&#10;{{your_name}}'
							/>
						</div>

						{/* Variables Guide */}
						<div className='md:col-span-2'>
							<div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
								<div className='flex items-start space-x-2'>
									<Info className='h-5 w-5 text-blue-600 mt-0.5' />
									<div className='flex-1'>
										<h4 className='text-sm font-semibold text-blue-900 mb-2'>
											Available Variables
										</h4>
										<div className='grid grid-cols-2 gap-2'>
											{variables.map((v) => (
												<button
													key={v.var}
													type='button'
													onClick={() =>
														insertVariable(v.var)
													}
													className='text-left px-2 py-1 bg-white rounded text-xs hover:bg-blue-100 transition-colors'
												>
													<code className='text-blue-700 font-mono'>
														{v.var}
													</code>
													<span className='text-gray-600 ml-1'>
														- {v.desc}
													</span>
												</button>
											))}
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Actions */}
					<div className='flex items-center justify-end space-x-3 pt-6 border-t'>
						<button
							type='button'
							onClick={onClose}
							className='px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors'
						>
							Cancel
						</button>
						<button
							type='submit'
							disabled={isLoading}
							className='flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
						>
							<Save className='h-4 w-4' />
							<span>
								{isLoading
									? 'Saving...'
									: template
									? 'Update Template'
									: 'Create Template'}
							</span>
						</button>
					</div>
				</form>
			</Card>
		</div>
	);
}
