"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import {
  BookOpen,
  Check,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  FileText,
  Lightbulb,
  ListChecks,
  Rocket,
  Target,
  Youtube,
} from "lucide-react";
import { z } from "zod";
import { Skeleton } from "@/components/ui/skeleton";

const learningPlanSchema = z.object({
  gapAnalysis: z.string(),
  actionSteps: z.string(),
  topic: z.string(),
  level: z.enum(["beginner", "intermediate", "advanced"]),
  quarterlyRoadmap: z.array(
    z.object({
      phase1: z.string(),
      phaseMilestones: z.array(z.string()),
      phasePDFs: z.array(z.string()),
      phaseYouTubeVideos: z.array(z.string()),
      phaseQuiz: z.array(z.string()),
      phaseMiniProject: z.object({
        description: z.string(),
        expectedOutcome: z.string(),
      }),
    })
  ),
  capstoneProject: z.string(),
  courseLayout: z.array(z.string()),
});

type LearningPlan = z.infer<typeof learningPlanSchema>;

export default function LearningPlanPage() {
  const [learningPlan, setLearningPlan] = useState<LearningPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkedMilestones, setCheckedMilestones] = useState<string[]>([]);

  const handleMilestoneCheck = (milestone: string) => {
    setCheckedMilestones((prev) =>
      prev.includes(milestone)
        ? prev.filter((m) => m !== milestone)
        : [...prev, milestone]
    );
  };

  const totalMilestones = learningPlan?.quarterlyRoadmap.reduce(
    (acc, phase) => acc + phase.phaseMilestones.length,
    0
  );

  const progress = totalMilestones
    ? Math.round((checkedMilestones.length / totalMilestones) * 100)
    : 0;

  useEffect(() => {
    const fetchLearningPlan = async () => {
      try {
        const response = await fetch("/api/learning-plan");
        if (response.ok) {
          const data = await response.json();
          setLearningPlan(data);
        } else {
          toast({
            title: "Error",
            description: "Failed to load learning plan",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error fetching learning plan:", error);
        toast({
          title: "Error",
          description: "Failed to load learning plan",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLearningPlan();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-4 md:p-6 space-y-6">
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-6 w-1/2" />
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!learningPlan) {
    return (
      <div className="container mx-auto p-4 md:p-6 text-center">
        <h1 className="text-2xl font-bold">No Learning Plan Found</h1>
        <p className="text-muted-foreground mt-2">
          Generate a new learning plan to get started.
        </p>
        <Button
          onClick={async () => {
            await fetch("/api/learning-plan", { method: "POST" });
            window.location.reload();
          }}
          className="mt-4"
        >
          Generate New Learning Plan
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-8">
      <header className="space-y-2">
        <Badge>{learningPlan.level}</Badge>
        <h1 className="text-4xl font-bold tracking-tight">{learningPlan.topic}</h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Progress</CardTitle>
                <span className="text-muted-foreground">{progress}%</span>
              </div>
            </CardHeader>
            <CardContent>
              <Progress value={progress} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target /> Gap Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{learningPlan.gapAnalysis}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Rocket /> Action Steps
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{learningPlan.actionSteps}</p>
            </CardContent>
          </Card>

          <Tabs defaultValue="phase-0">
            <TabsList>
              {learningPlan.quarterlyRoadmap.map((phase, index) => (
                <TabsTrigger key={index} value={`phase-${index}`}>
                  Phase {index + 1}
                </TabsTrigger>
              ))}
            </TabsList>
            {learningPlan.quarterlyRoadmap.map((phase, index) => (
              <TabsContent key={index} value={`phase-${index}`}>
                <Card>
                  <CardHeader>
                    <CardTitle>{phase.phase1}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="font-semibold flex items-center gap-2">
                        <ListChecks /> Milestones
                      </h3>
                      <ul className="space-y-2 mt-2">
                        {phase.phaseMilestones.map((milestone, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <Checkbox
                              id={`milestone-${index}-${i}`}
                              checked={checkedMilestones.includes(milestone)}
                              onCheckedChange={() => handleMilestoneCheck(milestone)}
                            />
                            <label htmlFor={`milestone-${index}-${i}`}>{milestone}</label>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold flex items-center gap-2">
                        <FileText /> PDF Resources
                      </h3>
                      <ul className="space-y-2 mt-2">
                        {phase.phasePDFs.map((pdf, i) => (
                          <li key={i}>
                            <a href={pdf} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                              {pdf}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold flex items-center gap-2">
                        <Youtube /> YouTube Videos
                      </h3>
                      <ul className="space-y-2 mt-2">
                        {phase.phaseYouTubeVideos.map((video, i) => (
                          <li key={i}>
                            <a href={video} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                              {video}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold flex items-center gap-2">
                        <Lightbulb /> Quiz
                      </h3>
                      <ul className="space-y-2 mt-2">
                        {phase.phaseQuiz.map((quiz, i) => (
                          <li key={i}>{quiz}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold flex items-center gap-2">
                        <ClipboardList /> Mini Project
                      </h3>
                      <p className="text-muted-foreground mt-2">{phase.phaseMiniProject.description}</p>
                      <p className="text-sm mt-2">
                        <strong>Expected Outcome:</strong> {phase.phaseMiniProject.expectedOutcome}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen /> Course Layout
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {learningPlan.courseLayout.map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="text-green-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Rocket /> Capstone Project
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{learningPlan.capstoneProject}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
