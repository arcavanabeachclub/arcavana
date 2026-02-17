import fs from "fs";

const filePath = "/tmp/donations.json";

export default function handler(req, res) {

  let donations = [];

  if (fs.existsSync(filePath)) {
    const fileData = fs.readFileSync(filePath, "utf8");
    donations = JSON.parse(fileData || "[]");
    fs.writeFileSync(filePath, "[]"); // reset setelah diambil
  }

  res.status(200).json({
    success: true,
    donations: donations
  });
}
