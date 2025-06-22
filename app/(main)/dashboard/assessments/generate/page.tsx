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
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Sparkles, 
  Brain, 
  Clock, 
  Target, 
  Users, 
  CheckCircle,
  Loader2,
  ArrowLeft,
  Zap,
  BookOpen,
  Award
} from "lucide-react";

const generateFormSchema = z.object({
  topic: z.string().min(1, "Please select a topic"),
  difficulty: z.enum(["easy", "medium", "hard"]),
  questionCount: z.number().min(5).max(50),
  timeLimit: z.number().min(10).max(300),
  passingScore: z.number().min(50).max(100),
  randomizeQuestions: z.boolean().default(true),
  isPublished: z.boolean().default(false),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

interface Topic {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: string;
  estimatedTime: string;
  skillAreas: string[];
}

interface TopicsData {
  topics: Topic[];
  categories: Record<string, Topic[]>;
  totalTopics: number;
}

export default function GenerateAssessmentPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [topicsData, setTopicsData] = useState<TopicsData | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [showGenerationDialog, setShowGenerationDialog] = useState(false);

  const form = useForm<z.infer<typeof generateFormSchema>>({
    resolver: zodResolver(generateFormSchema),
    defaultValues: {
      topic: "",
      difficulty: "medium",
      questionCount: 15,
      timeLimit: 60,
      passingScore: 70,
      randomizeQuestions: true,
      isPublished: false,
      startDate: "",
      endDate: "",
    },
  });

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await fetch("/api/assessments/topics");
        if (response.ok) {
          const data = await response.json();
          setTopicsData(data);
        }
      } catch (error) {
        console.error("Error fetching topics:", error);
        toast({
          title: "Error",
          description: "Failed to load topics",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchTopics();
  }, [toast]);

 

  const onSubmit = async (values: z.infer<typeof generateFormSchema>) => {
    setGenerating(true);
    setGenerationProgress(0);
    setShowGenerationDialog(true);

    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 300);

    try {
      const response = await fetch("/api/assessments/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      clearInterval(progressInterval);
      setGenerationProgress(100);

      if (response.ok) {
        const data = await response.json();
        
        // Wait a moment to show 100% completion
        setTimeout(() => {
          toast({
            title: "Assessment Generated!",
            description: `Successfully created "${data.assessment.title}" with ${data.assessment.questions?.length || values.questionCount} questions.`,
          });
          
          setShowGenerationDialog(false);
          router.push(`/assessments/manage`);
        }, 1000);
      } else {
        const error = await response.json();
        throw new Error(error.error || "Failed to generate assessment");
      }
    } catch (error) {
      clearInterval(progressInterval);
      setShowGenerationDialog(false);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate assessment",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
      setGenerationProgress(0);
    }
  };

  const handleTopicSelect = (topicId: string) => {
    const topic = topicsData?.topics.find(t => t.id === topicId);
    setSelectedTopic(topic || null);
    form.setValue("topic", topicId);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEstimatedQuestions = (difficulty: string, count: number) => {
    const multiplier = { easy: 0.8, medium: 1, hard: 1.2 };
    return Math.round(count * multiplier[difficulty as keyof typeof multiplier]);
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

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => router.push("/assessments/manage")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Assessments
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Brain className="h-8 w-8 text-purple-600" />
            AI Assessment Generator
          </h1>
          <p className="text-muted-foreground">
            Create comprehensive, verifiable assessments with AI-powered question generation
          </p>
        </div>
      </div>

      {/* Feature Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-purple-200 bg-purple-50/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              <span className="font-medium">AI-Powered</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Intelligent question generation based on topic and difficulty
            </p>
          </CardContent>
        </Card>
        <Card className="border-blue-200 bg-blue-50/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              <span className="font-medium">Verifiable</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Questions with detailed explanations and correct answers
            </p>
          </CardContent>
        </Card>
        <Card className="border-green-200 bg-green-50/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-green-600" />
              <span className="font-medium">Adaptive</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Customizable difficulty and question types
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Topic Selection */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Select Assessment Topic
              </CardTitle>
              <CardDescription>
                Choose from our curated list of technical topics
              </CardDescription>
            </CardHeader>
            <CardContent>
              {topicsData && (
                <div className="space-y-6">
                  {Object.entries(topicsData.categories).map(([category, topics]) => (
                    <div key={category}>
                      <h3 className="font-medium text-lg mb-3 text-muted-foreground">
                        {category}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {topics.map((topic) => (
                          <Card
                            key={topic.id}
                            className={`cursor-pointer transition-all hover:shadow-md ${
                              form.watch("topic") === topic.id
                                ? "ring-2 ring-primary bg-primary/5"
                                : "hover:bg-muted/50"
                            }`}
                            onClick={() => handleTopicSelect(topic.id)}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-start gap-3">
                                <span className="text-2xl">{topic.icon}</span>
                                <div className="flex-1">
                                  <h4 className="font-medium">{topic.name}</h4>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {topic.description}
                                  </p>
                                  <div className="flex items-center gap-2 mt-2">
                                    <Clock className="h-3 w-3 text-muted-foreground" />
                                    <span className="text-xs text-muted-foreground">
                                      {topic.estimatedTime}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Configuration Panel */}
        <div className="space-y-6">
          {selectedTopic && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-xl">{selectedTopic.icon}</span>
                  {selectedTopic.name}
                </CardTitle>
                <CardDescription>{selectedTopic.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-sm mb-2">Skill Areas Covered:</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedTopic.skillAreas.map((area, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Estimated time: {selectedTopic.estimatedTime}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Assessment Configuration
              </CardTitle>
              <CardDescription>
                Customize your assessment parameters
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="difficulty"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Difficulty Level</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select difficulty" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="easy">
                              <div className="flex items-center gap-2">
                                <Badge className="bg-green-100 text-green-800">Easy</Badge>
                                <span>Beginner level</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="medium">
                              <div className="flex items-center gap-2">
                                <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>
                                <span>Intermediate level</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="hard">
                              <div className="flex items-center gap-2">
                                <Badge className="bg-red-100 text-red-800">Hard</Badge>
                                <span>Advanced level</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="questionCount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Questions</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={5}
                            max={50}
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormDescription>
                          Recommended: 10-20 questions for most topics
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="timeLimit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Time Limit (minutes)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={10}
                            max={300}
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormDescription>
                          Recommended: 2-4 minutes per question
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="passingScore"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Passing Score (%)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={50}
                            max={100}
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="randomizeQuestions"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Randomize Questions</FormLabel>
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
                    control={form.control}
                    name="isPublished"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Publish Immediately</FormLabel>
                          <FormDescription>
                            Make assessment available to users
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

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    disabled={generating || !form.watch("topic")}
                  >
                    {generating ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Generate Assessment
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Generation Progress Dialog */}
      <Dialog open={showGenerationDialog} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-600 animate-pulse" />
              Generating Assessment
            </DialogTitle>
            <DialogDescription>
              Our AI is creating personalized questions for your assessment...
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{generationProgress}%</span>
              </div>
              <Progress value={generationProgress} className="h-2" />
            </div>
            
            <div className="space-y-2 text-sm text-muted-foreground">
              {generationProgress < 30 && (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analyzing topic requirements...
                </div>
              )}
              {generationProgress >= 30 && generationProgress < 60 && (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating questions...
                </div>
              )}
              {generationProgress >= 60 && generationProgress < 90 && (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating answer explanations...
                </div>
              )}
              {generationProgress >= 90 && (
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Finalizing assessment...
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}