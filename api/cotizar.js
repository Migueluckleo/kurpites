export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "Prompt no proporcionado" });
  }

  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error("OPENAI_API_KEY no definida en entorno");

    // Llamada segura y rápida
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo", // puedes probar "gpt-3.5-turbo" para menor latencia
        messages: [
          { role: "system", content: "Eres un asesor web profesional y empático." },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 300, // REDUCIDO
      }),
    });

    const raw = await openaiRes.text();

    if (!openaiRes.ok) {
      console.error("❌ Error OpenAI:", openaiRes.status, raw);
      return res.status(500).json({ error: "Error en OpenAI", detalle: raw });
    }

    const data = JSON.parse(raw);
    const respuesta = data?.choices?.[0]?.message?.content || "⚠️ No se obtuvo respuesta.";
    return res.status(200).json({ respuesta });

  } catch (error) {
    console.error("🔴 Excepción en /api/cotizar:", error);
    return res.status(500).json({ error: "Error interno", detalle: error.message });
  }
}
