import * as dotenv from "dotenv";

dotenv.config();

const DEEPSEEK_API_KEY = "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";
const DEEPSEEK_URL = "https://integrate.api.nvidia.com/v1/chat/completions";

async function testDeepSeekSimple() {
  console.log("🛠️ DEEPSEEK HIZLI TEST BAŞLIYOR...");
  
  try {
    const response = await fetch(DEEPSEEK_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${DEEPSEEK_API_KEY}`,
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "deepseek-ai/deepseek-v4-flash",
        messages: [
          { role: "user", content: "Selam DeepSeek, bana yapay zekanın ne olduğunu tek bir cümleyle açıklar mısın?" }
        ],
        max_tokens: 200,
        temperature: 0.7,
        top_p: 0.95,
        stream: false,
        chat_template_kwargs: { thinking: true, reasoning_effort: "low" }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`DeepSeek API error ${response.status}: ${errText}`);
    }

    const data = await response.json();
    const rawText = data.choices?.[0]?.message?.content || "";
    const reasoningText = data.choices?.[0]?.message?.reasoning_content || data.choices?.[0]?.message?.reasoning || "";
    
    if (reasoningText) {
        console.log("\n🤔 DÜŞÜNME (REASONING):");
        console.log(reasoningText);
    }
    
    console.log("\n✅ DEEPSEEK YANITI:");
    console.log(rawText);
    
  } catch (error) {
    console.error("\n❌ DeepSeek Testi Başarısız Oldu:", error);
  }
}

testDeepSeekSimple();
