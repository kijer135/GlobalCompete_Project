import { Router } from "express";
import { prisma } from "../../lib/prisma.js";

export const testsRouter = Router();

testsRouter.get("/", async (_req, res) => {
  const tests = await prisma.test.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });
  res.json({ tests });
});
