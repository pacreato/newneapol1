export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Метод не дозволено" });
  }

  try {
    const { amount, orderId } = req.body;
    const monoToken = process.env.MONO_TOKEN;
    const baseUrl = process.env.BASE_URL || "https://vercel.app";

    if (!monoToken) {
      return res.status(500).json({ error: "Токен Монобанку не налаштовано у Vercel" });
    }

    const response = await fetch("https://monobank.ua", {
      method: "POST",
      headers: {
        "X-Token": monoToken,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        amount: amount * 100, // переводимо в копійки
        ccy: 980,
        redirectUrl: `${baseUrl}`,
        webHookUrl: `${baseUrl}/api/monobank-webhook`
      })
    });

    const data = await response.json();
    return res.status(response.ok ? 200 : response.status).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
