import { z } from "zod";

export const getLearningPlanSchema = z.object({
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
})