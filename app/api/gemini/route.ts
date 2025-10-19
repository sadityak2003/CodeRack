import { a } from "framer-motion/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json(); // [{ role, text }[]]

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Missing or invalid messages array" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // Convert to Gemini's expected format
    const contents = messages.map((msg) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.text }],
    }));

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=" + apiKey,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ contents }),
      }
    );

    const data = await response.json();
    const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response from Gemini.";

    return NextResponse.json({ text: aiText });
  } catch (error) {
    console.error("Gemini API error:", error);
    return NextResponse.json({ error: "Failed to connect with Gemini API" }, { status: 500 });
  }
}
