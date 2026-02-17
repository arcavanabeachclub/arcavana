import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL);

export default async function handler(req, res) {

  if (req.method === "POST") {

    const donation = {
      id: Date.now().toString(),
      nama: req.body.supporter_name || "Anonymous",
      amount: Number(req.body.amount) || 0,
      message: req.body.message || "",
      timestamp: new Date().toISOString()
    };

    await redis.lpush("donations", JSON.stringify(donation));

    return res.status(200).json({ success: true });
  }

  res.status(405).json({ message: "Method not allowed" });
}
