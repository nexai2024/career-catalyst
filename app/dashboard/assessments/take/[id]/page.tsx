"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, ChevronRight, Clock, AlertCircle } from "lucide-react";

interface Question {
  id: string;
  question_text: string;
  question_type: "multiple_choice" | "true_false" | "short_answer" | "essay";
  options?: {
    choices: string[];
  };
}
type Params = Promise<{ id: string }>;
export default function TakeAssessmentPage({ params }: { params: Params }) {
  const id = useParams<{ id: string }>();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [assessment, setAssessment] = useState<any>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [attemptId, setAttemptId] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        // Start the assessment attempt
        const startRes = await fetch(`/api/assessments/${id}/start`, {
          method: "POST",
        });
        const startData = await startRes.json();
        setAttemptId(startData.id);

        // Fetch assessment details
        const assessmentRes = await fetch(`/api/assessments/${id}`);
        const assessmentData = await assessmentRes.json();
        setAssessment(assessmentData);
        
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
      }
    };

    fetchAssessment();
  }, [id, toast]);


  const handleResponseChange = (questionId: string, value: string) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!attemptId) return;

    setSubmitting(true);
    try {
      const questions = assessment.assessment_questions;
      const formattedResponses = questions.map((aq: any) => ({
        questionId: aq.question.id,
        answer: responses[aq.question.id] || "",
        isCorrect: responses[aq.question.id] === aq.question.correct_answer,
        pointsEarned: responses[aq.question.id] === aq.question.correct_answer ? aq.points : 0,
      }));

      await fetch(`/api/assessments/${id}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          attemptId,
          responses: formattedResponses,
        }),
      });

      toast({
        title: "Success",
        description: "Assessment submitted successfully",
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
  useEffect(() => {
    if (timeRemaining === null || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === null || prev <= 0) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, handleSubmit]);

  const questions = assessment.assessment_questions;
  const currentQuestion = questions[currentQuestionIndex].question;
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{assessment.title}</CardTitle>
              <CardDescription>{assessment.description}</CardDescription>
            </div>
            {timeRemaining !== null && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{formatTime(timeRemaining)}</span>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">{currentQuestion.question_text}</h3>

            {currentQuestion.question_type === "multiple_choice" && (
              <RadioGroup
                value={responses[currentQuestion.id] || ""}
                onValueChange={(value) => handleResponseChange(currentQuestion.id, value)}
              >
                <div className="space-y-3">
                  {currentQuestion.options?.choices.map((choice: string, index: number) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem value={choice} id={`choice-${index}`} />
                      <Label htmlFor={`choice-${index}`}>{choice}</Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            )}

            {currentQuestion.question_type === "true_false" && (
              <RadioGroup
                value={responses[currentQuestion.id] || ""}
                onValueChange={(value) => handleResponseChange(currentQuestion.id, value)}
              >
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="true" id="true" />
                    <Label htmlFor="true">True</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="false" id="false" />
                    <Label htmlFor="false">False</Label>
                  </div>
                </div>
              </RadioGroup>
            )}

            {(currentQuestion.question_type === "short_answer" || 
              currentQuestion.question_type === "essay") && (
              <Textarea
                value={responses[currentQuestion.id] || ""}
                onChange={(e) => handleResponseChange(currentQuestion.id, e.target.value)}
                placeholder="Enter your answer..."
                className="min-h-[100px]"
              />
            )}
          </div>

          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
              disabled={currentQuestionIndex === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            
            {currentQuestionIndex === questions.length - 1 ? (
              <Button
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Submit Assessment"}
              </Button>
            ) : (
              <Button
                onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}