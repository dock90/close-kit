import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
	'/', 
	'/sign-in(.*)', 
	'/sign-up(.*)',
	'/api/webhooks(.*)'
]);

const isOnboardingRoute = createRouteMatcher(['/onboarding']);

export default clerkMiddleware(async (auth, req) => {
	const { userId } = await auth();

	// Allow public routes
	if (isPublicRoute(req)) {
		return NextResponse.next();
	}

	// Protect all other routes
	if (!userId) {
		return auth.protect();
	}

	// If user is authenticated but not on onboarding, check if they need onboarding
	if (!isOnboardingRoute(req) && userId) {
		// Check if user has an organization by looking at their metadata
		// This will be set after they complete onboarding
		const user = await auth();
		
		// If on API routes or webhooks, allow through (API will handle auth)
		if (req.nextUrl.pathname.startsWith('/api')) {
			return NextResponse.next();
		}

		// For dashboard routes, users must have completed onboarding
		// The onboarding page itself will check if user already has org and redirect to dashboard
		return NextResponse.next();
	}

	return NextResponse.next();
});

export const config = {
	matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
