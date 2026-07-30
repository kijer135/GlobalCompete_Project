import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifyToken, type JwtPayload } from "./jwt";

export const COOKIE_NAME = "token";

export const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const, // 프론트와 같은 도메인이므로 lax로 충분
  secure: process.env.NODE_ENV === "production",
  maxAge: 7 * 24 * 60 * 60,
  path: "/",
};

/** 요청 쿠키에서 인증 정보를 읽는다. 미로그인 시 null. */
export async function getAuth(): Promise<JwtPayload | null> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    return verifyToken(token);
  } catch {
    return null;
  }
}

export function unauthorized() {
  return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
}

export function forbidden() {
  return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
}
