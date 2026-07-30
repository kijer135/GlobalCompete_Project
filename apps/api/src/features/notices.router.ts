import { Router } from "express";
import { prisma } from "../lib/prisma.js";

export const noticesRouter = Router();

noticesRouter.get("/", async (_req, res) => {
  const notices = await prisma.notice.findMany({ orderBy: { createdAt: "desc" }, take: 20 });
  res.json({ notices });
});
