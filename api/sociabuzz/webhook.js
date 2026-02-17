import fs from "fs";
import path from "path";

const filePath = "/tmp/donations.json";

export default async function handler(req, res) {
  if (req.method === "POST") {

    let donations = [];

    if (fs.existsSync(filePath)) {
      const fileData = fs.readFileSync(filePath, "utf8");
      donations = JSON.parse(fileData || "[]");
    }

    const newDonation = {
      id: Date.now().toString(),
      nama: req.body.supporter_name || "Anonymous",
      amount: Number(req.body.amount) || 0,
      message: req.body.message || "",
      timestamp: new Date().toISOString()
    };

    donations.push(newDonation);

    fs.writeFileSync(filePath, JSON.stringify(donations));

    return res.status(200).json({ success: true });
  }

  res.status(405).json({ message: "Method not allowed" });
}
