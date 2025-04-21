module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt no proporcionado' });
  }

  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error("OPENAI_API_KEY no está definida");

    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          { role: "system", content: "Eres un asesor web profesional y empático." },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 600
      })
    });

    const text = await openaiRes.text();

    if (!openaiRes.ok) {
      console.error("OpenAI Error:", text);
      return res.status(500).json({ error: "Error al llamar a OpenAI", detalle: text });
    }

    const data = JSON.parse(text);
    const respuesta = data?.choices?.[0]?.message?.content || "⚠️ No hubo respuesta del modelo.";

    return res.status(200).json({ respuesta });

  } catch (error) {
    console.error("🔴 Error inesperado en cotizar:", error);
    return res.status(500).json({ error: "Error inesperado", detalle: error.message });
  }
};
