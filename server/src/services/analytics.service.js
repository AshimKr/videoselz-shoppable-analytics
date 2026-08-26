import prisma from "../db/prisma.js";

function toNumber(value) {
  return Number(value ?? 0);
}

export async function getVideoAnalytics({ page, limit }) {
  const offset = (page - 1) * limit;

  const [videos, totalResult] = await Promise.all([
    prisma.$queryRaw`
      SELECT
        v.id AS id,
        v.title AS title,
        v.videoUrl AS videoUrl,
        p.name AS productName,

        COUNT(
          CASE
            WHEN e.eventType = 'view' THEN 1
          END
        ) AS views,

        COUNT(
          CASE
            WHEN e.eventType = 'click' THEN 1
          END
        ) AS clicks,

        COUNT(
          CASE
            WHEN e.eventType = 'add_to_cart' THEN 1
          END
        ) AS addToCart

      FROM videos v

      INNER JOIN products p
        ON p.id = v.productId

      LEFT JOIN engagement_events e
        ON e.videoId = v.id

      GROUP BY
        v.id,
        v.title,
        v.videoUrl,
        p.name

      ORDER BY v.id DESC

      LIMIT ${limit}
      OFFSET ${offset}
    `,

    prisma.$queryRaw`
      SELECT COUNT(*) AS total
      FROM videos
    `
  ]);

  const total = toNumber(totalResult[0]?.total);

  const data = videos.map((video) => ({
    id: video.id,
    title: video.title,
    videoUrl: video.videoUrl,
    productName: video.productName,
    views: toNumber(video.views),
    clicks: toNumber(video.clicks),
    addToCart: toNumber(video.addToCart)
  }));

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
}