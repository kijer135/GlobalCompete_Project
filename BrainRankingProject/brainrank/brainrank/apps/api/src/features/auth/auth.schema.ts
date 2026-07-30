import { z } from "zod";

export const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "비밀번호는 8자 이상이어야 합니다."),
  nickname: z.string().min(2).max(16),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});
