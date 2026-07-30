"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/features/auth/AuthProvider";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await login(email, password);
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "로그인 실패");
    }
  }

  return (
    <main className="flex min-h-[80vh] items-center justify-center">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4 rounded-xl border p-8">
        <h1 className="text-2xl font-bold">로그인</h1>
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
          placeholder="이메일" className="w-full rounded-lg border px-3 py-2" />
        <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호" className="w-full rounded-lg border px-3 py-2" />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button type="submit" className="w-full rounded-lg bg-blue-600 py-2 font-semibold text-white hover:bg-blue-700">
          로그인
        </button>
        <p className="text-sm text-gray-500">
          계정이 없나요? <Link href="/signup" className="text-blue-600 underline">회원가입</Link>
        </p>
      </form>
    </main>
  );
}
