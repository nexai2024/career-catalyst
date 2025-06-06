"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Video, Play, CheckCircle, Clock, Award } from "lucide-react";

export default function InterviewsPage() {
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for upcoming interviews
  const upcomingInterviews = [
    {
      id: 1,
      role: "Senior Software Engineer",
      company: "TechCorp Inc.",
      date: "2025-05-15T14:00:00",
      type: "Technical",
      duration: 60,
    },
    {
      id: 2,
      role: "Lead Developer",
      company: "InnovateSoft",
      date: "2025-05-18T15:30:00",
      type: "System Design",
      duration: 90,
    },
  ];

  // Mock data for past interviews
  const pastInterviews = [
    {
      id: 3,
      role: "Full Stack Developer",
      company: "WebSolutions LLC",
      date: "2025-04-10T10:00:00",
      type: "Technical",
      score: 85,
      feedback: "Strong technical knowledge, could improve system design explanations.",
    },
    {
      id: 4,
      role: "Frontend Engineer",
      company: "DesignTech",
      date: "2025-04-05T16:00:00",
      type: "Coding",
      score: 92,
      feedback: "Excellent problem-solving skills and clean code implementation.",
    },
  ];

  const startInterview = (type: string) => {
    setIsLoading(true);
    // Simulate starting an interview session
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Interview Preparation</h1>
        <p className="text-muted-foreground">
          Practice and prepare for your upcoming interviews with AI-powered mock interviews
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Interviews</CardTitle>
            <Video className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              +2 from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">88%</div>
            <p className="text-xs text-muted-foreground">
              +5% improvement
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Practice Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24h</div>
            <p className="text-xs text-muted-foreground">
              +8h this week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">75%</div>
            <p className="text-xs text-muted-foreground">
              +10% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Practice Interview Section */}
      <Card>
        <CardHeader>
          <CardTitle>Start Practice Interview</CardTitle>
          <CardDescription>
            Choose an interview type to begin your practice session
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Button
            className="h-24 flex flex-col items-center justify-center gap-2"
            onClick={() => startInterview("technical")}
            disabled={isLoading}
          >
            <Play className="h-8 w-8" />
            Technical Interview
          </Button>
          <Button
            className="h-24 flex flex-col items-center justify-center gap-2"
            onClick={() => startInterview("behavioral")}
            disabled={isLoading}
            variant="secondary"
          >
            <Play className="h-8 w-8" />
            Behavioral Interview
          </Button>
          <Button
            className="h-24 flex flex-col items-center justify-center gap-2"
            onClick={() => startInterview("system")}
            disabled={isLoading}
            variant="secondary"
          >
            <Play className="h-8 w-8" />
            System Design
          </Button>
          <Button
            className="h-24 flex flex-col items-center justify-center gap-2"
            onClick={() => startInterview("coding")}
            disabled={isLoading}
            variant="secondary"
          >
            <Play className="h-8 w-8" />
            Coding Interview
          </Button>
        </CardContent>
      </Card>

      {/* Upcoming Interviews */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Practice Sessions</CardTitle>
          <CardDescription>
            Your scheduled mock interviews
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {upcomingInterviews.map((interview) => (
            <div
              key={interview.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="space-y-1">
                <h3 className="font-medium">{interview.role}</h3>
                <p className="text-sm text-muted-foreground">{interview.company}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(interview.date).toLocaleString()} • {interview.duration} minutes
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  Reschedule
                </Button>
                <Button size="sm">Join</Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Past Interviews */}
      <Card>
        <CardHeader>
          <CardTitle>Past Interviews</CardTitle>
          <CardDescription>
            Review your previous interview performances
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {pastInterviews.map((interview) => (
            <div
              key={interview.id}
              className="space-y-4 p-4 border rounded-lg"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="font-medium">{interview.role}</h3>
                  <p className="text-sm text-muted-foreground">{interview.company}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(interview.date).toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg">{interview.score}%</div>
                  <p className="text-sm text-muted-foreground">{interview.type}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Performance</span>
                  <span>{interview.score}%</span>
                </div>
                <Progress value={interview.score} className="h-2" />
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Feedback</h4>
                <p className="text-sm text-muted-foreground">{interview.feedback}</p>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm">View Recording</Button>
                <Button variant="outline" size="sm">View Feedback</Button>
                <Button size="sm">Practice Again</Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}