import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { UserContext } from "@/contexts/User";
import { useContext } from "react";
import ServerUser from "@/lib/server-user";

const learningPlanSchema = z.object({
  gapAnalysis: z.string().describe("The topic for which to create a learning plan"),
  actionSteps: z.string().describe("The action steps to be taken in the learning plan"),
  topic: z.string().describe("The topic for which to create a learning plan"),
  level: z.enum(["beginner", "intermediate", "advanced"]).describe("The level of the learning plan"),

  quarterlyRoadmap: z.object({
    phase1: z.string().describe("Phase 1 (Months 1-3) details"),
    phase2: z.string().describe("Phase 2 (Months 4-6) details"),
    phase3: z.string().describe("Phase 3 (Months 7-9) details"),
    phase4: z.string().describe("Phase 4 (Months 10-12) details"),
  }),
});

function saveLearningPlanToDatabase(userId: string, plan: z.infer<typeof learningPlanSchema>) {
  // Placeholder for database saving logic
  // This function should save the generated learning plan to your database
  const prismaClient = prisma;
  let result = null;
  try {
    const learningPlanData = learningPlanSchema.parse(plan);

    result = prismaClient.learningPlan.create({
      data: {
        userId: userId, // Assuming you have userId from auth context
        title: learningPlanData.topic,
        content: JSON.stringify(plan),
      }

    })
  }
  catch (error) {
    result = null;
    console.error("Error saving learning plan to database:", error);
    throw new Error("Failed to save learning plan to database");
  } finally {
    return result;
  }
}

export async function GET(request: Request) {
  const user = await ServerUser();
  if (!user || !user.id) {
    return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
  }

  const existingPlan = await prisma.learningPlan.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
  });

  if (existingPlan) {
    return NextResponse.json(JSON.parse(existingPlan.content as string));
  }

  const learningPlanPrompt = await GetLearningPlanPrompt();

  let { object: plan } = await generateObject({
    model: google('gemini-2.5-flash'),
    system: `You are an expert career development coach specializing in the tech industry. Your task is to create a detailed 12-month learning plan and career roadmap for users transitioning to their dream roles.`,
    prompt: learningPlanPrompt,
    schema: z.object({
      gapAnalysis: z.string().describe("The topic for which to create a learning plan"),
      actionSteps: z.string().describe("The action steps to be taken in the learning plan"),
      topic: z.string().describe("The topic for which to create a learning plan"),
      level: z.enum(["beginner", "intermediate", "advanced"]).describe("The level of the learning plan"),
      quarterlyRoadmap: z.array(z.object({
        phase1: z.string().describe("Phase 1 (Months 1-3) details"),
        phaseMilestones: z.array(z.string()).describe("Milestones for each phase"),
        phasePDFs: z.array(z.string()).describe("Recommended PDF resources for each phase"),
        phaseYouTubeVideos: z.array(z.string()).describe("Recommended YouTube videos for each phase"),
        phaseQuiz: z.array(z.string()).describe("Quiz questions for each phase"),
        phaseMiniProject: z.object({
          description: z.string().describe("Description of the mini-project for the phase"),
          expectedOutcome: z.string().describe("Expected outcome of the mini-project"),
        }),
      })).describe("Quarterly roadmap with phases and milestones"),
      capstoneProject: z.string().describe("Capstone project description"),
      courseLayout: z.array(z.string()).describe("Course outline with module titles and objectives"),
    }),
  });

  if (!plan) {
    return new Response(JSON.stringify({ error: "No learning plan generated" }), { status: 400 });
  }

  const parsedPlan = learningPlanSchema.parse(plan);
  const rv = await saveLearningPlanToDatabase(user.id, parsedPlan);

  if (!rv) {
    console.error("Failed to save learning plan to database.");
    return new Response(JSON.stringify({ error: "No learning plan saved to database" }), { status: 400 });
  }

  return new Response(JSON.stringify(plan), { status: 200, headers: { "Content-Type": "application/json" } });
}

