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

	// Allow API routes to proceed (they handle their own auth)
	if (req.nextUrl.pathname.startsWith('/api')) {
		return NextResponse.next();
	}

	// For all other authenticated routes, allow through
	return NextResponse.next();
});

export const config = {
	matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
