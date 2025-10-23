import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher(['/', '/sign-in', '/sign-up(.*)']);

export default clerkMiddleware(async (auth, req) => {
	if (!isPublicRoute(req)) {
		await auth.protect();
	}
});

export const config = {
	matcher: [
		// Match all request paths except for the ones starting with:
		// - _next/static (static files)
		// - _next/image (image optimization files)
		// - favicon.ico (favicon file)
		// - files with extensions (images, css, js, etc.)
		'/((?!.*\\..*|_next).*)',
		'/',
		'/(api|trpc)(.*)',
	],
};
