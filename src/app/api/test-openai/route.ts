import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "No API key found in environment." });

  // Check available models
  const modelsRes = await fetch("https://api.openai.com/v1/models", {
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  const modelsData = await modelsRes.json();

  // Check if dall-e models are in the list
  const models: string[] = (modelsData.data ?? []).map((m: { id: string }) => m.id);
  const dalleModels = models.filter((m) => m.includes("dall-e") || m.includes("image"));

  // Try a minimal image generation call
  const testRes = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: "gpt-image-1", prompt: "a red circle", n: 1, size: "1024x1024", quality: "low" }),
  });
  const testData = await testRes.json();

  return NextResponse.json({
    key_prefix: apiKey.substring(0, 10) + "...",
    status: modelsRes.status,
    dalle_models_found: dalleModels,
    total_models: models.length,
    image_test_status: testRes.status,
    image_test_response: testData,
  });
}
