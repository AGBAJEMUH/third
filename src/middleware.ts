import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('auth_token');
    const { pathname } = request.nextUrl;

    // Protected routes
    const protectedRoutes = ['/workspace'];
    const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

    // Redirect to login if accessing protected route without token
    if (isProtectedRoute && !token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Redirect to workspace if accessing auth pages with token
    const authRoutes = ['/login', '/register'];
    const isAuthRoute = authRoutes.includes(pathname);

    if (isAuthRoute && token) {
        return NextResponse.redirect(new URL('/workspace', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/workspace/:path*', '/login', '/register'],
};
