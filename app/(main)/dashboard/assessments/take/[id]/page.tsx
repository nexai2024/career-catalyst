"use client";

import { useState, useEffect } from "react";
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
}

interface AssessmentQuestion {
  id: string;
  points: number;
  question_order: number;
  questions: Question;
}

interface Assessment {
  id: string;
  title: string;
  description?: string;
  instructions?: string;
  time_limit_minutes?: number;
  passing_score?: number;
  assessment_questions: AssessmentQuestion[];
}

export default function TakeAssessmentPage({ params }: { params: params }) {
  let id;
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
    id = params.id;
    console.log("Assessment ID:", id);
    const fetchAssessment = async () => {
      try {
        const assessmentRes = await fetch(`/api/assessments/${params.id}`);
        if (!assessmentRes.ok) {
          throw new Error("Assessment not found");
        }

        const assessmentData = await assessmentRes.json();
        const sortedQuestions = assessmentData.assessment_questions.sort((a: { question_order: number; }, b: { question_order: number; }) => a.question_order - b.question_order);
        setAssessment({ ...assessmentData, assessment_questions: sortedQuestions });

        if (assessmentData.time_limit_minutes) {
          setTimeRemaining(assessmentData.time_limit_minutes * 60);
        }

        setLoading(false);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load assessment",
          variant: "destructive",
        });
        router.push("/assessments");
      }
    };
    fetchAssessment();
  }, [params.id, router, toast]);


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

  const startAssessment = () => {
    try {
      const startRes = fetch(`/api/assessments/${params.id}/start`, {
        method: "POST",
      });

      if (!startRes.ok) {
        throw new Error("Failed to start assessment");
      }

      const startData = startRes.json();
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
    setResponses((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };



  const handleSubmit = async () => {
    if (!attemptId || !assessment) return;

    setSubmitting(true);
    try {
      const questions = assessment ? assessment.assessment_questions : [];
      const formattedResponses = questions.map((aq) => {
        const userResponse = responses[aq.questions.id] || ""; // Fallback to empty string if no response
        return {
          questionId: aq.questions.id,
          answer: userResponse,
          isCorrect: userResponse === aq.questions.correct_answer,
          pointsEarned: userResponse === aq.questions.correct_answer ? aq.points : 0,
        };
      });

      const submitRes = await fetch(`/api/assessments/${params.id}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
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

      router.push("/assessments");
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
    return assessment.assessment_questions.filter(aq =>
      responses[aq.questions.id] && responses[aq.questions.id].trim() !== ""
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
            <Button className="mt-4" onClick={() => router.push("/assessments")}>
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
                  <li>• {assessment.assessment_questions.length} questions</li>
                  {assessment.time_limit_minutes && (
                    <li>• {assessment.time_limit_minutes} minutes time limit</li>
                  )}
                  {assessment.passing_score && (
                    <li>• {assessment.passing_score}% required to pass</li>
                  )}
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Important Notes</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• You can navigate between questions</li>
                  <li>• Your progress is automatically saved</li>
                  <li>• Review your answers before submitting</li>
                  {assessment.time_limit_minutes && (
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
    const questions = assessment?.assessment_questions;
  }

  const questions = assessment.assessment_questions.sort((a, b) => a.question_order - b.question_order);
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
                <span className="font-mono">{formatTime(timeRemaining)}</span>
              </div>
              <Clock className="h-4 w-4" />
              <span className="font-mono">{formatTime(timeRemaining)}</span>
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
                <h3 className="text-lg font-medium mb-4">{currentQuestion.questions.question_text}</h3>

                {currentQuestion.questions.question_type === "multiple_choice" && (
                  <RadioGroup
                    value={responses[currentQuestion.questions.id] || ""}
                    onValueChange={(value) => handleResponseChange(currentQuestion.questions.id, value)}
                  >
                    <div className="space-y-3">
                      {currentQuestion.questions.options?.choices.map((choice: string, index: number) => (
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

                {currentQuestion.questions.question_type === "true_false" && (
                  <RadioGroup
                    value={responses[currentQuestion.questions.id] || ""}
                    onValueChange={(value) => handleResponseChange(currentQuestion.questions.id, value)}
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

                {(currentQuestion.questions.question_type === "short_answer" ||
                  currentQuestion.questions.question_type === "essay") && (
                    <Textarea
                      value={responses[currentQuestion.questions.id] || ""}
                      onChange={(e) => handleResponseChange(currentQuestion.questions.id, e.target.value)}
                      placeholder="Enter your answer..."
                      className={currentQuestion.questions.question_type === "essay" ? "min-h-[150px]" : "min-h-[100px]"}
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
        </AlertDialogContent>
        <AlertDialogFooter>
          <AlertDialogCancel>Review Answers</AlertDialogCancel>
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