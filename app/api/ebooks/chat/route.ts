import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

export async function POST(request: Request) {
  const { text, question } = await request.json();

  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `Given the following text, answer the question:\n\nText: ${text}\n\nQuestion: ${question}`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const answer = response.text();

  return NextResponse.json({ answer });
}
