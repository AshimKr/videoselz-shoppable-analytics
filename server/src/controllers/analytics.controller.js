import { getVideoAnalytics } from "../services/analytics.service.js";

export async function getVideosAnalytics(req, res, next) {
  try {
    const pageValue = Number(req.query.page ?? 1);
    const limitValue = Number(req.query.limit ?? 10);

    if (
      !Number.isInteger(pageValue) ||
      pageValue < 1
    ) {
      return res.status(400).json({
        success: false,
        message: "page must be a positive integer"
      });
    }

    if (
      !Number.isInteger(limitValue) ||
      limitValue < 1 ||
      limitValue > 100
    ) {
      return res.status(400).json({
        success: false,
        message: "limit must be an integer between 1 and 100"
      });
    }

    const result = await getVideoAnalytics({
      page: pageValue,
      limit: limitValue
    });

    return res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    next(error);
  }
}