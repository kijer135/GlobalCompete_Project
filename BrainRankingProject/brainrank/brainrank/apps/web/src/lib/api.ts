const BASE_URL = "http://localhost:4000";

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...options.headers },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "요청에 실패했습니다.");
  return data as T;
}
