import { Router } from "express";
import { getTestRanking, getOverallRanking, type Period } from "./rankings.service.js";

export const rankingsRouter = Router();

const PERIODS: Period[] = ["daily", "weekly", "monthly", "all"];

rankingsRouter.get("/overall", async (_req, res) => {
  const entries = await getOverallRanking();
  res.json({ entries });
});

rankingsRouter.get("/:testId", async (req, res) => {
  const period = (req.query.period as Period) ?? "all";
  if (!PERIODS.includes(period)) return res.status(400).json({ error: "잘못된 기간입니다." });
  const entries = await getTestRanking(req.params.testId, period);
  res.json({ entries });
});
