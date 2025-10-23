import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NewCompanyPage() {
	return (
		<div className='space-y-6'>
			<div className='flex items-center space-x-4'>
				<Link
					href='/companies'
					className='inline-flex items-center text-sm text-gray-500 hover:text-gray-700'
				>
					<ArrowLeft className='h-4 w-4 mr-1' />
					Back to Companies
				</Link>
			</div>

			<div className='max-w-2xl'>
				<h1 className='text-3xl font-bold text-gray-900'>
					Add New Company
				</h1>
				<p className='text-gray-600 mt-2'>
					Create a new company record
				</p>

				<div className='mt-8 bg-white shadow rounded-lg p-6'>
					<form className='space-y-6'>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
							<div>
								<label
									htmlFor='name'
									className='block text-sm font-medium text-gray-700'
								>
									Company Name *
								</label>
								<input
									type='text'
									id='name'
									name='name'
									required
									className='mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
									placeholder='Acme Corp'
								/>
							</div>

							<div>
								<label
									htmlFor='website'
									className='block text-sm font-medium text-gray-700'
								>
									Website
								</label>
								<input
									type='url'
									id='website'
									name='website'
									className='mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
									placeholder='https://acme.com'
								/>
							</div>

							<div>
								<label
									htmlFor='industry'
									className='block text-sm font-medium text-gray-700'
								>
									Industry
								</label>
								<select
									id='industry'
									name='industry'
									className='mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
								>
									<option value=''>Select industry</option>
									<option value='healthcare'>
										Healthcare
									</option>
									<option value='d2c'>D2C</option>
									<option value='other'>Other</option>
								</select>
							</div>

							<div>
								<label
									htmlFor='employeeCount'
									className='block text-sm font-medium text-gray-700'
								>
									Employee Count
								</label>
								<select
									id='employeeCount'
									name='employeeCount'
									className='mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
								>
									<option value=''>Select size</option>
									<option value='1-10'>1-10</option>
									<option value='11-50'>11-50</option>
									<option value='51-100'>51-100</option>
									<option value='101-500'>101-500</option>
									<option value='500+'>500+</option>
								</select>
							</div>

							<div>
								<label
									htmlFor='location'
									className='block text-sm font-medium text-gray-700'
								>
									Location
								</label>
								<input
									type='text'
									id='location'
									name='location'
									className='mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
									placeholder='San Francisco, CA'
								/>
							</div>

							<div>
								<label
									htmlFor='linkedinUrl'
									className='block text-sm font-medium text-gray-700'
								>
									LinkedIn URL
								</label>
								<input
									type='url'
									id='linkedinUrl'
									name='linkedinUrl'
									className='mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
									placeholder='https://linkedin.com/company/acme'
								/>
							</div>
						</div>

						<div>
							<label
								htmlFor='notes'
								className='block text-sm font-medium text-gray-700'
							>
								Notes
							</label>
							<textarea
								id='notes'
								name='notes'
								rows={3}
								className='mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
								placeholder='Additional notes about this company...'
							/>
						</div>

						<div className='flex justify-end space-x-3'>
							<Link
								href='/companies'
								className='px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
							>
								Cancel
							</Link>
							<button
								type='submit'
								className='px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
							>
								Create Company
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
