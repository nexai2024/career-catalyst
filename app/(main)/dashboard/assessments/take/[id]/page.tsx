"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, ChevronRight, Clock, AlertCircle, CheckCircle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface params {

  id: Promise<any>;
}


interface Question {
  id: string;
  question_text: string;
  question_type: "multiple_choice" | "true_false" | "short_answer" | "essay";
  options?: {
    choices: string[];
  };
  correct_answer?: string;
  explanation?: string;
  category?: string;
  difficulty?: string;
  points?: number;
}

interface AssessmentQuestion {
  id: string;
  question: Question;
}

interface Assessment {
  id: string;
  title: string;
  description?: string;
  type?: string;
  passingScore?: number;
  timeLimit?: number; // in minutes
  instructions?: string;
  attempts: number;
  questions: AssessmentQuestion[];
}

export default function TakeAssessmentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);

  const [showInstructions, setShowInstructions] = useState(true);
  useEffect(() => {
    
    const fetchAssessment = async () => {
      try {
        const assessmentRes = await fetch(`/api/assessments/${id}`);
        if (!assessmentRes.ok) {
          throw new Error("Assessment not found");
        }
        const assessmentData = await assessmentRes.json();
        console.log("Assessment data fetched:", assessmentData);
        const sortedQuestions = assessmentData.questions;
        setAssessment({ ...assessmentData, assessment_questions: sortedQuestions });
        if (assessmentData.timeLimit) {
          setTimeRemaining(assessmentData.timeLimit * 60);
        }

        setLoading(false);
      } catch (error) {
        toast({
          title: "Error",
          description: `Failed to load assessment ${error}`,
          variant: "destructive",
        });
        router.push("/dashboard/assessments");
      }
    };
    fetchAssessment();
  }, [id, router, toast]);


  useEffect(() => {
    if (timeRemaining === null || timeRemaining <= 0 || showInstructions) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === undefined || prev === null || prev <= 0) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const handleAutoSubmit = () => {
      toast({
        title: "Time's Up!",
        description: "Assessment time has expired. Submitting your answers...",
        variant: "destructive",
      });
      handleSubmit();
    };

    return () => clearInterval(timer);
  }, 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [timeRemaining, showInstructions]);

  const startAssessment = async () => {
    try {
      const startRes = await fetch(`/api/assessments/${id}`, {
        method: "GET",
      });

      if (!startRes.ok) {
        throw new Error("Failed to start assessment");
      }

      const startData = await startRes.json();
      setAttemptId(startData.id);
      setShowInstructions(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start assessment",
        variant: "destructive",
      });
    }
  };

  const handleResponseChange = (questionId: string, value: string) => {
console.log("Response changed for question:", questionId, "Value:", value);
console.log("Current responses:", responses);
console.log("Previous responses:", responses[questionId]); 
setResponses((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };



  const handleSubmit = async () => {
    if (!attemptId || !assessment) return;

    setSubmitting(true);
    try {
      const questions = assessment ? assessment.questions : [];
      console.log("Submitting assessment with questions:", questions);
      console.log("User responses:", responses);
      const formattedResponses = questions.map((aq) => {
        const userResponse = responses[aq.question.id] || ""; // Fallback to empty string if no response
        return {
          questionId: aq.question.id,
          answer: userResponse,
          isCorrect: userResponse === aq.question.correct_answer,
          pointsEarned: userResponse === aq.question.correct_answer ? aq.question.points : 0,
        };
      });
console.log("Formatted responses:", formattedResponses);
      const submitRes = await fetch(`/api/user-assessments/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          assessmentId: assessment.id,
          score: formattedResponses.reduce((total, response) => total + (response.pointsEarned || 0), 0),
          status: "completed",
          attempts: assessment.attempts + 1,
          startedAt: new Date().toISOString(),
          attemptId,
          responses: formattedResponses,
        }),
      });

      if (!submitRes.ok) {
        throw new Error("Failed to submit assessment");
      }

      const result = await submitRes.json();

      toast({
        title: "Assessment Submitted",
        description: `Your score: ${result.score}%`,
      });

      router.push("/dashboard/assessments");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit assessment",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
      setShowSubmitDialog(false);
    }
  };

  const getAnsweredCount = () => {
    if (!assessment) return 0;
    return assessment.questions.filter(aq =>
      responses[aq.question.id] && responses[aq.question.id].trim() !== ""
    ).length;
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

  if (!assessment) {
    return (
      <div className="container mx-auto p-4 md:p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 mx-auto text-destructive mb-4" />
            <h3 className="text-lg font-medium mb-2">Assessment Not Found</h3>
            <p className="text-muted-foreground">
              The assessment you&apos;re looking for doesn&apos;t exist or is no longer available.
            </p>
            <Button className="mt-4" onClick={() => router.push("/dashboard/assessments")}>
              Back to Assessments
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showInstructions) {
    return (
      <div className="container mx-auto p-4 md:p-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{assessment.title}</CardTitle>
            <CardDescription>{assessment.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {assessment.instructions && (
              <div>
                <h3 className="font-medium mb-2">Instructions</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {assessment.instructions}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">Assessment Details</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• {assessment?.questions?.length || 0} questions</li>
                  {assessment?.timeLimit && (
                    <li>• {assessment.timeLimit} minutes time limit</li>
                  )}
                  {assessment?.passingScore && (
                    <li>• {assessment.passingScore}% required to pass</li>
                  )}
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Important Notes</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• You can navigate between questions</li>
                  <li>• Your progress is automatically saved</li>
                  <li>• Review your answers before submitting</li>
                  {assessment.timeLimit && (
                    <li>• Assessment will auto-submit when time expires</li>
                  )}
                </ul>
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <Button onClick={startAssessment} size="lg">
                Start Assessment
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
    const questions = assessment?.questions;
  }

  const questions = assessment.questions;
  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  // Converts a time duration in seconds into a formatted string "MM:SS".
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  // const getTimeRemainingClass = (timeRemaining: number | null) => {
  //   return timeRemaining !== null && timeRemaining < 300 ? 'text-destructive' : 'text-muted-foreground';
  // };
  //   return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  // };
  const getTimeRemainingClass = (timeRemaining: number | null) => {
    if (timeRemaining === null) return "text-muted-foreground";
    return timeRemaining < 300 ? "text-destructive" : "text-muted-foreground";
  };

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{assessment.title}</CardTitle>
              <CardDescription>
                Question {currentQuestionIndex + 1} of {questions.length}
              </CardDescription>
              <div className={`flex items-center gap-2 ${getTimeRemainingClass(timeRemaining)}`}>
                <Clock className="h-4 w-4" />
                <span className="font-mono">{timeRemaining !== null ? formatTime(timeRemaining) : "00:00"}</span>
              </div>
              <Clock className="h-4 w-4" />
              <span className="font-mono">{formatTime(timeRemaining ?? 0)}</span>
            </div>

            <div className="text-sm text-muted-foreground">
              {getAnsweredCount()}/{questions.length} answered
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-2">
              <span className="font-medium text-sm bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-1">
                {currentQuestionIndex + 1}
              </span>
              <div className="flex-1">
                <h3 className="text-lg font-medium mb-4">{currentQuestion.question.question_text}</h3>

                {currentQuestion.question.question_type === "multiple_choice" && (
                  <RadioGroup
                    value={responses[currentQuestion.question.id] || ""}
                    onValueChange={(value) => handleResponseChange(currentQuestion.question.id, value)}
                  >
                    <div className="space-y-3">
                      {currentQuestion.question.options?.choices.map((choice: string, index: number) => (
                        <div key={index} className="flex items-center space-x-2">
                          <RadioGroupItem value={choice} id={`choice-${index}`} />
                          <Label htmlFor={`choice-${index}`} className="flex-1 cursor-pointer">
                            {choice}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                )}

                {currentQuestion.question.question_type === "true_false" && (
                  <RadioGroup
                    value={responses[currentQuestion.question.id] || ""}
                    onValueChange={(value) => handleResponseChange(currentQuestion.question.id, value)}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="true" id="true" />
                        <Label htmlFor="true" className="cursor-pointer">True</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="false" id="false" />
                        <Label htmlFor="false" className="cursor-pointer">False</Label>
                      </div>
                    </div>
                  </RadioGroup>
                )}

                {(currentQuestion.question.question_type === "short_answer" ||
                  currentQuestion.question.question_type === "essay") && (
                    <Textarea
                      value={responses[currentQuestion.question.id] || ""}
                      onChange={(e) => handleResponseChange(currentQuestion.question.id, e.target.value)}
                      placeholder="Enter your answer..."
                      className={currentQuestion.question.question_type === "essay" ? "min-h-[150px]" : "min-h-[100px]"}
                    />
                  )}
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={() => setCurrentQuestionIndex((prev: number) => prev - 1)}
              disabled={currentQuestionIndex === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            {currentQuestionIndex === questions.length - 1 ? (
              <Button
                onClick={() => setShowSubmitDialog(true)}
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Submit Assessment"}
              </Button>
            ) : (
              <Button
                onClick={() => setCurrentQuestionIndex((prev: number) => prev + 1)}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
            <AlertDialogTitle>Confirm Submission</AlertDialogTitle>
        <AlertDialogHeader>
          <AlertDialogDescription>
            You are about to submit your assessment. Please review your answers before proceeding.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogContent>
          {getAnsweredCount() < questions.length && (
            <span className="block mt-2 text-amber-600">
              ⚠️ You have {questions.length - getAnsweredCount()} unanswered questions.
              Unanswered questions will be marked as incorrect and will reduce your final score.
            </span>
          )}
          <span> You have {questions.length - getAnsweredCount()} unanswered questions.
            These will be marked as incorrect.
          </span>
          <span className="block mt-2">
            Are you sure you want to submit your assessment? This action cannot be undone.
          </span>
          <AlertDialogCancel>Review Answers</AlertDialogCancel>
        </AlertDialogContent>
        
        <AlertDialogFooter>
          <AlertDialogAction onClick={handleSubmit} disabled={submitting}>
            {submitting ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                Submitting...
              </div>
            ) : (
              "Submit Assessment"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialog>
    </div>
  );
}