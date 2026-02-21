import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { getSupabaseEnv, hasSupabaseEnv } from "@/lib/supabase/env";

const protectedPaths = ["/", "/tasks", "/calendar", "/budget", "/insights", "/talk"];
const authPaths = ["/login", "/signup"];

function isProtected(pathname: string) {
  return protectedPaths.some((p) => pathname === p || pathname.startsWith(p + "/"));
}
function isAuthPath(pathname: string) {
  return authPaths.some((p) => pathname.startsWith(p));
}

export async function middleware(request: NextRequest) {
  let res = NextResponse.next({ request });

  if (!hasSupabaseEnv()) {
    return res;
  }

  const { url, anonKey } = getSupabaseEnv();
  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        res = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          res.cookies.set(name, value, options as Record<string, unknown>);
        });
      },
    },
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (isProtected(request.nextUrl.pathname) && !session) {
    const redirect = new URL("/login", request.url);
    redirect.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(redirect);
  }

  if (isAuthPath(request.nextUrl.pathname) && session) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
