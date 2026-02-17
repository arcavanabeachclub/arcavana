import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL);

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const secret = req.query.secret;

  if (secret !== process.env.WEBHOOK_SECRET) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {

    console.log("Incoming Webhook Body:", req.body);

    const rawName =
      req.body.supporter_name ||
      req.body.name ||
      req.body.donor_name ||
      req.body?.data?.supporter_name ||
      req.body?.data?.name;

    const amount =
      req.body.amount ||
      req.body?.data?.amount ||
      0;

    const message =
      req.body.message ||
      req.body?.data?.message ||
      "";

    const donation = {
      id: Date.now().toString(),
      nama: rawName && rawName.trim() !== "" ? rawName : "Anonymous",
      amount: Number(amount),
      message,
      timestamp: new Date().toISOString()
    };

    await redis.lpush("donations", JSON.stringify(donation));

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error("Webhook Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
