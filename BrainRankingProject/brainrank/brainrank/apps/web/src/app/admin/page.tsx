"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/features/auth/AuthProvider";

interface AdminUser {
  id: string;
  email: string;
  nickname: string;
  role: "USER" | "ADMIN";
  createdAt: string;
}

export default function AdminPage() {
  const { user, loading } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user?.role !== "ADMIN") return;
    api<{ users: AdminUser[] }>("/admin/users").then((d) => setUsers(d.users)).catch(() => {});
  }, [user]);

  if (loading) return <main className="p-6">불러오는 중...</main>;
  if (user?.role !== "ADMIN") return <main className="p-6">권한이 없습니다.</main>;

  async function toggleRole(u: AdminUser) {
    const role = u.role === "ADMIN" ? "USER" : "ADMIN";
    await api(`/admin/users/${u.id}/role`, { method: "PATCH", body: JSON.stringify({ role }) });
    setUsers((prev) => prev.map((x) => (x.id === u.id ? { ...x, role } : x)));
  }

  async function createNotice(e: React.FormEvent) {
    e.preventDefault();
    try {
      await api("/admin/notices", { method: "POST", body: JSON.stringify({ title, content }) });
      setTitle(""); setContent("");
      setMessage("공지가 등록되었습니다.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "등록 실패");
    }
  }

  return (
    <main className="mx-auto max-w-4xl space-y-10 p-6">
      <h1 className="text-3xl font-bold">관리자</h1>

      <section>
        <h2 className="mb-3 text-xl font-bold">공지 작성</h2>
        <form onSubmit={createNotice} className="space-y-3">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="제목"
            className="w-full rounded-lg border px-3 py-2" required />
          <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="내용"
            className="h-28 w-full rounded-lg border px-3 py-2" required />
          <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
            등록
          </button>
          {message && <p className="text-sm text-gray-500">{message}</p>}
        </form>
      </section>

      <section>
        <h2 className="mb-3 text-xl font-bold">유저 관리</h2>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b text-gray-500">
              <th className="py-2">닉네임</th><th>이메일</th><th>역할</th><th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b">
                <td className="py-2">{u.nickname}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td className="text-right">
                  <button onClick={() => toggleRole(u)} className="text-blue-600 hover:underline">
                    {u.role === "ADMIN" ? "USER로 변경" : "ADMIN으로 변경"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
