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

    console.log("Incoming Webhook Body:", JSON.stringify(req.body, null, 2));

    // ===============================
    // AMBIL DATA DARI SOCIABUZZ
    // ===============================

    const rawName =
      req.body.supporter ||
      req.body.supporter_name ||
      req.body.name ||
      req.body.donor_name ||
      req.body?.data?.supporter_name ||
      req.body?.data?.name ||
      "";

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
      nama: rawName.trim() !== "" ? rawName : "Anonymous",
      amount: Number(amount),
      message: message,
      timestamp: new Date().toISOString()
    };

    // ===============================
    // SIMPAN KE REDIS
    // ===============================

    await redis.lpush("donations", JSON.stringify(donation));

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error("Webhook Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
