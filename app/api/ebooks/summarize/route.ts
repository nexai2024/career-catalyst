import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

export async function POST(request: Request) {
  const { text } = await request.json();

  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `Summarize the following text:\n\n${text}`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const summary = response.text();

  return NextResponse.json({ summary });
}
