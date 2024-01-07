import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(req) {
    // console.log(req.nextUrl);
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const isAdminPath = req.nextUrl.pathname.includes('/admin');
        const isProfessionalPath = req.nextUrl.pathname.includes('/counselor');
        const isCarerPath = req.nextUrl.pathname.includes('/carer');
        const role = token?.role;
        // return NextResponse.redirect(new URL('/logout'));
        if (!role) {
          return false;
        }

        if (isAdminPath && role === 'admin') {
          return true;
        } else if (isProfessionalPath && role === 'professional') {
          return true;
        } else if (isCarerPath && role === 'carer') {
          return true;
        }
        return false;
      },
    },
  },
);

export const config = {
  matcher: ['/carer/:path*', '/admin/:path*', '/counselor/:path*'],
};
