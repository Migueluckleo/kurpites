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
  
    if (!openaiRes.ok) {
      const text = await openaiRes.text(); // lo leemos como texto plano
      console.error("Error desde OpenAI:", openaiRes.status, text);
      return res.status(500).json({ error: "Error al llamar a OpenAI", detalle: text });
    }
  
    const data = await openaiRes.json();
    const respuesta = data?.choices?.[0]?.message?.content || "⚠️ No hubo respuesta del modelo.";
  
    return res.status(200).json({ respuesta });
  
  } catch (error) {
    console.error("🔴 Error inesperado en cotizar:", error);
    return res.status(500).json({ error: "Error inesperado", detalle: error.message });
  }
  