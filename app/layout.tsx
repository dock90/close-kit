import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'CloseKit - Sales Pipeline CRM',
	description: 'Multi-tenant Sales Pipeline CRM for freelancers and agencies',
	manifest: '/manifest.json',
	themeColor: '#4f46e5',
	appleWebApp: {
		capable: true,
		statusBarStyle: 'default',
		title: 'CloseKit',
	},
	viewport: {
		width: 'device-width',
		initialScale: 1,
		maximumScale: 1,
	},
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<ClerkProvider>
			<html lang='en'>
				<body className={inter.className}>{children}</body>
			</html>
		</ClerkProvider>
	);
}
