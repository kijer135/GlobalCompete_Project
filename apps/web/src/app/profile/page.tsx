"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/features/auth/AuthProvider";

interface ProfileData {
  user: { nickname: string; email: string; createdAt: string; loginStreak: number };
  achievements: { achievement: { id: string; name: string; description: string; icon: string }; unlockedAt: string }[];
  recentResults: { id: string; score: number; createdAt: string; test: { name: string; unit: string } }[];
  totalPlays: number;
}

export default function ProfilePage() {
  const { user, loading, refresh } = useAuth();
  const [data, setData] = useState<ProfileData | null>(null);
  const [nickname, setNickname] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!user) return;
    api<ProfileData>("/users/me/profile").then((d) => {
      setData(d);
      setNickname(d.user.nickname);
    }).catch(() => {});
  }, [user]);

  if (loading) return <main className="p-6">불러오는 중...</main>;
  if (!user) return <main className="p-6">로그인이 필요합니다.</main>;
  if (!data) return <main className="p-6">불러오는 중...</main>;

  async function changeNickname(e: React.FormEvent) {
    e.preventDefault();
    try {
      await api("/users/me/nickname", { method: "PATCH", body: JSON.stringify({ nickname }) });
      await refresh();
      setMessage("닉네임이 변경되었습니다.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "변경 실패");
    }
  }

  return (
    <main className="mx-auto max-w-3xl space-y-10 p-6">
      <section>
        <h1 className="text-3xl font-bold">프로필</h1>
        <p className="mt-2 text-sm text-gray-500">
          {data.user.email} · 총 {data.totalPlays}회 플레이 · 연속 로그인 {data.user.loginStreak}일
        </p>
        <form onSubmit={changeNickname} className="mt-4 flex gap-2">
          <input value={nickname} onChange={(e) => setNickname(e.target.value)}
            minLength={2} maxLength={16} className="rounded-lg border px-3 py-2" />
          <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
            닉네임 변경
          </button>
        </form>
        {message && <p className="mt-2 text-sm text-gray-500">{message}</p>}
      </section>

      <section>
        <h2 className="mb-3 text-xl font-bold">업적</h2>
        {data.achievements.length === 0 ? (
          <p className="text-gray-400">아직 획득한 업적이 없습니다.</p>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {data.achievements.map((a) => (
              <div key={a.achievement.id} className="flex items-center gap-3 rounded-xl border p-4">
                <span className="text-3xl">{a.achievement.icon}</span>
                <div>
                  <p className="font-semibold">{a.achievement.name}</p>
                  <p className="text-sm text-gray-500">{a.achievement.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-xl font-bold">최근 기록</h2>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b text-gray-500">
              <th className="py-2">테스트</th><th>기록</th><th>일시</th>
            </tr>
          </thead>
          <tbody>
            {data.recentResults.map((r) => (
              <tr key={r.id} className="border-b">
                <td className="py-2">{r.test.name}</td>
                <td className="font-mono">{r.score} {r.test.unit}</td>
                <td className="text-gray-500">{new Date(r.createdAt).toLocaleString("ko-KR")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
