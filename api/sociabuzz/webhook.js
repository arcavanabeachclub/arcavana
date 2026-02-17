import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL);

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { secret } = req.query;

  if (secret !== process.env.WEBHOOK_SECRET) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {

    // DEBUG (boleh dihapus nanti)
    console.log("Incoming Webhook Body:", JSON.stringify(req.body, null, 2));

    // Ambil nama dari berbagai kemungkinan field
    const rawName =
      req.body.supporter_name ||
      req.body.name ||
      req.body.donor_name ||
      (req.body.data && req.body.data.supporter_name) ||
      (req.body.data && req.body.data.name);

    const donation = {
      id: Date.now().toString(),
      nama: rawName && rawName.trim() !== "" ? rawName : "Anonymous",
      amount: Number(req.body.amount) || 0,
      message: req.body.message || "",
      timestamp: new Date().toISOString()
    };

    await redis.lpush("donations", JSON.stringify(donation));

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error("Webhook Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
