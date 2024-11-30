import { NextRequest, NextResponse } from "next/server";
import { getUserData } from "./lib/actions/UserActions";

export async function middleware(req: NextRequest) {    
    const userData = await getUserData();
    
    if (!userData) {
        const loginUrl = new URL('/login', req.url);

        return NextResponse.redirect(loginUrl);
    } else {
        return NextResponse.next();
    }
}

export const config = {
    matcher: [
        /*
            * Match all request paths except for the ones starting with:
            * - login
            * - register
            * - _next/static (static files)
            * - _next/image (image optimization files)
            * - favicon.ico (favicon file)
            * - .*\\. (all files with extensions) - because public did not work and it fired for images and icons
        */
        '/((?!login|register|_next/static|_next/image|favicon.ico|.*\\.).*)',
    ]
};