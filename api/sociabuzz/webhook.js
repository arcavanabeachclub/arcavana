import fs from "fs";

const filePath = "/tmp/donations.json";

export default async function handler(req, res) {

  if (req.method === "POST") {

    console.log("BODY MASUK:", req.body);

    let donations = [];

    if (fs.existsSync(filePath)) {
      const fileData = fs.readFileSync(filePath, "utf8");
      donations = JSON.parse(fileData || "[]");
    }

    // simpan apa pun yang masuk
    donations.push({
      raw: req.body,
      timestamp: new Date().toISOString()
    });

    fs.writeFileSync(filePath, JSON.stringify(donations));

    return res.status(200).json({ success: true });
  }

  res.status(405).json({ message: "Method not allowed" });
}
