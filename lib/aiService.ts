// lib/aiService.js

//  Import necessary AI client libraries (e.g., for OpenAI, xAI)
//  You might configure these with environment variables for API keys and other settings
//  Example:
//  const openai = new OpenAI({
//      apiKey: process.env.OPENAI_API_KEY,
//  });
import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { UserContext } from "@/contexts/User";
import { useContext } from "react";
import ServerUser from "@/lib/server-user";
import { getLearningPlanSchema } from "./aiSchemas";

export enum aiJobs {
  "careerCoach" = "careerCoach",
  "resumeBuilder" = "resumeBuilder",
  "interviewPrep" = "interviewPrep",
  "jobSearchStrategy" = "jobSearchStrategy",
  "skillGapAnalysis" = "skillGapAnalysis",
  "learningPlan" = "learningPlan",
  "salaryNegotiation" = "salaryNegotiation",
  "careerTransition" = "careerTransition",
  "personalBranding" = "personalBranding",
  "professionalDevelopment" = "professionalDevelopment",
  "mentorshipMatching" = "mentorshipMatching",
  "careerPathExploration" = "careerPathExploration",
  "jobMarketTrends" = "jobMarketTrends",
  "careerGoalSetting" = "careerGoalSetting",
  "workLifeBalance" = "workLifeBalance",
  "careerResilience" = "careerResilience",
  "careerSatisfaction" = "careerSatisfaction",
  "careerGrowthStrategies" = "careerGrowthStrategies",
  "careerChangeSupport" = "careerChangeSupport",
  "careerDevelopmentPlanning" = "careerDevelopmentPlanning",
  "careerSuccessMindset" = "careerSuccessMindset",
  "careerCoaching" = "careerCoaching",
  "careerMentoring" = "careerMentoring",
  "careerCounseling" = "careerCounseling",
  "careerAdvising" = "careerAdvising",
  "careerGuidance" = "careerGuidance",
  "careerConsulting" = "careerConsulting",
  "careerStrategy" = "careerStrategy",
}
//  A centralized function to interact with your chosen AI model
export async function getAiResponse(prompt: string, userId: string, job: aiJobs) {

  if (!userId) {
    return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
  }
  const currUserId = userId;
  //const body = await request.json();
  //const { education, experiences, userSkills, userCurrentRole, targetRole, timeCommitment, preferredMethods } = await request.json();

const jobSchema = job === aiJobs.learningPlan ? getLearningPlanSchema : null;
console.log("Job Schema:", jobSchema);
  
  try {
    let { object : plan } = await generateObject({
      model: google('gemini-2.5-flash'),
      system: `You are an expert career development coach specializing in the tech industry. Your task is to create a detailed 12-month learning plan and career roadmap for users transitioning to their dream roles.`,
      prompt: prompt,
      output: 'no-schema',
    })
    console.log("Generated Plan:", plan);
    return NextResponse.json({plan}, { status: 200 });

  } catch (error) {
    console.error("Error generating learning plan:", error);
    throw new Error("Failed to generate learning plan");
  }

}
