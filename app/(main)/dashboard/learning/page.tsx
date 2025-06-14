"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Clock, Star, Trophy, Video, CheckCircle } from "lucide-react";

export default function LearningPage() {
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

  const courses = [
    {
      id: "1",
      title: "Web Development Fundamentals",
      description: "Learn the basics of HTML, CSS, and JavaScript",
      progress: 75,
      duration: "8 hours",
      level: "Beginner",
      category: "Development",
      modules: 12,
      completedModules: 9,
    },
    {
      id: "2",
      title: "React Advanced Patterns",
      description: "Master advanced React concepts and patterns",
      progress: 45,
      duration: "10 hours",
      level: "Advanced",
      category: "Development",
      modules: 15,
      completedModules: 7,
    },
    {
      id: "3",
      title: "System Design for Scale",
      description: "Learn how to design scalable systems",
      progress: 30,
      duration: "12 hours",
      level: "Intermediate",
      category: "Architecture",
      modules: 10,
      completedModules: 3,
    },
    {
      id: "4",
      title: "Data Structures & Algorithms",
      description: "Essential algorithms and data structures",
      progress: 60,
      duration: "15 hours",
      level: "Intermediate",
      category: "Computer Science",
      modules: 20,
      completedModules: 12,
    },
  ];

  const recommendedCourses = [
    {
      id: "5",
      title: "Cloud Architecture Fundamentals",
      description: "Introduction to cloud computing and architecture",
      duration: "10 hours",
      level: "Beginner",
      category: "Cloud",
    },
    {
      id: "6",
      title: "Machine Learning Basics",
      description: "Get started with machine learning concepts",
      duration: "12 hours",
      level: "Beginner",
      category: "AI/ML",
    },
  ];

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Learning Hub</h1>
        <p className="text-muted-foreground">
          Track your progress and continue learning
        </p>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Courses in Progress
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{courses.length}</div>
            <p className="text-xs text-muted-foreground">
              Active learning paths
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Hours Learned
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">
              Hours of content completed
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Certificates Earned
            </CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              Completed certifications
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Rating
            </CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.8</div>
            <p className="text-xs text-muted-foreground">
              Out of 5 stars
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="in-progress" className="space-y-6">
        <TabsList>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="recommended">Recommended</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="in-progress" className="space-y-6">
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            {courses.map((course) => (
              <Card key={course.id} className="overflow-hidden">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{course.title}</CardTitle>
                      <CardDescription>{course.description}</CardDescription>
                    </div>
                    <Badge variant="secondary">{course.level}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="h-2" />
                  </div>
                  <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {course.duration}
                    </div>
                    <div className="flex items-center">
                      <Video className="h-4 w-4 mr-1" />
                      {course.completedModules}/{course.modules} modules
                    </div>
                  </div>
                  <Button className="w-full">Continue Learning</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recommended" className="space-y-6">
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            {recommendedCourses.map((course) => (
              <Card key={course.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{course.title}</CardTitle>
                      <CardDescription>{course.description}</CardDescription>
                    </div>
                    <Badge variant="secondary">{course.level}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {course.duration}
                    </div>
                    <Badge variant="outline">{course.category}</Badge>
                  </div>
                  <Button className="w-full">Start Course</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="space-y-6">
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Python Programming Basics</CardTitle>
                    <CardDescription>Introduction to Python programming language</CardDescription>
                  </div>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    6 hours
                  </div>
                  <Badge variant="outline">Completed on Mar 15, 2025</Badge>
                </div>
                <Button variant="outline" className="w-full">View Certificate</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}