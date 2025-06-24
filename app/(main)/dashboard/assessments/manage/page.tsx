"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Trash2, FileEdit, Eye, Clock, Users, CheckCircle } from "lucide-react";

const assessmentFormSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().optional(),
  instructions: z.string().optional(),
  timeLimit: z.number().min(1).optional(),
  type: z.enum(["quiz", "exam", "survey","default"]).default("default"),
  passingScore: z.number().min(0).max(100).optional(),
  attemptsAllowed: z.number().min(1).default(1),
  randomizeQuestions: z.boolean().default(false),
  isPublished: z.boolean().default(false),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

const questionFormSchema = z.object({
  questionText: z.string().min(2, {
    message: "Question text must be at least 2 characters.",
  }),
  questionType: z.enum(["multiple_choice", "true_false", "short_answer", "essay"]),
  options: z.array(z.string()).optional(),
  correctAnswer: z.string().optional(),
  explanation: z.string().optional(),
  category: z.string().optional(),
  difficulty: z.enum(["easy", "medium", "hard"]),
  points: z.number().min(1).default(1),
});

interface Assessment {
  id: string;
  title: string;
  description?: string;
  time_limit_minutes?: number;
  passing_score?: number;
  is_published: boolean;
  created_at: string;
  _count?: {
    assessment_questions: number;
  };
}

interface Question {
  id: string;
  question_text: string;
  question_type: string;
  category?: string;
  difficulty: string;
  created_at: string;
}

