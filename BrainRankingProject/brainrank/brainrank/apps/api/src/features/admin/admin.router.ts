import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../lib/prisma.js";
import { requireAdmin } from "../../middleware/auth.js";

export const adminRouter = Router();
adminRouter.use(requireAdmin);

// ----- 유저 관리 -----
adminRouter.get("/users", async (_req, res) => {
  const users = await prisma.user.findMany({
    select: { id: true, email: true, nickname: true, role: true, createdAt: true, lastLoginAt: true },
    orderBy: { createdAt: "desc" },
  });
  res.json({ users });
});

adminRouter.patch("/users/:id/role", async (req, res) => {
  const parsed = z.object({ role: z.enum(["USER", "ADMIN"]) }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "잘못된 역할입니다." });
  const user = await prisma.user.update({
    where: { id: req.params.id },
    data: { role: parsed.data.role },
    select: { id: true, role: true },
  });
  res.json({ user });
});

// ----- 공지 관리 -----
const noticeSchema = z.object({ title: z.string().min(1).max(100), content: z.string().min(1) });

adminRouter.post("/notices", async (req, res) => {
  const parsed = noticeSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "제목과 내용을 입력하세요." });
  const notice = await prisma.notice.create({ data: parsed.data });
  res.status(201).json({ notice });
});

adminRouter.delete("/notices/:id", async (req, res) => {
  await prisma.notice.delete({ where: { id: req.params.id } });
  res.json({ ok: true });
});

// ----- 테스트 관리 (활성/비활성) -----
adminRouter.patch("/tests/:id/active", async (req, res) => {
  const parsed = z.object({ isActive: z.boolean() }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "잘못된 요청입니다." });
  const test = await prisma.test.update({
    where: { id: req.params.id },
    data: { isActive: parsed.data.isActive },
  });
  res.json({ test });
});
