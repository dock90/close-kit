'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import {
	Mail,
	MessageSquare,
	Copy,
	Plus,
	Edit,
	Trash2,
	Check,
} from 'lucide-react';
import { TemplateEditor } from './TemplateEditor';

interface Template {
	id: string;
	name: string;
	type: 'email' | 'linkedin';
	subject?: string;
	body: string;
	category?: string;
}

export function TemplateLibrary() {
	const [templates, setTemplates] = useState<Template[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [selectedType, setSelectedType] = useState<
		'all' | 'email' | 'linkedin'
	>('all');
	const [selectedCategory, setSelectedCategory] = useState<string>('all');
	const [showEditor, setShowEditor] = useState(false);
	const [editingTemplate, setEditingTemplate] = useState<Template | null>(
		null
	);
	const [copiedId, setCopiedId] = useState<string | null>(null);

	useEffect(() => {
		fetchTemplates();
	}, []);

	const fetchTemplates = async () => {
		try {
			const response = await fetch('/api/templates');
			if (response.ok) {
				const data = await response.json();
				setTemplates(data);
			}
		} catch (error) {
			console.error('Error fetching templates:', error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleCopy = async (template: Template) => {
		let textToCopy = template.body;
		if (template.type === 'email' && template.subject) {
			textToCopy = `Subject: ${template.subject}\n\n${template.body}`;
		}

		try {
			await navigator.clipboard.writeText(textToCopy);
			setCopiedId(template.id);
			setTimeout(() => setCopiedId(null), 2000);
		} catch (error) {
			console.error('Error copying to clipboard:', error);
		}
	};

	const handleDelete = async (id: string) => {
		if (!confirm('Are you sure you want to delete this template?')) return;

		try {
			const response = await fetch(`/api/templates/${id}`, {
				method: 'DELETE',
			});

			if (response.ok) {
				setTemplates((prev) => prev.filter((t) => t.id !== id));
			}
		} catch (error) {
			console.error('Error deleting template:', error);
		}
	};

	const handleEdit = (template: Template) => {
		setEditingTemplate(template);
		setShowEditor(true);
	};

	const handleCreate = () => {
		setEditingTemplate(null);
		setShowEditor(true);
	};

	const handleSave = async () => {
		await fetchTemplates();
		setShowEditor(false);
		setEditingTemplate(null);
	};

	const filteredTemplates = templates.filter((template) => {
		if (selectedType !== 'all' && template.type !== selectedType)
			return false;
		if (
			selectedCategory !== 'all' &&
			template.category !== selectedCategory
		)
			return false;
		return true;
	});

	const categories = [
		'all',
		...Array.from(
			new Set(templates.map((t) => t.category).filter(Boolean))
		),
	];

	return (
		<div className='space-y-6'>
			{/* Header */}
			<div className='flex items-center justify-between'>
				<div>
					<h2 className='text-2xl font-bold text-gray-900'>
						Template Library
					</h2>
					<p className='text-sm text-gray-600 mt-1'>
						Create and manage email and LinkedIn message templates
					</p>
				</div>
				<button
					onClick={handleCreate}
					className='flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors'
				>
					<Plus className='h-4 w-4' />
					<span>New Template</span>
				</button>
			</div>

			{/* Filters */}
			<Card className='p-4'>
				<div className='flex items-center space-x-4'>
					{/* Type Filter */}
					<div className='flex items-center space-x-2'>
						<button
							onClick={() => setSelectedType('all')}
							className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
								selectedType === 'all'
									? 'bg-blue-600 text-white'
									: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
							}`}
						>
							All
						</button>
						<button
							onClick={() => setSelectedType('email')}
							className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1 ${
								selectedType === 'email'
									? 'bg-blue-600 text-white'
									: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
							}`}
						>
							<Mail className='h-3 w-3' />
							<span>Email</span>
						</button>
						<button
							onClick={() => setSelectedType('linkedin')}
							className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1 ${
								selectedType === 'linkedin'
									? 'bg-blue-600 text-white'
									: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
							}`}
						>
							<MessageSquare className='h-3 w-3' />
							<span>LinkedIn</span>
						</button>
					</div>

					{/* Category Filter */}
					{categories.length > 1 && (
						<div className='flex-1'>
							<select
								value={selectedCategory}
								onChange={(e) =>
									setSelectedCategory(e.target.value)
								}
								className='px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent'
							>
								{categories.map((cat) => (
									<option key={cat} value={cat}>
										{cat === 'all'
											? 'All Categories'
											: cat
													?.split('_')
													.map(
														(w) =>
															w
																.charAt(0)
																.toUpperCase() +
															w.slice(1)
													)
													.join(' ')}
									</option>
								))}
							</select>
						</div>
					)}
				</div>
			</Card>

			{/* Templates Grid */}
			{isLoading ? (
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
					{[1, 2, 3].map((i) => (
						<Card key={i} className='p-4'>
							<div className='animate-pulse space-y-3'>
								<div className='h-4 bg-gray-200 rounded w-3/4'></div>
								<div className='h-3 bg-gray-200 rounded w-1/2'></div>
								<div className='h-16 bg-gray-200 rounded'></div>
							</div>
						</Card>
					))}
				</div>
			) : filteredTemplates.length === 0 ? (
				<Card className='p-12 text-center'>
					<div className='text-gray-400 mb-2'>
						{selectedType === 'email' ? (
							<Mail className='h-16 w-16 mx-auto' />
						) : selectedType === 'linkedin' ? (
							<MessageSquare className='h-16 w-16 mx-auto' />
						) : (
							<div className='h-16 w-16 mx-auto flex items-center justify-center text-4xl'>
								📝
							</div>
						)}
					</div>
					<p className='text-gray-600 font-medium'>
						No templates found
					</p>
					<p className='text-sm text-gray-500 mt-1'>
						Create your first template to get started
					</p>
				</Card>
			) : (
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
					{filteredTemplates.map((template) => (
						<Card
							key={template.id}
							className='p-4 hover:shadow-lg transition-shadow'
						>
							<div className='flex items-start justify-between mb-3'>
								<div className='flex items-center space-x-2'>
									{template.type === 'email' ? (
										<Mail className='h-4 w-4 text-blue-600' />
									) : (
										<MessageSquare className='h-4 w-4 text-indigo-600' />
									)}
									<h3 className='font-semibold text-gray-900'>
										{template.name}
									</h3>
								</div>
								{template.category && (
									<span className='text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full'>
										{template.category
											.split('_')
											.map(
												(w) =>
													w.charAt(0).toUpperCase() +
													w.slice(1)
											)
											.join(' ')}
									</span>
								)}
							</div>

							{template.subject && (
								<p className='text-sm text-gray-700 font-medium mb-2'>
									Subject: {template.subject}
								</p>
							)}

							<p className='text-sm text-gray-600 line-clamp-3 mb-4'>
								{template.body}
							</p>

							<div className='flex items-center justify-between pt-3 border-t border-gray-200'>
								<button
									onClick={() => handleCopy(template)}
									className='flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700 transition-colors'
								>
									{copiedId === template.id ? (
										<>
											<Check className='h-4 w-4' />
											<span>Copied!</span>
										</>
									) : (
										<>
											<Copy className='h-4 w-4' />
											<span>Copy</span>
										</>
									)}
								</button>
								<div className='flex items-center space-x-2'>
									<button
										onClick={() => handleEdit(template)}
										className='p-1 text-gray-600 hover:text-blue-600 transition-colors'
									>
										<Edit className='h-4 w-4' />
									</button>
									<button
										onClick={() =>
											handleDelete(template.id)
										}
										className='p-1 text-gray-600 hover:text-red-600 transition-colors'
									>
										<Trash2 className='h-4 w-4' />
									</button>
								</div>
							</div>
						</Card>
					))}
				</div>
			)}

			{/* Template Editor Modal */}
			{showEditor && (
				<TemplateEditor
					template={editingTemplate}
					onClose={() => {
						setShowEditor(false);
						setEditingTemplate(null);
					}}
					onSave={handleSave}
				/>
			)}
		</div>
	);
}
