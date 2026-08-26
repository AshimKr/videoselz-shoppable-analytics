import express from "express";
import cors from "cors";
import prisma from "./db/prisma.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.json({
      success: true,
      message: "Videoselz Analytics API is running",
      database: "connected"
    });
  } catch (error) {
    console.error("Health check failed:", error);

    res.status(503).json({
      success: false,
      message: "Service unavailable",
      database: "disconnected"
    });
  }
});

export default app;