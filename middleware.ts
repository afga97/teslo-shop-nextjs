// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from 'next-auth/jwt';


const validJwt = async (req: NextRequest) => {

  const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if ( !session ) {
    const url = req.nextUrl.clone()
    url.pathname = '/auth/login'
    return NextResponse.redirect(url);
  }
  return NextResponse.next();

  // const dataCookies: any = req.headers.get("cookie");
  // if (dataCookies) {
  //   let cookieValue = dataCookies
  //     .split(";")
  //     .find((c: any) => c.trim().startsWith(`token=`));
  //   if (cookieValue) {
  //     cookieValue = cookieValue.replaceAll('token=')
      
  //   }
  // }
};

const validRole = async (req: NextRequest) => {
    const validRoles = ['admin', 'super-user', 'seo'];
    const session: any = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const url = req.nextUrl.clone()
    url.pathname = '/'
    if ( !session ) {
      return NextResponse.redirect(url);
    }
    if (!validRoles.includes(session.user.role)) {
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
}

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith("/checkout")) {
    return validJwt(req)
  }
  if (req.nextUrl.pathname.startsWith("/admin")) {
    return validRole(req)
  }
  if (req.nextUrl.pathname.startsWith("/api/admin")) {
    return validRole(req)
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    // '/api/:path',
    "/checkout/:path*",
    "/admin/:path*",
    "/api/admin/:path*",
  ],
};