export default function ManageAssessmentsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestionType, setSelectedQuestionType] = useState<string>("multiple_choice");
  const [options, setOptions] = useState<string[]>([""]);
  const [isQuestionDialogOpen, setIsQuestionDialogOpen] = useState(false);

  const assessmentForm = useForm<z.infer<typeof assessmentFormSchema>>({
    resolver: zodResolver(assessmentFormSchema),
    defaultValues: {
      title: "",
      description: "",
      instructions: "",
      timeLimit: 60,
      type: "default",
      passingScore: 70,
      attemptsAllowed: 1,
      randomizeQuestions: false,
      isPublished: false,
      startDate: "",
      endDate: "",
    },
  });

  const questionForm = useForm<z.infer<typeof questionFormSchema>>({
    resolver: zodResolver(questionFormSchema),
    defaultValues: {
      questionText: "",
      questionType: "multiple_choice",
      options: [""],
      correctAnswer: "",
      explanation: "",
      category: "",
      difficulty: "medium",
      points: 1,
    },
  });

  useEffect(() => {
    fetchAssessments();
    fetchQuestions();
  }, []);

  const fetchAssessments = async () => {
    try {
      const response = await fetch("/api/assessments/manage");
      if (response.ok) {
        const data = await response.json();
        setAssessments(data);
      }
    } catch (error) {
      console.error("Error fetching assessments:", error);
    }
  };

  const fetchQuestions = async () => {
    try {
      const response = await fetch("/api/questions");
      if (response.ok) {
        const data = await response.json();
        setQuestions(data);
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const onAssessmentSubmit = async (values: z.infer<typeof assessmentFormSchema>) => {
    setLoading(true);
    try {
      const response = await fetch("/api/assessments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: values.title,
          description: values.description,
          instructions: values.instructions,
          timeLimit: values.timeLimit,
          type: values.type,
          passingScore: values.passingScore,
          attemptsAllowed: values.attemptsAllowed,
          randomizeQuestions: values.randomizeQuestions,
          isPublished: values.isPublished,
          startDate: values.startDate,
          endDate: values.endDate,
        }),
      });

      if (!response.ok) throw new Error("Failed to create assessment");

      toast({
        title: "Success",
        description: "Assessment created successfully",
      });

      assessmentForm.reset();
      fetchAssessments();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create assessment",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const onQuestionSubmit = async (values: z.infer<typeof questionFormSchema>) => {
    setLoading(true);
    try {
      const response = await fetch("/api/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questionText: values.questionText,
          questionType: values.questionType,
          options: values.questionType === "multiple_choice" ? { choices: options.filter(opt => opt.trim()) } : undefined,
          correctAnswer: values.correctAnswer,
          explanation: values.explanation,
          category: values.category,
          difficulty: values.difficulty,
          points: values.points,
        }),
      });

      if (!response.ok) throw new Error("Failed to create question");

      toast({
        title: "Success",
        description: "Question created successfully",
      });

      questionForm.reset();
      setOptions([""]);
      setIsQuestionDialogOpen(false);
      fetchQuestions();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create question",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteAssessment = async (id: string) => {
    try {
      const response = await fetch(`/api/assessments/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete assessment");

      toast({
        title: "Success",
        description: "Assessment deleted successfully",
      });

      fetchAssessments();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete assessment",
        variant: "destructive",
      });
    }
  };

  const togglePublishStatus = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/assessments/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          is_published: !currentStatus,
        }),
      });

      if (!response.ok) throw new Error("Failed to update assessment");

      toast({
        title: "Success",
        description: `Assessment ${!currentStatus ? 'published' : 'unpublished'} successfully`,
      });

      fetchAssessments();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update assessment",
        variant: "destructive",
      });
    }
  };

  const addOption = () => {
    setOptions([...options, ""]);
  };

  const removeOption = (index: number) => {
    if (options.length > 1) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Assessment Management</h1>
        <p className="text-muted-foreground">
          Create and manage assessments and questions
        </p>
      </div>

      <Tabs defaultValue="create-assessment" className="space-y-6">
        <TabsList>
          <TabsTrigger value="create-assessment">Create Assessment</TabsTrigger>
          <TabsTrigger value="questions">Question Bank</TabsTrigger>
          <TabsTrigger value="manage">Manage Assessments</TabsTrigger>
        </TabsList>

        <TabsContent value="create-assessment">
          <Card>
            <CardHeader>
              <CardTitle>Create New Assessment</CardTitle>
              <CardDescription>
                Set up a new assessment with custom settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...assessmentForm}>
                <form onSubmit={assessmentForm.handleSubmit(onAssessmentSubmit)} className="space-y-6">
                  <FormField
                    control={assessmentForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter assessment title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={assessmentForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter assessment description" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={assessmentForm.control}
                    name="instructions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Instructions</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter instructions for test takers" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={assessmentForm.control}
                      name="timeLimit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Time Limit (minutes)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field}
                              onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                            />
                          </FormControl>
                          <FormDescription>
                            Leave empty for no time limit
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={assessmentForm.control}
                      name="passingScore"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Passing Score (%)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field}
                              onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={assessmentForm.control}
                      name="attemptsAllowed"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Attempts Allowed</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={assessmentForm.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Date (Optional)</FormLabel>
                          <FormControl>
                            <Input 
                              type="datetime-local" 
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={assessmentForm.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Date (Optional)</FormLabel>
                          <FormControl>
                            <Input 
                              type="datetime-local" 
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-4">
                    <FormField
                      control={assessmentForm.control}
                      name="randomizeQuestions"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Randomize Questions
                            </FormLabel>
                            <FormDescription>
                              Shuffle question order for each attempt
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={assessmentForm.control}
                      name="isPublished"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Publish Assessment
                            </FormLabel>
                            <FormDescription>
                              Make this assessment available to users
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <FormField
                      control={assessmentForm.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Assessment Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select assessment type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="quiz">Quiz</SelectItem>
                              <SelectItem value="exam">Exam</SelectItem>
                              <SelectItem value="survey">Survey</SelectItem>
                              <SelectItem value="default">Default</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button type="submit" disabled={loading}>
                    {loading ? "Creating..." : "Create Assessment"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="questions">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Question Bank</CardTitle>
                    <CardDescription>
                      Manage your question library
                    </CardDescription>
                  </div>
                  <Dialog open={isQuestionDialogOpen} onOpenChange={setIsQuestionDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Question
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Create New Question</DialogTitle>
                        <DialogDescription>
                          Add a new question to your question bank
                        </DialogDescription>
                      </DialogHeader>
                      <Form {...questionForm}>
                        <form onSubmit={questionForm.handleSubmit(onQuestionSubmit)} className="space-y-6">
                          <FormField
                            control={questionForm.control}
                            name="questionText"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Question Text</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    placeholder="Enter your question" 
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={questionForm.control}
                            name="questionType"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Question Type</FormLabel>
                                <Select
                                  onValueChange={(value) => {
                                    field.onChange(value);
                                    setSelectedQuestionType(value);
                                  }}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select question type" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                                    <SelectItem value="true_false">True/False</SelectItem>
                                    <SelectItem value="short_answer">Short Answer</SelectItem>
                                    <SelectItem value="essay">Essay</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {selectedQuestionType === "multiple_choice" && (
                            <div className="space-y-4">
                              <div className="flex justify-between items-center">
                                <FormLabel>Answer Options</FormLabel>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={addOption}
                                >
                                  <Plus className="h-4 w-4 mr-2" />
                                  Add Option
                                </Button>
                              </div>
                              {options.map((option, index) => (
                                <div key={index} className="flex gap-2">
                                  <Input
                                    value={option}
                                    onChange={(e) => updateOption(index, e.target.value)}
                                    placeholder={`Option ${index + 1}`}
                                  />
                                  {options.length > 1 && (
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="icon"
                                      onClick={() => removeOption(index)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}

                          <FormField
                            control={questionForm.control}
                            name="correctAnswer"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Correct Answer</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormDescription>
                                  For multiple choice, enter the exact text of the correct option
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={questionForm.control}
                            name="explanation"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Explanation (Optional)</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    placeholder="Explain the correct answer" 
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <FormField
                              control={questionForm.control}
                              name="category"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Category</FormLabel>
                                  <FormControl>
                                    <Input placeholder="e.g., Programming" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={questionForm.control}
                              name="difficulty"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Difficulty</FormLabel>
                                  <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select difficulty" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="easy">Easy</SelectItem>
                                      <SelectItem value="medium">Medium</SelectItem>
                                      <SelectItem value="hard">Hard</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={questionForm.control}
                              name="points"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Points</FormLabel>
                                  <FormControl>
                                    <Input 
                                      type="number" 
                                      {...field}
                                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <div className="flex justify-end space-x-2">
                            <Button 
                              type="button" 
                              variant="outline" 
                              onClick={() => setIsQuestionDialogOpen(false)}
                            >
                              Cancel
                            </Button>
                            <Button type="submit" disabled={loading}>
                              {loading ? "Creating..." : "Create Question"}
                            </Button>
                          </div>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {questions.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No questions found. Create your first question to get started.
                    </div>
                  ) : (
                    questions.map((question) => (
                      <div
                        key={question.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex-1">
                          <h3 className="font-medium">{question.question_text}</h3>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline">{question.question_type}</Badge>
                            <Badge variant="secondary">{question.difficulty}</Badge>
                            {question.category && (
                              <Badge variant="outline">{question.category}</Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon">
                            <FileEdit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="manage">
          <Card>
            <CardHeader>
              <CardTitle>Manage Assessments</CardTitle>
              <CardDescription>
                View and edit existing assessments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assessments.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No assessments found. Create your first assessment to get started.
                  </div>
                ) : (
                  assessments.map((assessment) => (
                    <div
                      key={assessment.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-medium">{assessment.title}</h3>
                          <Badge variant={assessment.is_published ? "default" : "secondary"}>
                            {assessment.is_published ? "Published" : "Draft"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {assessment.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          {assessment.time_limit_minutes && (
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{assessment.time_limit_minutes} minutes</span>
                            </div>
                          )}
                          {assessment.passing_score && (
                            <div className="flex items-center gap-1">
                              <CheckCircle className="h-4 w-4" />
                              <span>{assessment.passing_score}% to pass</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>{assessment._count?.assessment_questions || 0} questions</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => togglePublishStatus(assessment.id, assessment.is_published)}
                        >
                          {assessment.is_published ? "Unpublish" : "Publish"}
                        </Button>
                        <Button variant="outline" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon">
                          <FileEdit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => deleteAssessment(assessment.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}