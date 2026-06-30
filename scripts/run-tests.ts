import { sanitizeHtml } from "../src/lib/utils/sanitize-html";
import { slugify, toolSlugify, categorySlugify } from "../src/lib/utils/slugify";

console.log("🚀 TESTING SUITE STARTED\n");

let passedTests = 0;
let failedTests = 0;

function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`✅ PASS: ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`❌ FAIL: ${name}`);
    console.error(err instanceof Error ? err.stack : String(err));
    failedTests++;
  }
}

// 1. Slugify Utilities Tests
test("slugify - maps Turkish characters correctly", () => {
  const result = slugify("Çalışma Şartları ve İçerik Yönetimi İçin En İyi Yapay Zeka");
  const expected = "calisma-sartlari-ve-icerik-yonetimi-icin-en-iyi-yapay-zeka";
  if (result !== expected) {
    throw new Error(`Expected "${expected}", got "${result}"`);
  }
});

test("slugify - removes special characters and handles double hyphens", () => {
  const result = slugify("GPT-4o / Claude 3.5 Sonnet: Hangisi Daha İyi?!?");
  const expected = "gpt-4o-claude-3-5-sonnet-hangisi-daha-iyi";
  if (result !== expected) {
    throw new Error(`Expected "${expected}", got "${result}"`);
  }
});

test("toolSlugify - appends -nedir", () => {
  const result = toolSlugify("ChatGPT 5");
  const expected = "chatgpt-5-nedir";
  if (result !== expected) {
    throw new Error(`Expected "${expected}", got "${result}"`);
  }
});

test("categorySlugify - appends -yapay-zeka-araclari", () => {
  const result = categorySlugify("Görsel Üretimi");
  const expected = "gorsel-uretimi-yapay-zeka-araclari";
  if (result !== expected) {
    throw new Error(`Expected "${expected}", got "${result}"`);
  }
});


// 2. Safe HTML Sanitizer Tests
test("sanitizeHtml - strips script blocks", () => {
  const dirty = "<h2>Test</h2><script>alert('xss')</script><p>Açıklama</p>";
  const clean = sanitizeHtml(dirty);
  if (clean.includes("<script>") || clean.includes("alert")) {
    throw new Error(`Failed to strip script tags. Output: ${clean}`);
  }
  if (!clean.includes("<h2>Test</h2>") || !clean.includes("<p>Açıklama</p>")) {
    throw new Error(`Incorrectly stripped safe tags. Output: ${clean}`);
  }
});

test("sanitizeHtml - strips inline event handlers", () => {
  const dirty = '<p>Açıklama <img src="x" onerror="alert(1)" /> ve <a href="#" onclick="run()">link</a></p>';
  const clean = sanitizeHtml(dirty);
  if (clean.includes("onerror") || clean.includes("onclick") || clean.includes("alert")) {
    throw new Error(`Failed to strip inline event handlers. Output: ${clean}`);
  }
});

test("sanitizeHtml - blocks javascript: links but allows safe links", () => {
  const dirty = '<a href="javascript:alert(1)">Zararlı Link</a> ve <a href="https://google.com">Güvenli Link</a>';
  const clean = sanitizeHtml(dirty);
  if (clean.includes("javascript:")) {
    throw new Error(`Failed to block javascript: URI scheme. Output: ${clean}`);
  }
  if (!clean.includes('href="https://google.com"')) {
    throw new Error(`Failed to preserve safe href attributes. Output: ${clean}`);
  }
});

test("sanitizeHtml - automatically adds safety attributes to anchor tags", () => {
  const dirty = '<a href="https://eniyiyapayzeka.com">Platform</a>';
  const clean = sanitizeHtml(dirty);
  if (!clean.includes('rel="noopener noreferrer"') || !clean.includes('target="_blank"')) {
    throw new Error(`Failed to append security attributes to safe links. Output: ${clean}`);
  }
});

test("sanitizeHtml - filters non-allowlisted tags entirely", () => {
  const dirty = "<applet>Dangerous Applet</applet><iframe>Dangerous Frame</iframe>";
  const clean = sanitizeHtml(dirty);
  if (clean.includes("applet") || clean.includes("iframe")) {
    throw new Error(`Failed to remove forbidden tags. Output: ${clean}`);
  }
});


// Summary
console.log("\n📊 TESTING SUMMARY:");
console.log(`Passed: ${passedTests}`);
console.log(`Failed: ${failedTests}`);

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log("\n🌟 ALL TESTS PASSED SUCCESSFULLY!");
  process.exit(0);
}
