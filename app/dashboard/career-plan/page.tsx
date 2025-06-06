"use client";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, CheckCircle2, Clock, Target, Trophy } from "lucide-react";

type Milestone = {
  id: number;
  title: string;
  deadline: string;
  progress: number;
  status: "Not Started" | "In Progress" | "Completed";
  description: string;
  tasks: string[];
};

type Skill = {
  name: string;
  current: number;
  target: number;
};

type CareerPlan = {
  currentRole: string;
  targetRole: string;
  timeline: string;
  progress: number;
  description: string;
  milestones: Milestone[];
  skills: Skill[];
};

export default function CareerPlanPage() {
  const [selectedMilestone, setSelectedMilestone] = useState<number | null>(null);

  // Mock data for career plan
  const careerPlan: CareerPlan = {
    currentRole: "Software Engineer",
    targetRole: "Senior Software Engineer",
    timeline: "12 months",
    progress: 45,
    description: "Focused on developing technical leadership skills and expanding system design knowledge",
    milestones: [
      {
        id: 1,
        title: "Complete System Design Course",
        deadline: "June 15, 2025",
        progress: 75,
        status: "In Progress",
        description: "Master distributed systems concepts and microservices architecture",
        tasks: [
          "Study scalability patterns",
          "Complete practical exercises",
          "Build sample architectures",
        ],
      },
      {
        id: 2,
        title: "Lead Team Project",
        deadline: "August 30, 2025",
        progress: 30,
        status: "In Progress",
        description: "Take ownership of a major feature implementation",
        tasks: [
          "Define project scope",
          "Coordinate with stakeholders",
          "Mentor junior developers",
        ],
      },
      {
        id: 3,
        title: "Obtain Cloud Certification",
        deadline: "October 15, 2025",
        progress: 20,
        status: "Not Started",
        description: "Get certified in AWS or Azure cloud services",
        tasks: [
          "Complete certification course",
          "Practice with hands-on labs",
          "Pass certification exam",
        ],
      },
    ],
    skills: [
      { name: "System Design", current: 3, target: 5 },
      { name: "Team Leadership", current: 2, target: 4 },
      { name: "Cloud Architecture", current: 3, target: 5 },
      { name: "Code Review", current: 4, target: 5 },
    ],
  };

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Career Development Plan</h1>
        <p className="text-muted-foreground">
          Track your progress and achieve your career goals
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Role</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{careerPlan.currentRole}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Target Role</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{careerPlan.targetRole}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Timeline</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{careerPlan.timeline}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{careerPlan.progress}%</div>
            <Progress value={careerPlan.progress} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Development Plan</CardTitle>
              <CardDescription>{careerPlan.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {careerPlan.milestones.map((milestone) => (
                  <div
                    key={milestone.id}
                    className={`p-4 border rounded-lg space-y-3 cursor-pointer transition-colors ${
                      selectedMilestone === milestone.id
                        ? "border-primary bg-muted/50"
                        : "hover:border-primary/50"
                    }`}
                    onClick={() => setSelectedMilestone(milestone.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-lg">{milestone.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {milestone.description}
                        </p>
                      </div>
                      <Badge
                        variant={milestone.status === "Completed" ? "default" : "secondary"}
                      >
                        {milestone.status}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{milestone.progress}%</span>
                      </div>
                      <Progress value={milestone.progress} />
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Due {milestone.deadline}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Skills Development</CardTitle>
              <CardDescription>Track your skill progression</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {careerPlan.skills.map((skill, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{skill.name}</span>
                      <span className="text-muted-foreground">
                        Level {skill.current} → {skill.target}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`h-2 w-full rounded ${
                            i < skill.current
                              ? "bg-primary"
                              : i < skill.target
                              ? "bg-primary/30"
                              : "bg-muted"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Tools to help you progress</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" variant="outline">
                Schedule Mentor Meeting
              </Button>
              <Button className="w-full" variant="outline">
                Update Progress
              </Button>
              <Button className="w-full" variant="outline">
                View Learning Resources
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}