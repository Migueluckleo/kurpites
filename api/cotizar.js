export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Método no permitido' });
    }
  
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt no proporcionado' });
    }
  
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    if (!OPENAI_API_KEY) {
      return res.status(500).json({ error: 'Clave API no encontrada en el entorno' });
    }
  
    try {
      const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [
            { role: "system", content: "Eres un asesor de proyectos web profesional y empático." },
            { role: "user", content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 600
        })
      });
  
      if (!openaiRes.ok) {
        const errorBody = await openaiRes.text();
        console.error("🔴 Error OpenAI:", openaiRes.status, errorBody);
        return res.status(500).json({ error: "Error desde OpenAI" });
      }
  
      const data = await openaiRes.json();
      const texto = data?.choices?.[0]?.message?.content;
  
      return res.status(200).json({ respuesta: texto || "⚠️ No hubo respuesta del modelo." });
  
    } catch (error) {
      console.error("🚨 Fallo general:", error);
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  }
  