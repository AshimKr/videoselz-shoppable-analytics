import {
  createEngagementEvent,
  isValidEventType
} from "../services/event.service.js";

export async function createEvent(req, res, next) {
  try {
    const { videoId, eventType } = req.body;

    if (videoId === undefined || eventType === undefined) {
      return res.status(400).json({
        success: false,
        message: "videoId and eventType are required"
      });
    }

    const numericVideoId = Number(videoId);

    if (
      !Number.isInteger(numericVideoId) ||
      numericVideoId <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "videoId must be a positive integer"
      });
    }

    if (
      typeof eventType !== "string" ||
      !isValidEventType(eventType)
    ) {
      return res.status(400).json({
        success: false,
        message: "eventType must be one of: view, click, add_to_cart"
      });
    }

    const event = await createEngagementEvent({
      videoId: numericVideoId,
      eventType
    });

    return res.status(201).json({
      success: true,
      message: "Engagement event created successfully",
      data: event
    });
  } catch (error) {
    next(error);
  }
}