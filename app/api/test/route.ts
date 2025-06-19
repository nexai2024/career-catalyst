import { google } from "@ai-sdk/google";
import { streamObject } from "ai";
import { z } from "zod";
import { NextResponse } from "next/server";

export async function GET() {
  const result = await streamObject({
    model: google("models/gemini-1.5-pro-latest"),
    prompt: "Who created Java?",
    schema: z.object({
      headline: z.string().describe("headline of the response"),
      details: z.string().describe("more details"),
    }),
  });

  for await (const partialObject of result.partialObjectStream) {
    console.log(partialObject);
  }

  return NextResponse.json({ message: "Hello World!" });
}