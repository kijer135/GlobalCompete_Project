"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/features/auth/AuthProvider";

export default function SignupPage() {
  const { signup } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await signup(email, password, nickname);
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "회원가입 실패");
    }
  }

  return (
    <main className="flex min-h-[80vh] items-center justify-center">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4 rounded-xl border p-8">
        <h1 className="text-2xl font-bold">회원가입</h1>
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
          placeholder="이메일" className="w-full rounded-lg border px-3 py-2" />
        <input type="text" required minLength={2} maxLength={16} value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="닉네임 (2~16자)" className="w-full rounded-lg border px-3 py-2" />
        <input type="password" required minLength={8} value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호 (8자 이상)" className="w-full rounded-lg border px-3 py-2" />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button type="submit" className="w-full rounded-lg bg-blue-600 py-2 font-semibold text-white hover:bg-blue-700">
          가입하기
        </button>
        <p className="text-sm text-gray-500">
          이미 계정이 있나요? <Link href="/login" className="text-blue-600 underline">로그인</Link>
        </p>
      </form>
    </main>
  );
}
