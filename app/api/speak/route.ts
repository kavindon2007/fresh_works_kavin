import { NextRequest, NextResponse } from "next/server";

const ELEVENLABS_VOICE_ID = "21m00Tcm4TlvDq8ikWAM"; // Rachel — natural, professional
const ELEVENLABS_URL = `https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}`;

export async function POST(request: NextRequest) {
  try {
    /* ── 1. Parse + validate body ────────────────────────────────────── */
    const body = await request.json().catch(() => null);

    if (!body || typeof body.text !== "string" || !body.text.trim()) {
      return NextResponse.json(
        { error: "Request body must include a non-empty `text` field." },
        { status: 400 }
      );
    }

    /* Trim whitespace and cap at 1000 chars */
    const text = body.text.trim().slice(0, 1000);

    /* ── 2. Validate API key presence ────────────────────────────────── */
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      console.error("[speak] ELEVENLABS_API_KEY is not set.");
      return NextResponse.json(
        { error: "TTS unavailable — server configuration error." },
        { status: 500 }
      );
    }

    /* ── 3. Call ElevenLabs ──────────────────────────────────────────── */
    const elevenRes = await fetch(ELEVENLABS_URL, {
      method: "POST",
      headers: {
        "xi-api-key":   apiKey,
        "Content-Type": "application/json",
        "Accept":        "audio/mpeg",
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_monolingual_v1",
        voice_settings: {
          stability:        0.6,
          similarity_boost: 0.8,
        },
      }),
    });

    /* ── 4. Handle ElevenLabs error ──────────────────────────────────── */
    if (!elevenRes.ok) {
      console.error(
        `[speak] ElevenLabs returned ${elevenRes.status}:`,
        await elevenRes.text().catch(() => "(no body)")
      );
      return NextResponse.json(
        { error: "TTS unavailable — upstream error." },
        { status: 500 }
      );
    }

    /* ── 5. Stream audio back to client ──────────────────────────────── */
    const audioBuffer = await elevenRes.arrayBuffer();

    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        "Content-Type":  "audio/mpeg",
        "Cache-Control": "no-store",
      },
    });

  } catch (err) {
    /* Never expose internal details in the response */
    console.error("[speak] Unexpected error:", err);
    return NextResponse.json(
      { error: "TTS unavailable." },
      { status: 500 }
    );
  }
}