export async function POST(request: Request) {
  const user = await ServerUser();
  if (!user || !user.id) {
    return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
  }

  const learningPlanPrompt = await GetLearningPlanPrompt();

  let { object: plan } = await generateObject({
    model: google('gemini-2.5-flash'),
    system: `You are an expert career development coach specializing in the tech industry. Your task is to create a detailed 12-month learning plan and career roadmap for users transitioning to their dream roles.`,
    prompt: learningPlanPrompt,
    schema: z.object({
      gapAnalysis: z.string().describe("The topic for which to create a learning plan"),
      actionSteps: z.string().describe("The action steps to be taken in the learning plan"),
      topic: z.string().describe("The topic for which to create a learning plan"),
      level: z.enum(["beginner", "intermediate", "advanced"]).describe("The level of the learning plan"),
      quarterlyRoadmap: z.array(z.object({
        phase1: z.string().describe("Phase 1 (Months 1-3) details"),
        phaseMilestones: z.array(z.string()).describe("Milestones for each phase"),
        phasePDFs: z.array(z.string()).describe("Recommended PDF resources for each phase"),
        phaseYouTubeVideos: z.array(z.string()).describe("Recommended YouTube videos for each phase"),
        phaseQuiz: z.array(z.string()).describe("Quiz questions for each phase"),
        phaseMiniProject: z.object({
          description: z.string().describe("Description of the mini-project for the phase"),
          expectedOutcome: z.string().describe("Expected outcome of the mini-project"),
        }),
      })).describe("Quarterly roadmap with phases and milestones"),
      capstoneProject: z.string().describe("Capstone project description"),
      courseLayout: z.array(z.string()).describe("Course outline with module titles and objectives"),
    }),
  });

  if (!plan) {
    return new Response(JSON.stringify({ error: "No learning plan generated" }), { status: 400 });
  }

  const parsedPlan = learningPlanSchema.parse(plan);
  const rv = await saveLearningPlanToDatabase(user.id, parsedPlan);

  if (!rv) {
    console.error("Failed to save learning plan to database.");
    return new Response(JSON.stringify({ error: "No learning plan saved to database" }), { status: 400 });
  }

  return new Response(JSON.stringify(plan), { status: 200, headers: { "Content-Type": "application/json" } });
}






async function GetLearningPlanPrompt() {
  const user = await ServerUser();
  if (!user || !user.id) {
    throw new Error("User context is not available or user is not authenticated.");
  }
  const { name, email, currentPosition, skills, experiences, education, otherInfo, desiredPosition, specialRequirements } = user;
  //fields that may not be present
  const industry = "Tech";
  const demographics = "Not specified";
  return (
    ` Act as a professional career development coach with expertise in tech industry. I will provide a user's career details and target role. Your task is to create a structured 12-month learning plan and career roadmap to transition them from their current position to their dream role.  
You are a career development AI assistant. Your task is to help users transition from their current professional position to a desired future position by performing a gap analysis and creating a detailed, phased learning plan.

User Profile:

Current Position: ${currentPosition}
Skills: ${skills}
Experience: ${experiences}
Education: ${education}
Demographics (optional): ${demographics}
Other relevant info: ${otherInfo}
Target Position:

Desired Position: ${desiredPosition}
Industry/Field: ${industry}
Special Requirements: ${specialRequirements}
Instructions:

Gap Analysis: Identify the key skill, knowledge, and experience gaps between the user's current state and the target position.
Learning Plan: Create a learning plan divided into at least 4 distinct phases. For each phase:
Write a brief introduction explaining the phase’s focus, what is expected, and what will be delivered at the end.
Estimate the time required to complete the phase (in weeks).
List clear, tangible milestones for the phase.
Recommend at least 3 high-quality PDF resources (with direct links). For each, provide a one-sentence summary of its relevance.
Recommend at least 3 relevant YouTube videos (with direct links). For each, provide a one-sentence summary of its relevance.
Design a short quiz (5 questions) to assess understanding at the end of the phase.
Suggest a practical mini-project or assignment for the phase, with a brief description and expected outcome.
Capstone Project: At the end of the learning plan, propose a comprehensive capstone project that integrates the skills and knowledge acquired throughout all phases. Include a description, objectives, and expected deliverables.
Course Layout: At the end, provide a structured course outline (module titles, objectives, and sequence) suitable for a course creation agent.
Formatting:

Use clear headings for each phase.
Use bullet points or numbered lists for milestones and resources.
Provide all links in markdown format.
Make the plan actionable, realistic, and tailored to the user’s background.
Example Output Structure:

Gap Analysis
[Summary of gaps]

Phase 1: [Title]
Introduction:
[Brief intro]

Estimated Time:
[Time in weeks]

Milestones:

[Milestone 1]
[Milestone 2]
...
Resources:

PDFs:
[Title](PDF link): [One-sentence summary]
...
YouTube Videos:
[Title](YouTube link): [One-sentence summary]
...
Quiz:

[Question 1]
...
Mini-Project:

Description: [Brief description]
Expected Outcome: [What the user should produce]
Phase 2: [Title]
[Repeat structure above]

Phase 3: [Title]
[Repeat structure above]

Phase 4: [Title]
[Repeat structure above]

Capstone Project
Description:
[Comprehensive project description]

Objectives:

[Objective 1]
[Objective 2]
...
Expected Deliverables:

[Deliverable 1]
[Deliverable 2]
...
Course Layout
Module 1: [Title] – [Objective]
Module 2: [Title] – [Objective]You are a career development AI assistant. Your task is to help users transition from their current professional position to a desired future position by performing a gap analysis and creating a detailed, phased learning plan.

`
  )
}