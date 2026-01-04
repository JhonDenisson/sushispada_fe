import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/', '/orders', '/profile', '/checkout', '/cart'];

const guestRoutes = ['/sign-up', '/sign-in'];

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const sessionCookie = request.cookies.get('access_token');
    const isAuthenticated = !!sessionCookie;

    const isProtectedRoute = protectedRoutes.some((route) =>
        route === '/' ? pathname === '/' : pathname.startsWith(route)
    );

    if (isProtectedRoute) {
        if (!isAuthenticated) {
            const loginUrl = new URL('/sign-in', request.url);
            loginUrl.searchParams.set('redirect', pathname);
            return NextResponse.redirect(loginUrl);
        }
    }

    if (guestRoutes.some((route) => pathname.startsWith(route))) {
        if (isAuthenticated) {
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/',
        '/orders/:path*',
        '/profile/:path*',
        '/checkout',
        '/cart',
        '/sign-in',
        '/sign-up',
    ],
};
