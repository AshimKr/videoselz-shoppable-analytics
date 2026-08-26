import prisma from "../db/prisma.js";

const ALLOWED_EVENT_TYPES = new Set([
  "view",
  "click",
  "add_to_cart"
]);

export function isValidEventType(eventType) {
  return ALLOWED_EVENT_TYPES.has(eventType);
}

export async function createEngagementEvent({ videoId, eventType }) {
  const video = await prisma.video.findUnique({
    where: {
      id: videoId
    },
    select: {
      id: true
    }
  });

  if (!video) {
    const error = new Error("Video not found");
    error.statusCode = 404;
    throw error;
  }

  return prisma.engagementEvent.create({
    data: {
      videoId,
      eventType
    }
  });
}