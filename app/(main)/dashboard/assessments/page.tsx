"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BrainCircuit, CheckCircle, Clock, ArrowRight, Users, Calendar, Settings } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

interface Assessment {
  id: string;
  title: string;
  description?: string;
  time_limit_minutes?: number;
  passing_score?: number;
  is_published: boolean;
  start_date?: string;
  end_date?: string;
  created_at: string;
}

interface UserAssessment {
  id: string;
  assessment_id: string;
  score?: number;
  status: string;
  start_time: string;
  end_time?: string;
  assessment: Assessment;
}

function AssessmentCard({
  assessment,
  onStart,
  isStarting,
}: {
  assessment: Assessment;
  onStart: (id: string) => void;
  isStarting: boolean;
}) {
  const isAvailable = () => {
    const now = new Date();
    if (assessment.start_date && new Date(assessment.start_date) > now) {
      return false;
    }
    if (assessment.end_date && new Date(assessment.end_date) < now) {
      return false;
    }
    return true;
  };

  const getAvailabilityText = () => {
    const now = new Date();
    if (assessment.start_date && new Date(assessment.start_date) > now) {
      return `Available from ${new Date(assessment.start_date).toLocaleDateString()}`;
    }
    if (assessment.end_date && new Date(assessment.end_date) < now) {
      return "Assessment has ended";
    }
    if (assessment.end_date) {
      return `Available until ${new Date(assessment.end_date).toLocaleDateString()}`;
    }
    return "Available now";
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{assessment.title}</CardTitle>
          <Badge variant={isAvailable() ? "default" : "secondary"}>
            {isAvailable() ? "Available" : "Unavailable"}
          </Badge>
        </div>
        <CardDescription>{assessment.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-3">
        {assessment.time_limit_minutes && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{assessment.time_limit_minutes} minutes</span>
          </div>
        )}
        {assessment.passing_score && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle className="h-4 w-4" />
            <span>{assessment.passing_score}% to pass</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{getAvailabilityText()}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={() => onStart(assessment.id)} 
          disabled={isStarting || !isAvailable()}
        >
          {isStarting ? "Preparing..." : "Start Assessment"}
          {!isStarting && <ArrowRight className="ml-2 h-4 w-4" />}
        </Button>
      </CardFooter>
    </Card>
  );
}

function CompletedAssessmentCard({
  userAssessment,
}: {
  userAssessment: UserAssessment;
}) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'in_progress':
        return 'secondary';
      case 'abandoned':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in_progress':
        return 'In Progress';
      case 'abandoned':
        return 'Abandoned';
      default:
        return status;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <CardTitle className="text-xl">{userAssessment.assessment.title}</CardTitle>
          </div>
          <Badge variant={getStatusColor(userAssessment.status)}>
            {getStatusText(userAssessment.status)}
          </Badge>
        </div>
        <CardDescription>
          Started on {new Date(userAssessment.start_time).toLocaleDateString()}
          {userAssessment.end_time && 
            ` • Completed on ${new Date(userAssessment.end_time).toLocaleDateString()}`
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {userAssessment.score !== null && userAssessment.score !== undefined && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium">Score</span>
              <span className="font-bold">{userAssessment.score}%</span>
            </div>
            <Progress value={userAssessment.score} className="h-2" />
            {userAssessment.assessment.passing_score && (
              <p className="text-sm text-muted-foreground">
                {userAssessment.score >= userAssessment.assessment.passing_score 
                  ? "✅ Passed" 
                  : "❌ Did not pass"
                } (Required: {userAssessment.assessment.passing_score}%)
              </p>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">View Details</Button>
        {userAssessment.status === 'completed' && (
          <Button>Retake Assessment</Button>
        )}
        {userAssessment.status === 'in_progress' && (
          <Link href={`/assessments/take/${userAssessment.assessment_id}`}>
            <Button>Continue Assessment</Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  );
}

export default function AssessmentsPage() {
  const [availableAssessments, setAvailableAssessments] = useState<Assessment[]>([]);
  const [userAssessments, setUserAssessments] = useState<UserAssessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [startingAssessment, setStartingAssessment] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const response = await fetch("/api/assessments");
        if (response.ok) {
          const data = await response.json();
          setAvailableAssessments(data);
        }
      } catch (error) {
        console.error("Error fetching assessments:", error);
        toast({
          title: "Error",
          description: "Failed to load assessments",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
  
    const fetchUserAssessments = async () => {
      try {
        const response = await fetch("/api/user-assessments");
        if (response.ok) {
          const data = await response.json();
          setUserAssessments(data);
        }
      } catch (error) {
        console.error("Error fetching user assessments:", error);
      }
    };
    fetchAssessments();
    fetchUserAssessments();
  }, [toast]);



  const handleStartAssessment = async (assessmentId: string) => {
    setStartingAssessment(assessmentId);
    try {
      const response = await fetch(`/api/assessments/${assessmentId}/start`, {
        method: "POST",
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Assessment Started",
          description: "Redirecting to assessment...",
        });
        // Redirect to assessment taking page
        window.location.href = `/dashboard/assessments/take/${assessmentId}`;
      } else {
        throw new Error("Failed to start assessment");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start assessment",
        variant: "destructive",
      });
    } finally {
      setStartingAssessment(null);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 md:p-6 space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Skills Assessment</h1>
          <p className="text-muted-foreground">Loading assessments...</p>
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
      <div className="flex flex-col space-y-2">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Skills Assessment</h1>
            <p className="text-muted-foreground">
              Evaluate your skills and track your progress over time
            </p>
          </div>
          <Link href="/dashboard/assessments/manage">
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Manage Assessments
            </Button>
          </Link>
        </div>
      </div>

      <Tabs defaultValue="available" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="available">Available Assessments</TabsTrigger>
          <TabsTrigger value="completed">My Assessments</TabsTrigger>
        </TabsList>

        <TabsContent value="available" className="space-y-6">
          {availableAssessments.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <BrainCircuit className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Assessments Available</h3>
                <p className="text-muted-foreground">
                  There are currently no published assessments available. Check back later or contact your administrator.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {availableAssessments.map((assessment) => (
                <AssessmentCard
                  key={assessment.id}
                  assessment={assessment}
                  onStart={handleStartAssessment}
                  isStarting={startingAssessment === assessment.id}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-6">
          {userAssessments.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Assessments Taken</h3>
                <p className="text-muted-foreground">
                  You haven&apos;t taken any assessments yet. Start with an available assessment to see your results here.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 grid-cols-1">
              {userAssessments.map((userAssessment) => (
                <CompletedAssessmentCard
                  key={userAssessment.id}
                  userAssessment={userAssessment}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}