export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // 1. ВХІД В АДМІНКУ
    if (req.url.endsWith('/admin-login') && req.method === 'POST') {
      const { password } = req.body;
      if (password === process.env.ADMIN_PASSWORD) {
        return res.status(200).json({ success: true, token: "admin-session-granted" });
      }
      return res.status(401).json({ success: false, error: "Неправильний пароль" });
    }

    // 2. ЗАПИТ ОПЛАТИ В МОНОБАНК
    if (req.url.endsWith('/create-payment') && req.method === 'POST') {
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
          amount: amount * 100, // переводимо в копійки для Монобанку
          ccy: 980,
          redirectUrl: `${baseUrl}`,
          webHookUrl: `${baseUrl}/api/monobank-webhook`
        })
      });

      const data = await response.json();
      return res.status(response.ok ? 200 : response.status).json(data);
    }

    return res.status(404).json({ error: "Маршрут не знайдено" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
