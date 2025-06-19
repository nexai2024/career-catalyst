import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";

export const learningPlanSchema = z.object({
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



export async function POST(request: Request) {
  const body = await request.json();
const { userEducation, userExperience, userSkills, userCurrentRole, targetRole, timeCommitment, preferredMethods } = body;
const learningPlanPrompt = `
Act as a professional career development coach with expertise in tech industry. I will provide a user's career details and target role. Your task is to create a structured 12-month learning plan and career roadmap to transition them from their current position to their dream role.  

**User Profile:**  
- **Education:** ${userEducation}  
- **Experience:** ${userExperience}    
- **Skills:** ${userSkills}  
- **Current Role:** ${userCurrentRole} 
- **Aspiring Role:** ${targetRole} 

**Constraints/Preferences:**  
- Time Commitment: ${timeCommitment} 
- Budget: [e.g., "$500/year for courses"]  
- Preferred Methods: ${preferredMethods} (e.g., online courses, books, mentorship)

**Output Requirements:**  
1. **Gap Analysis:** Compare current skills/experience vs. requirements for the target role.  
2. **Quarterly Roadmap:** Split into 3-month phases with clear milestones:  
   - **Phase 1 (Months 1-3):** Foundational skills + quick wins  
   - **Phase 2 (Months 4-6):** Intermediate skills + practical projects  
   - **Phase 3 (Months 7-9):** Advanced skills + networking  
   - **Phase 4 (Months 10-12):** Job search prep + portfolio refinement  
3. **Actionable Steps per Phase:**  
   - **Learning Resources:** Recommend free/paid courses, books, or tools.  Suggest courses that can be created by our team and added to our products
   - **Skill-Building:** Suggest projects, volunteering, or micro-tasks.  
   - **Networking:** Identify events/communities to join.  
   - **Metrics:** Define success criteria for each phase.  
4. **Final Output:** A concise, scannable table summarizing the roadmap.  `



  try {
    const response = await generateObject({
      model: google("gpt-4"),
      messages: [
        {
          role: "user",
          content: learningPlanPrompt ,
        },
      ],
      schema: learningPlanSchema,
      tools: [],
    });

    return new Response(JSON.stringify(response), { status: 200 });
  } catch (error) {
    console.error("Error generating learning plan:", error);
    return new Response(JSON.stringify({ error: "Failed to generate learning plan" }), { status: 500 });
  }
}






