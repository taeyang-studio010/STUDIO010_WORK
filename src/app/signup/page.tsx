"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/features/auth/useAuth";

function InviteOnlyMessage() {
  return (
    <div className="glass-panel-strong w-full max-w-sm rounded-2xl border border-border p-8 text-center">
      <h1 className="text-xl font-semibold text-white">회원가입</h1>
      <p className="mt-1 text-sm text-text-secondary">
        STUDIO 010 협업 워크스페이스
      </p>
      <div className="mt-6 space-y-4 text-left text-sm text-text-secondary">
        <p>
          가입은 <strong className="text-white">호스트(조태양)</strong>의 초대를 통해서만 가능합니다.
        </p>
        <p>
          호스트가 보낸 <strong className="text-white">초대 메일</strong>을 받으셨다면, 메일 안의 링크를 눌러 비밀번호를 설정한 뒤 로그인하세요.
        </p>
        <p>
          초대를 받지 않으셨다면 호스트에게 연락해 주세요.
        </p>
      </div>
      <p className="mt-8 text-center text-sm text-text-secondary">
        이미 계정이 있으신가요?{" "}
        <Link href="/login" className="text-accent hover:underline">
          로그인
        </Link>
      </p>
      <Link
        href="/login"
        className="mt-4 block w-full rounded-lg border border-border py-2.5 text-center text-sm text-white hover:bg-white/5"
      >
        로그인 화면으로
      </Link>
    </div>
  );
}

function SignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const showHostForm = searchParams.get("host") === "1";

  const { signUp } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { data, error: err } = await signUp(email, password, name || undefined);
    setLoading(false);
    if (err) {
      setError(err.message ?? "회원가입에 실패했습니다.");
      return;
    }
    if (data?.user && !data.session) {
      setSuccess(true);
      return;
    }
    router.push("/");
    router.refresh();
  }

  if (!showHostForm) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] px-4">
        <InviteOnlyMessage />
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] px-4">
        <div className="glass-panel-strong w-full max-w-sm rounded-2xl border border-border p-8 text-center">
          <p className="text-white">가입한 이메일로 확인 링크를 보냈습니다. 메일을 확인한 뒤 로그인해 주세요.</p>
          <Link href="/login" className="mt-4 inline-block text-accent hover:underline">로그인으로 이동</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] px-4">
      <div className="glass-panel-strong w-full max-w-sm rounded-2xl border border-border p-8">
        <h1 className="text-xl font-semibold text-white">호스트 회원가입</h1>
        <p className="mt-1 text-sm text-text-secondary">
          STUDIO 010 · 한 번만 가입하세요.
        </p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-text-secondary">
              이름 (선택)
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-border bg-white/5 px-3 py-2 text-white placeholder:text-text-tertiary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              placeholder="홍길동"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-text-secondary">
              이메일
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full rounded-lg border border-border bg-white/5 px-3 py-2 text-white placeholder:text-text-tertiary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-text-secondary">
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="mt-1 w-full rounded-lg border border-border bg-white/5 px-3 py-2 text-white placeholder:text-text-tertiary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              placeholder="6자 이상"
            />
          </div>
          {error && (
            <p className="text-sm text-red-400">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-accent py-2.5 font-medium text-[#0a0a0a] transition-fluid hover:bg-accent/90 disabled:opacity-50"
          >
            {loading ? "가입 중…" : "회원가입"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-text-secondary">
          이미 계정이 있으신가요?{" "}
          <Link href="/login" className="text-accent hover:underline">
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-[#0a0a0a]"><p className="text-text-secondary">로딩 중...</p></div>}>
      <SignupContent />
    </Suspense>
  );
}
