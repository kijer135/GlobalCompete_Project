"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/AuthProvider";

export function Header() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.push("/");
  }

  return (
    <header className="border-b">
      <div className="mx-auto flex max-w-5xl items-center justify-between p-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-xl font-bold">BrainRank</Link>
          <nav className="flex gap-4 text-sm text-gray-600">
            <Link href="/tests" className="hover:text-black">테스트</Link>
            <Link href="/rankings" className="hover:text-black">랭킹</Link>
          </nav>
        </div>
        <div className="flex items-center gap-3 text-sm">
          {loading ? null : user ? (
            <>
              {user.role === "ADMIN" && (
                <Link href="/admin" className="text-red-500 hover:underline">관리자</Link>
              )}
              <Link href="/profile" className="font-semibold hover:underline">{user.nickname}</Link>
              <button onClick={handleLogout} className="text-gray-500 hover:text-black">로그아웃</button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:underline">로그인</Link>
              <Link href="/signup" className="rounded-lg bg-blue-600 px-3 py-1.5 text-white hover:bg-blue-700">
                회원가입
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
