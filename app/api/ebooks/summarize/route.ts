import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { checkUsage, incrementUsage } from '@/lib/subscription';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY as string);

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { hasAccess, message } = await checkUsage(user.id, 'ebook_summarization');
  if (!hasAccess) {
    return NextResponse.json({ error: message }, { status: 403 });
  }

  const { text } = await request.json();

  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `Summarize the following text:\n\n${text}`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const summary = response.text();

  await incrementUsage(user.id, 'ebook_summarization');

  return NextResponse.json({ summary });
}
