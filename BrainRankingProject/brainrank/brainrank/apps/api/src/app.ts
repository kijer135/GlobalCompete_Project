import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { authRouter } from "./features/auth/auth.router.js";
import { testsRouter } from "./features/tests/tests.router.js";
import { resultsRouter } from "./features/results/results.router.js";
import { rankingsRouter } from "./features/rankings/rankings.router.js";
import { usersRouter } from "./features/users/users.router.js";
import { adminRouter } from "./features/admin/admin.router.js";
import { noticesRouter } from "./features/notices.router.js";

export function createApp() {
  const app = express();

  app.use(cors({ origin: "http://localhost:3000", credentials: true }));
  app.use(express.json());
  app.use(cookieParser());

  app.get("/health", (_req, res) => res.json({ status: "ok" }));
  app.use("/auth", authRouter);
  app.use("/tests", testsRouter);
  app.use("/results", resultsRouter);
  app.use("/rankings", rankingsRouter);
  app.use("/users", usersRouter);
  app.use("/admin", adminRouter);
  app.use("/notices", noticesRouter);

  return app;
}
