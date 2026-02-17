let donations = global.donations || [];
global.donations = donations;

export default function handler(req, res) {

  const dataToSend = [...donations];

  // kosongkan setelah dikirim
  donations.length = 0;

  res.status(200).json({
    success: true,
    donations: dataToSend
  });
}
