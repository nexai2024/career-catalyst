"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";
import {
  ArrowUpRight,
  BookOpen,
  BrainCircuit,
  Briefcase,
  FileText,
  Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Mock data for the dashboard
  const skillData = [
    { name: "Technical", value: 75 },
    { name: "Leadership", value: 65 },
    { name: "Communication", value: 85 },
    { name: "Problem Solving", value: 80 },
  ];

  const learningData = [
    { name: "Web Development", completed: 80, total: 100 },
    { name: "Data Science", completed: 45, total: 100 },
    { name: "Project Management", completed: 65, total: 100 },
    { name: "UX Design", completed: 30, total: 100 },
  ];

  const applicationData = [
    { name: "Applied", value: 12 },
    { name: "Interview", value: 5 },
    { name: "Offer", value: 2 },
    { name: "Rejected", value: 8 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  const upcomingMilestones = [
    { id: 1, title: "Complete SQL Advanced Course", deadline: "May 15, 2025", progress: 65 },
    { id: 2, title: "Prepare for Technical Interview", deadline: "May 22, 2025", progress: 40 },
    { id: 3, title: "Update Portfolio with Projects", deadline: "June 1, 2025", progress: 25 },
  ];

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here&apos;s an overview of your career progress.
        </p>
        <Link href='/lp'>
          <Button variant="outline" className="mt-2">
            Generate Learning Plan
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-muted rounded w-1/2"></div>
                <div className="h-6 bg-muted rounded w-2/3"></div>
              </CardHeader>
              <CardContent>
                <div className="h-20 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <>
          {/* Quick stats */}
          <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard 
              title="Skills Assessment"
              value="78%"
              description="Overall skill rating"
              icon={<BrainCircuit className="h-5 w-5" />}
              linkHref="/dashboard/assessments"
            />
            <StatsCard 
              title="Learning Progress"
              value="65%"
              description="Course completion rate"
              icon={<BookOpen className="h-5 w-5" />}
              linkHref="/dashboard/learning"
            />
            <StatsCard 
              title="Interview Readiness"
              value="72%"
              description="Based on mock interviews"
              icon={<Video className="h-5 w-5" />}
              linkHref="/dashboard/interviews"
            />
            <StatsCard 
              title="Job Applications"
              value="27"
              description="Total applications"
              icon={<Briefcase className="h-5 w-5" />}
              linkHref="/dashboard/jobs"
            />
          </div>

          {/* Charts and data visualization */}
          <Tabs defaultValue="skills" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="skills">Skills Analysis</TabsTrigger>
              <TabsTrigger value="learning">Learning Progress</TabsTrigger>
              <TabsTrigger value="applications">Job Applications</TabsTrigger>
            </TabsList>
            
            {/* Skills Analysis Tab */}
            <TabsContent value="skills" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Skills Assessment Results</CardTitle>
                  <CardDescription>
                    Your skill levels across different competency areas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={skillData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="hsl(var(--chart-1))" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Learning Progress Tab */}
            <TabsContent value="learning" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Learning Progress</CardTitle>
                  <CardDescription>
                    Your progress across different learning paths
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {learningData.map((item, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="font-medium">{item.name}</span>
                          <span className="text-muted-foreground">
                            {item.completed}%
                          </span>
                        </div>
                        <Progress value={item.completed} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Job Applications Tab */}
            <TabsContent value="applications" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Job Application Status</CardTitle>
                  <CardDescription>
                    Overview of your current job applications
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie
                          data={applicationData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {applicationData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Upcoming milestones */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Upcoming Milestones</CardTitle>
                  <CardDescription>
                    Track your progress on career plan milestones
                  </CardDescription>
                </div>
                <Link href="/career-plan">
                  <Button variant="outline" size="sm">View All</Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {upcomingMilestones.map((milestone) => (
                  <div key={milestone.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{milestone.title}</span>
                      <span className="text-sm text-muted-foreground">Due: {milestone.deadline}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={milestone.progress} className="h-2 flex-1" />
                      <span className="text-sm font-medium w-10 text-right">
                        {milestone.progress}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick actions */}
          <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            <ActionCard 
              title="Take Assessment"
              description="Evaluate your skills with our comprehensive assessment"
              icon={<BrainCircuit className="h-6 w-6" />}
              href="/dashboard/assessments"
            />
            <ActionCard 
              title="Update Resume"
              description="Generate and update your resume with AI assistance"
              icon={<FileText className="h-6 w-6" />}
              href="/documents"
            />
            <ActionCard 
              title="Practice Interview"
              description="Prepare for interviews with our AI-powered mock interviews"
              icon={<Video className="h-6 w-6" />}
              href="/interviews"
            />
            <ActionCard 
              title="Browse Jobs"
              description="Find job opportunities matched to your profile"
              icon={<Briefcase className="h-6 w-6" />}
              href="/jobs"
            />
          </div>
        </>
      )}
    </div>
  );
}

function StatsCard({ 
  title, 
  value, 
  description, 
  icon,
  linkHref 
}: { 
  title: string; 
  value: string; 
  description: string; 
  icon: React.ReactNode;
  linkHref: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        <Link
          href={linkHref}
          className="inline-flex items-center pt-3 text-sm font-medium text-primary"
        >
          View details
          <ArrowUpRight className="ml-1 h-4 w-4" />
        </Link>
      </CardContent>
    </Card>
  );
}

function ActionCard({ 
  title, 
  description, 
  icon, 
  href 
}: { 
  title: string; 
  description: string; 
  icon: React.ReactNode; 
  href: string;
}) {
  return (
    <Link href={href}>
      <Card className="h-full transition-all hover:bg-muted/50">
        <CardHeader>
          <div className="flex items-center gap-2">
            {icon}
            <CardTitle className="text-lg">{title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-sm">{description}</CardDescription>
        </CardContent>
      </Card>
    </Link>
  );
}