import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
	'/',
	'/sign-in(.*)',
	'/sign-up(.*)',
	'/api/webhooks(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
	const { userId } = await auth();

	// Allow public routes
	if (isPublicRoute(req)) {
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
