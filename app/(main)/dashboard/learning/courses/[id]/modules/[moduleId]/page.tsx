"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle, 
  Clock,
  Video,
  FileText,
  Award,
  Play,
  Pause
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";

interface Module {
  id: string;
  title: string;
  description?: string;
  content_type: string;
  content_url?: string;
  content_text?: string;
  duration_minutes: number;
  module_order: number;
  is_required: boolean;
}

interface Course {
  id: string;
  title: string;
  course_modules: Module[];
}

interface ModuleProgress {
  id: string;
  module_id: string;
  status: string;
  completed_at?: string;
  time_spent_minutes: number;
  score?: number;
}

export default function ModulePage(
  props: { 
    params: Promise<{ id: string; moduleId: string }> 
  }
) {
  const params = use(props.params);
  const router = useRouter();
  const { toast } = useToast();
  const [course, setCourse] = useState<Course | null>(null);
  const [currentModule, setCurrentModule] = useState<Module | null>(null);
  const [progress, setProgress] = useState<ModuleProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeSpent, setTimeSpent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [notes, setNotes] = useState("");



  useEffect(() => {
    const fetchCourseAndModule = async () => {
      try {
        const response = await fetch(`/api/courses/${params.id}`);
        if (response.ok) {
          const courseData = await response.json();
          setCourse(courseData);
          
          const cmodule = courseData.course_modules.find((m: Module) => m.id === params.moduleId);
          setCurrentModule(cmodule);
          
          const moduleProgress = courseData.module_progress?.find((p: ModuleProgress) => p.module_id === params.moduleId);
          setProgress(moduleProgress);
          
          if (moduleProgress) {
            setTimeSpent(moduleProgress.time_spent_minutes);
          }
        }
      } catch (error) {
        console.error("Error fetching course:", error);
        toast({
          title: "Error",
          description: "Failed to load module",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }; 
    
    // Timer for tracking time spent
    const timer = setInterval(() => {
      if (isPlaying) {
        setTimeSpent(prev => prev + 1);
      }
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [params.id, params.moduleId, isPlaying]);

  const updateProgress = async (status: string, score?: number) => {
    try {
      const response = await fetch(`/api/courses/${params.id}/modules/${params.moduleId}/progress`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status,
          timeSpentMinutes: timeSpent,
          score
        }),
      });

      if (response.ok) {
        const updatedProgress = await response.json();
        setProgress(updatedProgress);
        
        if (status === 'completed') {
          toast({
            title: "Module Completed!",
            description: "Great job! You've completed this module.",
          });
        }
      }
    } catch (error) {
      console.error("Error updating progress:", error);
    }
  };

  const handleStartModule = () => {
    setIsPlaying(true);
    if (!progress || progress.status === 'not_started') {
      updateProgress('in_progress');
    }
  };

  const handleCompleteModule = () => {
    setIsPlaying(false);
    updateProgress('completed');
  };

  const navigateToModule = (direction: 'prev' | 'next') => {
    if (!course || !currentModule) return;

    const currentIndex = course.course_modules.findIndex(m => m.id === currentModule.id);
    const targetIndex = direction === 'prev' ? currentIndex - 1 : currentIndex + 1;
    
    if (targetIndex >= 0 && targetIndex < course.course_modules.length) {
      const targetModule = course.course_modules[targetIndex];
      router.push(`/learning/courses/${params.id}/modules/${targetModule.id}`);
    }
  };

  const getModuleIcon = (contentType: string) => {
    switch (contentType) {
      case 'video':
        return <Video className="h-5 w-5" />;
      case 'text':
      case 'reading':
        return <FileText className="h-5 w-5" />;
      case 'quiz':
        return <Award className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 md:p-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!course || !currentModule) {
    return (
      <div className="container mx-auto p-4 md:p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-medium mb-2">Module Not Found</h3>
            <p className="text-muted-foreground mb-4">
              The module you&apos;re looking for doesn&apos;t exist.
            </p>
            <Button onClick={() => router.push(`/learning/courses/${params.id}`)}>
              Back to Course
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentIndex = course.course_modules.findIndex(m => m.id === currentModule.id);
  const progressPercentage = ((currentIndex + 1) / course.course_modules.length) * 100;
  const isCompleted = progress?.status === 'completed';

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button 
          variant="outline" 
          onClick={() => router.push(`/learning/courses/${params.id}`)}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Course
        </Button>
        <div className="text-sm text-muted-foreground">
          Module {currentIndex + 1} of {course.course_modules.length}
        </div>
      </div>

      {/* Progress Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Course Progress</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                {getModuleIcon(currentModule.content_type)}
                <div className="flex-1">
                  <CardTitle>{currentModule.title}</CardTitle>
                  <CardDescription>{currentModule.description}</CardDescription>
                </div>
                {isCompleted && (
                  <CheckCircle className="h-6 w-6 text-green-600" />
                )}
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {currentModule.duration_minutes} min
                </div>
                <Badge variant="outline">
                  {currentModule.content_type.replace('_', ' ')}
                </Badge>
                {currentModule.is_required && (
                  <Badge variant="secondary">Required</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Content based on type */}
              {currentModule.content_type === 'video' && currentModule.content_url && (
                <div className="space-y-4">
                  <div className="aspect-video bg-black rounded-lg overflow-hidden">
                    <video 
                      controls 
                      className="w-full h-full"
                      onPlay={handleStartModule}
                      onPause={() => setIsPlaying(false)}
                    >
                      <source src={currentModule.content_url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                  <div className="flex justify-center">
                    <Button 
                      onClick={isPlaying ? () => setIsPlaying(false) : handleStartModule}
                      size="lg"
                    >
                      {isPlaying ? (
                        <>
                          <Pause className="h-4 w-4 mr-2" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          {progress?.status === 'not_started' ? 'Start' : 'Resume'}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {(currentModule.content_type === 'text' || currentModule.content_type === 'reading') && (
                <div className="space-y-4">
                  <div className="prose max-w-none">
                    <div className="whitespace-pre-wrap text-muted-foreground">
                      {currentModule.content_text}
                    </div>
                  </div>
                  {!isPlaying && (
                    <div className="flex justify-center">
                      <Button onClick={handleStartModule} size="lg">
                        <Play className="h-4 w-4 mr-2" />
                        Start Reading
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {currentModule.content_type === 'quiz' && (
                <div className="space-y-4">
                  <div className="p-6 bg-muted rounded-lg text-center">
                    <Award className="h-12 w-12 mx-auto text-primary mb-4" />
                    <h3 className="text-lg font-medium mb-2">Quiz Module</h3>
                    <p className="text-muted-foreground mb-4">
                      Test your knowledge with this interactive quiz.
                    </p>
                    <Button onClick={handleStartModule} size="lg">
                      <Play className="h-4 w-4 mr-2" />
                      Start Quiz
                    </Button>
                  </div>
                </div>
              )}

              {/* Notes Section */}
              {isPlaying && (
                <div className="space-y-4 border-t pt-6">
                  <h3 className="font-medium">Your Notes</h3>
                  <Textarea
                    placeholder="Take notes while learning..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
              )}

              {/* Complete Module Button */}
              {isPlaying && !isCompleted && (
                <div className="flex justify-center pt-6">
                  <Button onClick={handleCompleteModule} size="lg">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark as Complete
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => navigateToModule('prev')}
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous Module
            </Button>
            <Button
              onClick={() => navigateToModule('next')}
              disabled={currentIndex === course.course_modules.length - 1}
            >
              Next Module
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Module Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {Math.round((timeSpent / currentModule.duration_minutes) * 100)}%
                </div>
                <p className="text-sm text-muted-foreground">Time Progress</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Time Spent</span>
                  <span>{timeSpent} / {currentModule.duration_minutes} min</span>
                </div>
                <Progress 
                  value={(timeSpent / currentModule.duration_minutes) * 100} 
                  className="h-2" 
                />
              </div>
              {progress?.score && (
                <div className="text-center pt-4 border-t">
                  <div className="text-lg font-semibold">Score: {progress.score}%</div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Course Modules</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {course.course_modules.map((module, index) => {
                  const moduleProgress = course.course_modules.find(m => m.id === module.id);
                  const isCurrent = module.id === currentModule.id;
                  const isModuleCompleted = moduleProgress && progress?.status === 'completed';

                  return (
                    <div
                      key={module.id}
                      className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors ${
                        isCurrent ? 'bg-primary/10 border border-primary/20' : 'hover:bg-muted'
                      }`}
                      onClick={() => router.push(`/learning/courses/${params.id}/modules/${module.id}`)}
                    >
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-xs">
                        {isModuleCompleted ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          index + 1
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm truncate ${isCurrent ? 'font-medium' : ''}`}>
                          {module.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {module.duration_minutes} min
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}