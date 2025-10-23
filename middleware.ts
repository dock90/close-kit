import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export default clerkMiddleware(async (auth, req) => {
	const { userId } = await auth();

	const isPublicRoute = ['/', '/sign-in', '/sign-up'].some((route) =>
		req.nextUrl.pathname.startsWith(route)
	);

	// Allow public routes
	if (isPublicRoute) {
		return NextResponse.next();
	}

	// Redirect unauthenticated users to sign-in
	if (!userId) {
		return NextResponse.redirect(new URL('/sign-in', req.url));
	}

	// For all other authenticated routes, allow through
	return NextResponse.next();
});

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes - let them handle their own auth)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * - files with extensions (images, css, js, etc.)
		 */
		'/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)).*)',
	],
};
