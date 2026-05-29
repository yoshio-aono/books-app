import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `あなたは英語から日本語への翻訳専門家です。
本のタイトルと説明文を自然で読みやすい日本語に翻訳してください。
出力形式：
【タイトル】（翻訳後のタイトル）
【説明】（翻訳後の説明文）
余計なコメントや前置きは不要です。上記の形式のみで出力してください。`;

export async function POST(req: NextRequest) {
  try {
    const { title, description } = await req.json();

    if (!title) {
      return NextResponse.json({ error: "title is required" }, { status: 400 });
    }

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: [
        {
          type: "text",
          text: SYSTEM_PROMPT,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: [
        {
          role: "user",
          content: `タイトル: ${title}\n\n説明文: ${description || "（説明文なし）"}`,
        },
      ],
    });

    const translation =
      message.content[0].type === "text" ? message.content[0].text : "";

    return NextResponse.json({ translation });
  } catch (error) {
    console.error("Translation error:", error);
    return NextResponse.json(
      { error: "翻訳中にエラーが発生しました" },
      { status: 500 }
    );
  }
}
