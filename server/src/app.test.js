import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";

import app from "./app.js";
import prisma from "./db/prisma.js";

let existingVideo;

beforeAll(async () => {
  existingVideo = await prisma.video.findFirst({
    orderBy: {
      id: "asc"
    },
    select: {
      id: true
    }
  });

  if (!existingVideo) {
    throw new Error(
      "No videos found. Run `npm run db:seed` before running tests."
    );
  }
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("Health API", () => {
  it("returns API and database health", async () => {
    const response = await request(app)
      .get("/api/health")
      .expect(200);

    expect(response.body).toEqual({
      success: true,
      message: "Videoselz Analytics API is running",
      database: "connected"
    });
  });
});

describe("Video Analytics API", () => {
  it("returns paginated video analytics", async () => {
    const response = await request(app)
      .get("/api/analytics/videos")
      .query({
        page: 1,
        limit: 2
      })
      .expect(200);

    expect(response.body.success).toBe(true);

    expect(response.body.data).toBeInstanceOf(Array);

    expect(response.body.data.length).toBeLessThanOrEqual(2);

    expect(response.body.summary).toEqual(
      expect.objectContaining({
        views: expect.any(Number),
        clicks: expect.any(Number),
        addToCart: expect.any(Number)
      })
    );

    expect(response.body.pagination).toEqual(
      expect.objectContaining({
        page: 1,
        limit: 2,
        total: expect.any(Number),
        totalPages: expect.any(Number)
      })
    );
  });

  it("rejects an invalid page", async () => {
    const response = await request(app)
      .get("/api/analytics/videos")
      .query({
        page: 0,
        limit: 2
      })
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe(
      "page must be a positive integer"
    );
  });

  it("rejects an invalid limit", async () => {
    const response = await request(app)
      .get("/api/analytics/videos")
      .query({
        page: 1,
        limit: 101
      })
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe(
      "limit must be an integer between 1 and 100"
    );
  });
});

describe("Engagement Event API", () => {
  it("creates a valid view event", async () => {
    const response = await request(app)
      .post("/api/events")
      .send({
        videoId: existingVideo.id,
        eventType: "view"
      })
      .expect(201);

    expect(response.body.success).toBe(true);

    expect(response.body.data).toEqual(
      expect.objectContaining({
        videoId: existingVideo.id,
        eventType: "view"
      })
    );

    await prisma.engagementEvent.delete({
      where: {
        id: response.body.data.id
      }
    });
  });

  it("rejects an unsupported event type", async () => {
    const response = await request(app)
      .post("/api/events")
      .send({
        videoId: existingVideo.id,
        eventType: "purchase"
      })
      .expect(400);

    expect(response.body.success).toBe(false);

    expect(response.body.message).toBe(
      "eventType must be one of: view, click, add_to_cart"
    );
  });

  it("rejects a nonexistent video", async () => {
    const response = await request(app)
      .post("/api/events")
      .send({
        videoId: 999999999,
        eventType: "view"
      })
      .expect(404);

    expect(response.body.success).toBe(false);

    expect(response.body.message).toBe(
      "Video not found"
    );
  });

  it("rejects a request with missing fields", async () => {
    const response = await request(app)
      .post("/api/events")
      .send({})
      .expect(400);

    expect(response.body.success).toBe(false);

    expect(response.body.message).toBe(
      "videoId and eventType are required"
    );
  });
});

describe("API error handling", () => {
  it("returns JSON for an unknown route", async () => {
    const response = await request(app)
      .get("/api/does-not-exist")
      .expect(404);

    expect(response.body).toEqual({
      success: false,
      message: "Route GET /api/does-not-exist not found"
    });
  });
});