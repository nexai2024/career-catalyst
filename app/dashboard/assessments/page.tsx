"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BrainCircuit, CheckCircle, Clock, ArrowRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

function AssessmentCard({
  title,
  description,
  duration,
  questionsCount,
  category,
}: {
  title: string;
  description: string;
  duration: string;
  questionsCount: number;
  category: string;
}) {
  const [isStarting, setIsStarting] = useState(false);

  const handleStart = () => {
    setIsStarting(true);
    // In a real implementation, this would navigate to the assessment
    setTimeout(() => {
      setIsStarting(false);
    }, 2000);
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{title}</CardTitle>
          <Badge variant="outline">{category}</Badge>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Clock className="h-4 w-4" />
          <span>{duration}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <BrainCircuit className="h-4 w-4" />
          <span>{questionsCount} questions</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handleStart} disabled={isStarting}>
          {isStarting ? "Preparing..." : "Start Assessment"}
          {!isStarting && <ArrowRight className="ml-2 h-4 w-4" />}
        </Button>
      </CardFooter>
    </Card>
  );
}

function CompletedAssessmentCard({
  title,
  completedDate,
  score,
  feedback,
}: {
  title: string;
  completedDate: string;
  score: number;
  feedback: string;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <CardTitle className="text-xl">{title}</CardTitle>
          </div>
          <Badge variant="outline" className="ml-2">
            Completed
          </Badge>
        </div>
        <CardDescription>Completed on {completedDate}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-medium">Score</span>
            <span className="font-bold">{score}%</span>
          </div>
          <Progress value={score} className="h-2" />
        </div>
        <div>
          <h4 className="font-medium mb-1">Feedback</h4>
          <p className="text-sm text-muted-foreground">{feedback}</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">View Details</Button>
        <Button>Retake Assessment</Button>
      </CardFooter>
    </Card>
  );
}

function SkillProgressItem({
  name,
  percentage,
  details,
}: {
  name: string;
  percentage: number;
  details: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="font-medium">{name}</span>
        <span className="font-bold">{percentage}%</span>
      </div>
      <Progress value={percentage} className="h-2" />
      <p className="text-sm text-muted-foreground">{details}</p>
    </div>
  );
}

function RecommendationItem({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="p-4 border rounded-lg">
      <h3 className="font-medium text-lg mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

export default function AssessmentsPage() {
  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Skills Assessment</h1>
        <p className="text-muted-foreground">
          Evaluate your skills and track your progress over time
        </p>
      </div>

      <Tabs defaultValue="available" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="available">Available Assessments</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="results">Results & Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="available" className="space-y-6">
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <AssessmentCard
              title="Technical Skills Assessment"
              description="Evaluate your programming, database, and system design knowledge"
              duration="45 min"
              questionsCount={30}
              category="Technical"
            />
            <AssessmentCard
              title="Soft Skills Evaluation"
              description="Assess your communication, teamwork, and leadership abilities"
              duration="30 min"
              questionsCount={25}
              category="Soft Skills"
            />
            <AssessmentCard
              title="Industry Knowledge"
              description="Test your understanding of current industry trends and practices"
              duration="35 min"
              questionsCount={20}
              category="Industry"
            />
            <AssessmentCard
              title="Role-Specific: Software Developer"
              description="Assessment tailored for software development positions"
              duration="60 min"
              questionsCount={40}
              category="Role-specific"
            />
            <AssessmentCard
              title="Role-Specific: Data Scientist"
              description="Assessment tailored for data science positions"
              duration="50 min"
              questionsCount={35}
              category="Role-specific"
            />
            <AssessmentCard
              title="Role-Specific: Product Manager"
              description="Assessment tailored for product management positions"
              duration="45 min"
              questionsCount={30}
              category="Role-specific"
            />
          </div>
        </TabsContent>

        <TabsContent value="completed" className="space-y-6">
          <div className="grid gap-6 grid-cols-1">
            <CompletedAssessmentCard
              title="Technical Skills Assessment"
              completedDate="April 15, 2025"
              score={82}
              feedback="Strong performance in programming concepts and database design. Consider improving your knowledge of system architecture."
            />
            <CompletedAssessmentCard
              title="Soft Skills Evaluation"
              completedDate="March 28, 2025"
              score={91}
              feedback="Excellent communication skills and leadership potential demonstrated. Continue developing conflict resolution strategies."
            />
          </div>
        </TabsContent>

        <TabsContent value="results" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Skills Overview</CardTitle>
              <CardDescription>
                Your performance across different skill categories
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <SkillProgressItem
                name="Programming Languages"
                percentage={85}
                details="Strong in JavaScript, Python, and TypeScript"
              />
              <SkillProgressItem
                name="Database Design"
                percentage={78}
                details="Good understanding of relational databases and SQL"
              />
              <SkillProgressItem
                name="System Architecture"
                percentage={65}
                details="Basic knowledge of cloud architecture and microservices"
              />
              <SkillProgressItem
                name="Communication"
                percentage={92}
                details="Excellent verbal and written communication skills"
              />
              <SkillProgressItem
                name="Problem Solving"
                percentage={88}
                details="Strong analytical thinking and creative problem-solving"
              />
              <SkillProgressItem
                name="Leadership"
                percentage={72}
                details="Good team management with room for strategic development"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Improvement Recommendations</CardTitle>
              <CardDescription>
                Personalized suggestions to enhance your skills
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <RecommendationItem
                title="Advanced System Design"
                description="Take the 'System Architecture for Scale' course to improve your understanding of large-scale systems."
              />
              <RecommendationItem
                title="Leadership Development"
                description="Complete the 'Strategic Leadership' modules to enhance your leadership capabilities."
              />
              <RecommendationItem
                title="Cloud Infrastructure"
                description="Practice with hands-on AWS or Azure labs to strengthen your cloud architecture skills."
              />
            </CardContent>
            <CardFooter>
              <Link href="/learning" className="w-full">
                <Button className="w-full">View Recommended Courses</Button>
              </Link>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}