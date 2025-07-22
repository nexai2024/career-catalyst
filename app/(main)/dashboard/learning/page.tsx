"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  BookOpen, 
  Clock, 
  Star, 
  Trophy, 
  Video, 
  Search,
  Award
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@/hooks/use-query";

interface Course {
  id: string;
  title: string;
  description: string;
  short_description?: string;
  category: string;
  level: string;
  duration_hours: number;
  thumbnail_url?: string;
  average_rating: number;
  review_count: number;
  price: number;
  created_at: string;
}

interface EnrolledCourse {
  id: string;
  progress_percentage: number;
  status: string;
  enrolled_at: string;
  last_accessed_at?: string;
  courses: Course;
}

const fetchCourses = async (category?: string, level?: string) => {
  const params = new URLSearchParams();
  if (category) params.append('category', category);
  if (level) params.append('level', level);
  const response = await fetch(`/api/courses?${params}`);
  if (!response.ok) {
    throw new Error("Failed to load courses");
  }
  return response.json();
};

const fetchEnrolledCourses = async () => {
  const response = await fetch("/api/courses?enrolled=true");
  if (!response.ok) {
    throw new Error("Failed to load enrolled courses");
  }
  return response.json();
};

export default function LearningPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedLevel, setSelectedLevel] = useState<string>("");
  const { toast } = useToast();

  const { data: availableCourses, loading: loadingCourses, refetch: refetchAvailableCourses } = useQuery<Course[]>({
    queryFn: () => fetchCourses(selectedCategory, selectedLevel),
  });

  const { data: enrolledCourses, loading: loadingEnrolledCourses, refetch: refetchEnrolledCourses } = useQuery<EnrolledCourse[]>({
    queryFn: fetchEnrolledCourses,
  });

  const loading = loadingCourses || loadingEnrolledCourses;

  useEffect(() => {
    refetchAvailableCourses();
  }, [selectedCategory, selectedLevel, refetchAvailableCourses]);

  const handleEnroll = async (courseId: string) => {
    try {
      const response = await fetch(`/api/courses/${courseId}/enroll`, {
        method: "POST",
      });

      if (response.ok) {
        toast({
          title: "Enrolled Successfully",
          description: "You have been enrolled in the course!",
        });
        refetchEnrolledCourses();
      } else {
        const error = await response.json();
        toast({
          title: "Enrollment Failed",
          description: error.error || "Failed to enroll in course",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to enroll in course",
        variant: "destructive",
      });
    }
  };

  const filteredCourses = availableCourses?.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const categories = Array.from(new Set(availableCourses?.map(course => course.category) || []));
  const levels = ['beginner', 'intermediate', 'advanced'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'in_progress':
        return 'secondary';
      case 'enrolled':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 md:p-6 space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Learning Hub</h1>
          <p className="text-muted-foreground">Loading courses...</p>
        </div>
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-full"></div>
              </CardHeader>
              <CardContent>
                <div className="h-20 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Learning Hub</h1>
          <p className="text-muted-foreground">
            Expand your skills with our comprehensive course library
          </p>
        </div>
        <Link href="/dashboard/learning-plan">
          <Button>View Learning Plan</Button>
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{enrolledCourses?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Active learning paths</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {enrolledCourses?.filter(c => c.status === 'completed').length || 0}
            </div>
            <p className="text-xs text-muted-foreground">Courses finished</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {enrolledCourses?.reduce((total, course) => total + (course.courses.duration_hours || 0), 0) || 0}
            </div>
            <p className="text-xs text-muted-foreground">Learning time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Progress</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(enrolledCourses && enrolledCourses.length > 0)
                ? Math.round(enrolledCourses.reduce((total, course) => total + course.progress_percentage, 0) / enrolledCourses.length)
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground">Completion rate</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="my-courses" className="space-y-6">
        <TabsList>
          <TabsTrigger value="my-courses">My Courses</TabsTrigger>
          <TabsTrigger value="browse">Browse Courses</TabsTrigger>
        </TabsList>

        <TabsContent value="my-courses" className="space-y-6">
          {!enrolledCourses || enrolledCourses.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Enrolled Courses</h3>
                <p className="text-muted-foreground mb-4">
                  You haven&apos;t enrolled in any courses yet. Browse our course catalog to get started.
                </p>
                <Button onClick={() => (document.querySelector('[value="browse"]') as HTMLButtonElement)?.click()}>
                  Browse Courses
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
              {enrolledCourses.map((enrollment) => (
                <Card key={enrollment.id} className="overflow-hidden">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="line-clamp-2">{enrollment.courses.title}</CardTitle>
                        <CardDescription className="line-clamp-2">
                          {enrollment.courses.short_description || enrollment.courses.description}
                        </CardDescription>
                      </div>
                      <Badge variant={getStatusColor(enrollment.status)} className="ml-2">
                        {enrollment.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{enrollment.progress_percentage}%</span>
                      </div>
                      <Progress value={enrollment.progress_percentage} className="h-2" />
                    </div>
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {enrollment.courses.duration_hours}h
                      </div>
                      <div className="flex items-center">
                        <Badge className={`text-xs ${getLevelColor(enrollment.courses.level)}`}>
                          {enrollment.courses.level}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-muted-foreground">
                        {enrollment.last_accessed_at ? (
                          <>Last accessed: {new Date(enrollment.last_accessed_at).toLocaleDateString()}</>
                        ) : (
                          <>Enrolled: {new Date(enrollment.enrolled_at).toLocaleDateString()}</>
                        )}
                      </div>
                      <Link href={`/learning/courses/${enrollment.courses.id}`}>
                        <Button size="sm">
                          {enrollment.status === 'completed' ? 'Review' : 'Continue'}
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="browse" className="space-y-6">
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="All Levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Levels</SelectItem>
                {levels.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {(selectedCategory || selectedLevel || searchTerm) && (
              <Button 
                variant="outline" 
                onClick={() => {
                  setSelectedCategory("");
                  setSelectedLevel("");
                  setSearchTerm("");
                }}
              >
                Clear
              </Button>
            )}
          </div>

          {/* Course Grid */}
          {filteredCourses.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Courses Found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search criteria or browse all available courses.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {filteredCourses.map((course) => (
                <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                    {course.thumbnail_url ? (
                      <Image
                        src={course.thumbnail_url} 
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Video className="h-12 w-12 text-muted-foreground" />
                    )}
                  </div>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="line-clamp-2">{course.title}</CardTitle>
                        <CardDescription className="line-clamp-2">
                          {course.short_description || course.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge className={`text-xs ${getLevelColor(course.level)}`}>
                        {course.level}
                      </Badge>
                      <Badge variant="outline">{course.category}</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {course.duration_hours}h
                      </div>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
                        {course.average_rating.toFixed(1)} ({course.review_count})
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="text-lg font-bold">
                        {course.price === 0 ? 'Free' : `$${course.price}`}
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/learning/courses/${course.id}`}>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </Link>
                        <Button 
                          size="sm"
                          onClick={() => handleEnroll(course.id)}
                          disabled={enrolledCourses?.some(e => e.courses.id === course.id)}
                        >
                          {enrolledCourses?.some(e => e.courses.id === course.id) ? 'Enrolled' : 'Enroll'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}