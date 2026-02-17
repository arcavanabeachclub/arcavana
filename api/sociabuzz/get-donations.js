import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL);

export default async function handler(req, res) {

  const donations = await redis.lrange("donations", 0, -1);

  await redis.del("donations");

  res.status(200).json({
    success: true,
    donations: donations.map(d => JSON.parse(d))
  });
}
