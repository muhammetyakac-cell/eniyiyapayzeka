import * as dotenv from "dotenv";

dotenv.config();

const GROQ_API_KEY = process.env.GROQ_API_KEY || "";
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

async function testGroqSimple() {
  console.log("🛠️ GROQ HIZLI TEST BAŞLIYOR (Model: Llama-3.3-70b-Versatile)...");
  
  const startTime = Date.now();

  try {
    const response = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "qwen/qwen3-32b",
        messages: [
          { role: "user", content: "Merhaba Llama, bana yapay zekanın ne olduğunu tek bir cümleyle Türkçe açıklar mısın?" }
        ],
        max_completion_tokens: 200,
        temperature: 0.7,
      })
    });

    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Groq API error ${response.status}: ${errText}`);
    }

    const data = await response.json();
    const rawText = data.choices?.[0]?.message?.content || "";
    
    console.log(`\n⏱️ GROQ YANIT SÜRESİ: Sadece ${duration} saniye!`);
    console.log("\n✅ GROQ (LLAMA-3.3) YANITI:");
    console.log(rawText);
    
  } catch (error) {
    console.error("\n❌ Groq Testi Başarısız Oldu:", error);
  }
}

testGroqSimple();
