import * as dotenv from "dotenv";

dotenv.config();

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "";
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

async function testOpenRouterSimple() {
  console.log("🛠️ OPENROUTER HIZLI TEST BAŞLIYOR (Model: Llama-3.3-70B-Free)...");
  
  try {
    const response = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://eniyiyapayzeka.com",
        "X-Title": "EnIyiYapayZeka",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "nvidia/nemotron-3-ultra-550b-a55b:free",
        messages: [
          { role: "user", content: "Merhaba Llama, bana yapay zekanın ne olduğunu tek bir cümleyle Türkçe açıklar mısın?" }
        ],
        max_tokens: 200,
        temperature: 0.7,
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`OpenRouter API error ${response.status}: ${errText}`);
    }

    const data = await response.json();
    const rawText = data.choices?.[0]?.message?.content || "";
    
    console.log("\n✅ OPENROUTER (LLAMA-3.3) YANITI:");
    console.log(rawText);
    
  } catch (error) {
    console.error("\n❌ OpenRouter Testi Başarısız Oldu:", error);
  }
}

testOpenRouterSimple();
