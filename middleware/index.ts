import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function middleware(request: NextRequest) {
    const sessionCookie = getSessionCookie(request);
    const guestCookie = request.cookies.get('guest_mode');

    // Validate guest cookie value\
    const isValidGuest = guestCookie?.value === 'true';

    // Allow access if user has either a valid session OR valid guest mode
    if (!sessionCookie && !isValidGuest) {
        return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|sign-in|sign-up|assets).*)',
    ],
};
