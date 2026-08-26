import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined");
}

const adapter = new PrismaBetterSqlite3({
  url: connectionString
});

const prisma = new PrismaClient({
  adapter
});

async function main() {
  await prisma.engagementEvent.deleteMany();
  await prisma.video.deleteMany();
  await prisma.product.deleteMany();

  const products = await prisma.product.createManyAndReturn({
    data: [
      {
        name: "Urban Runner Sneakers",
        price: 2999.0
      },
      {
        name: "Everyday Classic Hoodie",
        price: 1899.0
      },
      {
        name: "Premium Wireless Earbuds",
        price: 3499.0
      },
      {
        name: "Performance Sports Watch",
        price: 4999.0
      },
      {
        name: "Minimal Leather Backpack",
        price: 2599.0
      }
    ]
  });

  const videos = await Promise.all([
    prisma.video.create({
      data: {
        productId: products[0].id,
        videoUrl: "https://example.com/videos/urban-runner.mp4",
        title: "Introducing the Urban Runner"
      }
    }),
    prisma.video.create({
      data: {
        productId: products[0].id,
        videoUrl: "https://example.com/videos/urban-runner-style.mp4",
        title: "3 Ways to Style Urban Runner"
      }
    }),
    prisma.video.create({
      data: {
        productId: products[1].id,
        videoUrl: "https://example.com/videos/classic-hoodie.mp4",
        title: "The Everyday Classic Hoodie"
      }
    }),
    prisma.video.create({
      data: {
        productId: products[2].id,
        videoUrl: "https://example.com/videos/wireless-earbuds.mp4",
        title: "Premium Wireless Earbuds Review"
      }
    }),
    prisma.video.create({
      data: {
        productId: products[3].id,
        videoUrl: "https://example.com/videos/sports-watch.mp4",
        title: "Performance Sports Watch Demo"
      }
    }),
    prisma.video.create({
      data: {
        productId: products[4].id,
        videoUrl: "https://example.com/videos/leather-backpack.mp4",
        title: "Inside the Minimal Leather Backpack"
      }
    })
  ]);

  const eventPatterns = [
    { video: videos[0], views: 150, clicks: 34, addToCart: 8 },
    { video: videos[1], views: 95, clicks: 21, addToCart: 5 },
    { video: videos[2], views: 210, clicks: 48, addToCart: 11 },
    { video: videos[3], views: 180, clicks: 39, addToCart: 9 },
    { video: videos[4], views: 130, clicks: 27, addToCart: 6 },
    { video: videos[5], views: 75, clicks: 14, addToCart: 3 }
  ];

  for (const pattern of eventPatterns) {
    const events = [
      ...Array.from(
        { length: pattern.views },
        () => ({
          videoId: pattern.video.id,
          eventType: "view"
        })
      ),
      ...Array.from(
        { length: pattern.clicks },
        () => ({
          videoId: pattern.video.id,
          eventType: "click"
        })
      ),
      ...Array.from(
        { length: pattern.addToCart },
        () => ({
          videoId: pattern.video.id,
          eventType: "add_to_cart"
        })
      )
    ];

    await prisma.engagementEvent.createMany({
      data: events
    });
  }

  console.log("Database seeded successfully.");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });