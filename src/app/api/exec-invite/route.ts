import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    return null;
  }

  return createClient<Database>(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export async function POST(req: Request) {
  const admin = getAdminClient();
  if (!admin) {
    return NextResponse.json(
      { error: "Supabase service role 환경변수가 설정되지 않았습니다." },
      { status: 500 }
    );
  }

  const body = (await req.json()) as { email?: string; name?: string; role?: string };
  const email = body.email?.trim();
  const name = body.name?.trim();
  const role = body.role?.trim();

  if (!email) {
    return NextResponse.json({ error: "이메일은 필수입니다." }, { status: 400 });
  }

  const serverClient = await getSupabaseServerClient();
  if (!serverClient) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }
  const userResult = await serverClient.auth.getUser();
  const inviterId = userResult?.data.user?.id ?? null;
  if (!inviterId) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const { data: profile } = await serverClient
    .from("profiles")
    .select("is_exec")
    .eq("id", inviterId)
    .single();
  if (!profile?.is_exec) {
    return NextResponse.json(
      { error: "호스트(관리자)만 초대할 수 있습니다." },
      { status: 403 }
    );
  }

  const inviteResult = await admin.auth.admin.inviteUserByEmail(email, {
    data: {
      name: name ?? null,
      role: role ?? "임원",
      is_exec: false,
    },
  });

  if (inviteResult.error) {
    return NextResponse.json({ error: inviteResult.error.message }, { status: 400 });
  }

  const { error } = await admin
    .from("exec_invites")
    .upsert(
      {
        email,
        name: name ?? null,
        role: role ?? "임원",
        invited_by: inviterId,
        status: "pending",
        invited_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      } as any,
      { onConflict: "email" }
    );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
