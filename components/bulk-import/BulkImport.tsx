'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Upload, X, Download, Check, AlertCircle } from 'lucide-react';

type ImportType = 'companies' | 'contacts';

interface ColumnMapping {
	csvColumn: string;
	dbField: string;
}

export function BulkImport() {
	const [importType, setImportType] = useState<ImportType>('companies');
	const [file, setFile] = useState<File | null>(null);
	const [csvData, setCsvData] = useState<any[]>([]);
	const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
	const [columnMappings, setColumnMappings] = useState<ColumnMapping[]>([]);
	const [isUploading, setIsUploading] = useState(false);
	const [isImporting, setIsImporting] = useState(false);
	const [importResult, setImportResult] = useState<{
		success: number;
		failed: number;
		errors: string[];
	} | null>(null);
	const [step, setStep] = useState<'upload' | 'mapping' | 'preview' | 'complete'>(
		'upload'
	);

	const companyFields = [
		{ value: 'name', label: 'Company Name *', required: true },
		{ value: 'website', label: 'Website', required: false },
		{ value: 'industry', label: 'Industry', required: false },
		{ value: 'employeeCount', label: 'Employee Count', required: false },
		{ value: 'fundingStage', label: 'Funding Stage', required: false },
		{ value: 'location', label: 'Location', required: false },
		{ value: 'linkedinUrl', label: 'LinkedIn URL', required: false },
		{ value: 'notes', label: 'Notes', required: false },
	];

	const contactFields = [
		{ value: 'firstName', label: 'First Name *', required: true },
		{ value: 'lastName', label: 'Last Name *', required: true },
		{ value: 'email', label: 'Email', required: false },
		{ value: 'phone', label: 'Phone', required: false },
		{ value: 'title', label: 'Title', required: false },
		{ value: 'linkedinUrl', label: 'LinkedIn URL', required: false },
		{ value: 'companyName', label: 'Company Name *', required: true },
	];

	const availableFields = importType === 'companies' ? companyFields : contactFields;

	const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const uploadedFile = e.target.files?.[0];
		if (!uploadedFile) return;

		if (!uploadedFile.name.endsWith('.csv')) {
			alert('Please upload a CSV file');
			return;
		}

		setFile(uploadedFile);
		parseCSV(uploadedFile);
	};

	const parseCSV = (file: File) => {
		setIsUploading(true);
		const reader = new FileReader();

		reader.onload = (e) => {
			const text = e.target?.result as string;
			const lines = text.split('\n').filter((line) => line.trim());

			if (lines.length === 0) {
				alert('CSV file is empty');
				setIsUploading(false);
				return;
			}

			// Parse headers
			const headers = lines[0].split(',').map((h) => h.trim());
			setCsvHeaders(headers);

			// Parse data
			const data = lines.slice(1).map((line) => {
				const values = line.split(',').map((v) => v.trim());
				const row: any = {};
				headers.forEach((header, index) => {
					row[header] = values[index] || '';
				});
				return row;
			});

			setCsvData(data);

			// Auto-map columns
			const autoMappings: ColumnMapping[] = headers.map((header) => {
				const normalizedHeader = header.toLowerCase().replace(/\s+/g, '');
				const matchedField = availableFields.find(
					(field) =>
						field.value.toLowerCase() === normalizedHeader ||
						field.label.toLowerCase().replace(/\s+/g, '') ===
							normalizedHeader
				);

				return {
					csvColumn: header,
					dbField: matchedField?.value || '',
				};
			});

			setColumnMappings(autoMappings);
			setIsUploading(false);
			setStep('mapping');
		};

		reader.onerror = () => {
			alert('Error reading file');
			setIsUploading(false);
		};

		reader.readAsText(file);
	};

	const handleMappingChange = (csvColumn: string, dbField: string) => {
		setColumnMappings((prev) =>
			prev.map((mapping) =>
				mapping.csvColumn === csvColumn
					? { ...mapping, dbField }
					: mapping
			)
		);
	};

	const validateMappings = () => {
		const requiredFields = availableFields
			.filter((f) => f.required)
			.map((f) => f.value);
		const mappedFields = columnMappings
			.filter((m) => m.dbField)
			.map((m) => m.dbField);

		const missingFields = requiredFields.filter(
			(field) => !mappedFields.includes(field)
		);

		if (missingFields.length > 0) {
			const fieldLabels = missingFields
				.map(
					(field) =>
						availableFields.find((f) => f.value === field)?.label
				)
				.join(', ');
			alert(`Please map the following required fields: ${fieldLabels}`);
			return false;
		}

		return true;
	};

	const handlePreview = () => {
		if (!validateMappings()) return;
		setStep('preview');
	};

	const handleImport = async () => {
		if (!validateMappings()) return;

		setIsImporting(true);

		try {
			const mappedData = csvData.map((row) => {
				const mappedRow: any = {};
				columnMappings.forEach((mapping) => {
					if (mapping.dbField) {
						mappedRow[mapping.dbField] = row[mapping.csvColumn];
					}
				});
				return mappedRow;
			});

			const response = await fetch(`/api/${importType}/bulk-import`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: mappedData }),
			});

			if (!response.ok) throw new Error('Import failed');

			const result = await response.json();
			setImportResult(result);
			setStep('complete');
		} catch (error) {
			console.error('Error importing data:', error);
			alert('Import failed. Please try again.');
		} finally {
			setIsImporting(false);
		}
	};

	const handleReset = () => {
		setFile(null);
		setCsvData([]);
		setCsvHeaders([]);
		setColumnMappings([]);
		setImportResult(null);
		setStep('upload');
	};

	const downloadTemplate = () => {
		const fields = availableFields.map((f) => f.label.replace(' *', ''));
		const csv = fields.join(',') + '\n';
		const blob = new Blob([csv], { type: 'text/csv' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `${importType}_template.csv`;
		a.click();
		URL.revokeObjectURL(url);
	};

	return (
		<div className='space-y-6'>
			{/* Header */}
			<div className='flex items-center justify-between'>
				<div>
					<h2 className='text-2xl font-bold text-gray-900'>
						Bulk Import
					</h2>
					<p className='text-sm text-gray-600 mt-1'>
						Import companies and contacts from CSV files
					</p>
				</div>
				<button
					onClick={downloadTemplate}
					className='flex items-center space-x-2 text-blue-600 hover:text-blue-700 border border-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors'
				>
					<Download className='h-4 w-4' />
					<span>Download Template</span>
				</button>
			</div>

			{/* Import Type Selection */}
			<Card className='p-4'>
				<div className='flex items-center space-x-4'>
					<label className='text-sm font-medium text-gray-700'>
						Import Type:
					</label>
					<button
						onClick={() => {
							setImportType('companies');
							handleReset();
						}}
						className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
							importType === 'companies'
								? 'bg-blue-600 text-white'
								: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
						}`}
					>
						Companies
					</button>
					<button
						onClick={() => {
							setImportType('contacts');
							handleReset();
						}}
						className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
							importType === 'contacts'
								? 'bg-blue-600 text-white'
								: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
						}`}
					>
						Contacts
					</button>
				</div>
			</Card>

			{/* Upload Step */}
			{step === 'upload' && (
				<Card className='p-12'>
					<div className='max-w-xl mx-auto text-center'>
						<Upload className='h-16 w-16 text-blue-600 mx-auto mb-4' />
						<h3 className='text-xl font-semibold text-gray-900 mb-2'>
							Upload CSV File
						</h3>
						<p className='text-sm text-gray-600 mb-6'>
							Select a CSV file to import {importType}. Download the
							template above to see the correct format.
						</p>
						<input
							type='file'
							accept='.csv'
							onChange={handleFileUpload}
							className='hidden'
							id='csv-upload'
						/>
						<label
							htmlFor='csv-upload'
							className='inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 cursor-pointer transition-colors'
						>
							<Upload className='h-5 w-5' />
							<span>Select CSV File</span>
						</label>
					</div>
				</Card>
			)}

			{/* Mapping Step */}
			{step === 'mapping' && (
				<Card className='p-6'>
					<div className='mb-6'>
						<h3 className='text-lg font-semibold text-gray-900 mb-2'>
							Map CSV Columns
						</h3>
						<p className='text-sm text-gray-600'>
							Match your CSV columns to the database fields. Fields
							marked with * are required.
						</p>
					</div>

					<div className='space-y-4 mb-6'>
						{csvHeaders.map((header) => {
							const mapping = columnMappings.find(
								(m) => m.csvColumn === header
							);
							return (
								<div
									key={header}
									className='flex items-center space-x-4'
								>
									<div className='flex-1'>
										<label className='block text-sm font-medium text-gray-700 mb-1'>
											CSV Column
										</label>
										<input
											type='text'
											value={header}
											disabled
											className='w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600'
										/>
									</div>
									<div className='text-gray-400 mt-6'>→</div>
									<div className='flex-1'>
										<label className='block text-sm font-medium text-gray-700 mb-1'>
											Database Field
										</label>
										<select
											value={mapping?.dbField || ''}
											onChange={(e) =>
												handleMappingChange(
													header,
													e.target.value
												)
											}
											className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
										>
											<option value=''>
												-- Skip this column --
											</option>
											{availableFields.map((field) => (
												<option
													key={field.value}
													value={field.value}
												>
													{field.label}
												</option>
											))}
										</select>
									</div>
								</div>
							);
						})}
					</div>

					<div className='flex items-center justify-between pt-6 border-t'>
						<button
							onClick={handleReset}
							className='text-gray-600 hover:text-gray-700 transition-colors'
						>
							Cancel
						</button>
						<button
							onClick={handlePreview}
							className='bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors'
						>
							Preview Import
						</button>
					</div>
				</Card>
			)}

			{/* Preview Step */}
			{step === 'preview' && (
				<Card className='p-6'>
					<div className='mb-6'>
						<h3 className='text-lg font-semibold text-gray-900 mb-2'>
							Preview Import
						</h3>
						<p className='text-sm text-gray-600'>
							Review the first 5 rows before importing. Total rows:{' '}
							{csvData.length}
						</p>
					</div>

					<div className='overflow-x-auto mb-6'>
						<table className='w-full text-sm'>
							<thead className='bg-gray-50'>
								<tr>
									{columnMappings
										.filter((m) => m.dbField)
										.map((mapping) => (
											<th
												key={mapping.dbField}
												className='px-4 py-2 text-left text-gray-700 font-medium'
											>
												{
													availableFields.find(
														(f) =>
															f.value ===
															mapping.dbField
													)?.label
												}
											</th>
										))}
								</tr>
							</thead>
							<tbody>
								{csvData.slice(0, 5).map((row, idx) => (
									<tr
										key={idx}
										className='border-t border-gray-200'
									>
										{columnMappings
											.filter((m) => m.dbField)
											.map((mapping) => (
												<td
													key={mapping.dbField}
													className='px-4 py-2 text-gray-600'
												>
													{row[mapping.csvColumn] ||
														'-'}
												</td>
											))}
									</tr>
								))}
							</tbody>
						</table>
					</div>

					<div className='flex items-center justify-between pt-6 border-t'>
						<button
							onClick={() => setStep('mapping')}
							className='text-gray-600 hover:text-gray-700 transition-colors'
						>
							Back to Mapping
						</button>
						<button
							onClick={handleImport}
							disabled={isImporting}
							className='bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
						>
							{isImporting
								? 'Importing...'
								: `Import ${csvData.length} Rows`}
						</button>
					</div>
				</Card>
			)}

			{/* Complete Step */}
			{step === 'complete' && importResult && (
				<Card className='p-12'>
					<div className='max-w-xl mx-auto text-center'>
						{importResult.failed === 0 ? (
							<>
								<div className='h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4'>
									<Check className='h-10 w-10 text-green-600' />
								</div>
								<h3 className='text-xl font-semibold text-gray-900 mb-2'>
									Import Successful!
								</h3>
								<p className='text-sm text-gray-600 mb-6'>
									Successfully imported {importResult.success}{' '}
									{importType}.
								</p>
							</>
						) : (
							<>
								<div className='h-16 w-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4'>
									<AlertCircle className='h-10 w-10 text-yellow-600' />
								</div>
								<h3 className='text-xl font-semibold text-gray-900 mb-2'>
									Import Partially Completed
								</h3>
								<p className='text-sm text-gray-600 mb-6'>
									Successfully imported {importResult.success}{' '}
									{importType}. {importResult.failed} failed.
								</p>
								{importResult.errors.length > 0 && (
									<div className='bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left'>
										<h4 className='text-sm font-semibold text-red-900 mb-2'>
											Errors:
										</h4>
										<ul className='text-xs text-red-700 space-y-1'>
											{importResult.errors
												.slice(0, 10)
												.map((error, idx) => (
													<li key={idx}>• {error}</li>
												))}
											{importResult.errors.length >
												10 && (
												<li>
													... and{' '}
													{importResult.errors
														.length - 10}{' '}
													more errors
												</li>
											)}
										</ul>
									</div>
								)}
							</>
						)}
						<button
							onClick={handleReset}
							className='bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors'
						>
							Import Another File
						</button>
					</div>
				</Card>
			)}
		</div>
	);
}
