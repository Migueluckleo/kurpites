export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Método no permitido' });
    }
  
    const { prompt } = req.body;
  
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt no proporcionado' });
    }
  
    const OPENAI_KEY = process.env.OPENAI_API_KEY;
  
    if (!OPENAI_KEY) {
      return res.status(500).json({ error: 'Falta la clave API de OpenAI en el entorno' });
    }
  
    try {
      const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: "Eres un asesor de proyectos web profesional y empático."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 600
        })
      });
  
      const data = await openaiRes.json();
  
      const texto = data?.choices?.[0]?.message?.content;
  
      return res.status(200).json({ respuesta: texto || "⚠️ Respuesta vacía de OpenAI." });
  
    } catch (error) {
      console.error("❌ Error en la función cotizar:", error);
      return res.status(500).json({ error: "Error al contactar a OpenAI" });
    }
  }
  