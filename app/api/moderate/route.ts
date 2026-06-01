import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { area, category, content } = body;

  // If no API key set, auto-approve
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ approved: true, reason: "", category_suggestion: "" });
  }

  try {
    const prompt = `You are a content moderator for OnlySA, an anonymous South African community platform.

Review the following post and return ONLY a JSON response in this exact format with no other text:
{"approved": true or false, "reason": "brief reason if rejected, empty string if approved", "category_suggestion": "suggested category if post category seems wrong, empty string if correct"}

Reject posts that contain:
- Hate speech or racism
- Personal information (phone numbers, addresses, full names)
- Threats or calls to violence
- Sexual content involving minors
- Doxxing attempts
- Illegal activity instructions

Approve posts that are:
- Confessions, rants, opinions, business reviews, community observations, hot takes, questions

Post to review:
Area: ${area}
Category: ${category}
Content: ${content}`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 200,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();
    const text = data.content?.[0]?.text || '{"approved":true,"reason":"","category_suggestion":""}';
    
    try {
      const result = JSON.parse(text.replace(/```json|```/g, "").trim());
      return NextResponse.json(result);
    } catch {
      return NextResponse.json({ approved: true, reason: "", category_suggestion: "" });
    }
  } catch {
    // If moderation fails, approve by default (don't block content on errors)
    return NextResponse.json({ approved: true, reason: "", category_suggestion: "" });
  }
}
