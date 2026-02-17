let donations = global.donations || [];
global.donations = donations;

export default function handler(req, res) {
  if (req.method === "POST") {

    const body = req.body;

    const newDonation = {
      id: Date.now().toString(),
      nama: body.supporter_name || "Anonymous",
      amount: body.amount || 0,
      message: body.message || "",
      timestamp: new Date().toISOString()
    };

    donations.push(newDonation);

    return res.status(200).json({ success: true });
  }

  res.status(405).json({ message: "Method not allowed" });
}
