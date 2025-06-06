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
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { 
  ChevronLeft, 
  ChevronRight, 
  Save, 
  User, 
  GraduationCap, 
  Briefcase, 
  Code, 
  Heart, 
  Target, 
  Award,
  CheckCircle,
  Plus,
  Trash2
} from "lucide-react";

// Form schemas for each step
const personalInfoSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  professionalHeadline: z.string().min(5, "Professional headline is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  location: z.string().min(2, "Location is required"),
  professionalSummary: z.string().min(50, "Professional summary must be at least 50 characters"),
  linkedinUrl: z.string().url("Valid LinkedIn URL required").optional().or(z.literal("")),
  githubUrl: z.string().url("Valid GitHub URL required").optional().or(z.literal("")),
  portfolioUrl: z.string().url("Valid portfolio URL required").optional().or(z.literal("")),
});

const educationSchema = z.object({
  education: z.array(z.object({
    degree: z.string().min(2, "Degree is required"),
    institution: z.string().min(2, "Institution is required"),
    major: z.string().min(2, "Major is required"),
    minor: z.string().optional(),
    gpa: z.string().optional(),
    graduationDate: z.string().min(1, "Graduation date is required"),
    relevantCoursework: z.string().optional(),
    achievements: z.string().optional(),
  })).min(1, "At least one education entry is required"),
});

const experienceSchema = z.object({
  experience: z.array(z.object({
    company: z.string().min(2, "Company name is required"),
    title: z.string().min(2, "Job title is required"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().optional(),
    current: z.boolean().default(false),
    responsibilities: z.string().min(20, "Responsibilities must be at least 20 characters"),
    achievements: z.string().min(20, "Achievements must be at least 20 characters"),
    technologies: z.string().optional(),
  })).min(1, "At least one work experience is required"),
});

const technicalSkillsSchema = z.object({
  programmingLanguages: z.array(z.object({
    name: z.string().min(1, "Skill name is required"),
    proficiency: z.number().min(1).max(5),
  })),
  frameworks: z.array(z.object({
    name: z.string().min(1, "Framework name is required"),
    proficiency: z.number().min(1).max(5),
  })),
  tools: z.array(z.object({
    name: z.string().min(1, "Tool name is required"),
    proficiency: z.number().min(1).max(5),
  })),
  databases: z.array(z.object({
    name: z.string().min(1, "Database name is required"),
    proficiency: z.number().min(1).max(5),
  })),
  cloudPlatforms: z.array(z.object({
    name: z.string().min(1, "Platform name is required"),
    proficiency: z.number().min(1).max(5),
  })),
});

const softSkillsSchema = z.object({
  communication: z.number().min(1).max(5),
  leadership: z.number().min(1).max(5),
  teamwork: z.number().min(1).max(5),
  problemSolving: z.number().min(1).max(5),
  timeManagement: z.number().min(1).max(5),
  adaptability: z.number().min(1).max(5),
});

const selfAssessmentSchema = z.object({
  strengths: z.string().min(50, "Please describe your strengths (minimum 50 characters)"),
  areasForImprovement: z.string().min(30, "Please describe areas for improvement"),
  challengesOvercome: z.string().min(50, "Please describe challenges you've overcome"),
  workStyle: z.enum(["independent", "collaborative", "hybrid"]),
  teamRole: z.enum(["leader", "contributor", "supporter", "innovator"]),
  learningStyle: z.enum(["visual", "auditory", "kinesthetic", "reading"]),
  stressManagement: z.string().min(20, "Please describe your stress management approach"),
});

const certificationsSchema = z.object({
  certifications: z.array(z.object({
    name: z.string().min(2, "Certification name is required"),
    issuer: z.string().min(2, "Issuer is required"),
    dateObtained: z.string().min(1, "Date is required"),
    expirationDate: z.string().optional(),
    credentialId: z.string().optional(),
  })),
  achievements: z.array(z.object({
    title: z.string().min(2, "Achievement title is required"),
    description: z.string().min(10, "Description is required"),
    date: z.string().min(1, "Date is required"),
    type: z.enum(["award", "patent", "publication", "speaking", "opensource"]),
  })),
});

const goalsSchema = z.object({
  shortTermGoals: z.string().min(50, "Please describe your short-term goals"),
  longTermGoals: z.string().min(50, "Please describe your long-term goals"),
  preferredEnvironment: z.enum(["startup", "corporate", "agency", "freelance", "nonprofit"]),
  desiredResponsibilities: z.string().min(30, "Please describe desired responsibilities"),
  industryPreferences: z.array(z.string()).min(1, "Select at least one industry"),
  salaryExpectations: z.object({
    min: z.number().min(0),
    max: z.number().min(0),
    currency: z.string().default("USD"),
  }),
});

const steps = [
  { id: 1, title: "Personal Information", icon: User, schema: personalInfoSchema },
  { id: 2, title: "Education", icon: GraduationCap, schema: educationSchema },
  { id: 3, title: "Experience", icon: Briefcase, schema: experienceSchema },
  { id: 4, title: "Technical Skills", icon: Code, schema: technicalSkillsSchema },
  { id: 5, title: "Soft Skills", icon: Heart, schema: softSkillsSchema },
  { id: 6, title: "Self Assessment", icon: Target, schema: selfAssessmentSchema },
  { id: 7, title: "Certifications", icon: Award, schema: certificationsSchema },
  { id: 8, title: "Goals", icon: CheckCircle, schema: goalsSchema },
];

export default function ProfileOnboardingPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<any>({});

  // Load saved progress on mount
  useEffect(() => {
    const savedData = localStorage.getItem('profileOnboardingData');
    const savedStep = localStorage.getItem('profileOnboardingStep');
    const savedCompleted = localStorage.getItem('profileOnboardingCompleted');
    
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
    if (savedStep) {
      setCurrentStep(parseInt(savedStep));
    }
    if (savedCompleted) {
      setCompletedSteps(JSON.parse(savedCompleted));
    }
  }, []);

  const currentStepData = steps[currentStep - 1];
  const progress = (completedSteps.length / steps.length) * 100;

  const form = useForm({
    resolver: zodResolver(currentStepData.schema),
    defaultValues: formData[currentStep] || getDefaultValues(currentStep),
  });

  function getDefaultValues(step: number) {
    switch (step) {
      case 1:
        return {
          fullName: "",
          professionalHeadline: "",
          email: "",
          phone: "",
          location: "",
          professionalSummary: "",
          linkedinUrl: "",
          githubUrl: "",
          portfolioUrl: "",
        };
      case 2:
        return {
          education: [{
            degree: "",
            institution: "",
            major: "",
            minor: "",
            gpa: "",
            graduationDate: "",
            relevantCoursework: "",
            achievements: "",
          }],
        };
      case 3:
        return {
          experience: [{
            company: "",
            title: "",
            startDate: "",
            endDate: "",
            current: false,
            responsibilities: "",
            achievements: "",
            technologies: "",
          }],
        };
      case 4:
        return {
          programmingLanguages: [],
          frameworks: [],
          tools: [],
          databases: [],
          cloudPlatforms: [],
        };
      case 5:
        return {
          communication: 3,
          leadership: 3,
          teamwork: 3,
          problemSolving: 3,
          timeManagement: 3,
          adaptability: 3,
        };
      case 6:
        return {
          strengths: "",
          areasForImprovement: "",
          challengesOvercome: "",
          workStyle: "hybrid",
          teamRole: "contributor",
          learningStyle: "visual",
          stressManagement: "",
        };
      case 7:
        return {
          certifications: [],
          achievements: [],
        };
      case 8:
        return {
          shortTermGoals: "",
          longTermGoals: "",
          preferredEnvironment: "corporate",
          desiredResponsibilities: "",
          industryPreferences: [],
          salaryExpectations: {
            min: 0,
            max: 0,
            currency: "USD",
          },
        };
      default:
        return {};
    }
  }

  const saveProgress = (data: any) => {
    const updatedFormData = { ...formData, [currentStep]: data };
    setFormData(updatedFormData);
    localStorage.setItem('profileOnboardingData', JSON.stringify(updatedFormData));
    localStorage.setItem('profileOnboardingStep', currentStep.toString());
    localStorage.setItem('profileOnboardingCompleted', JSON.stringify(completedSteps));
  };

  const onSubmit = async (data: any) => {
    try {
      saveProgress(data);
      
      if (!completedSteps.includes(currentStep)) {
        const newCompleted = [...completedSteps, currentStep];
        setCompletedSteps(newCompleted);
        localStorage.setItem('profileOnboardingCompleted', JSON.stringify(newCompleted));
      }

      if (currentStep < steps.length) {
        setCurrentStep(currentStep + 1);
        form.reset(getDefaultValues(currentStep + 1));
      } else {
        // Final submission
        setIsLoading(true);
        await submitCompleteProfile();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save progress. Please try again.",
        variant: "destructive",
      });
    }
  };

  const submitCompleteProfile = async () => {
    try {
      const response = await fetch('/api/profile/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to submit profile');

      // Clear saved data
      localStorage.removeItem('profileOnboardingData');
      localStorage.removeItem('profileOnboardingStep');
      localStorage.removeItem('profileOnboardingCompleted');

      toast({
        title: "Profile Complete!",
        description: "Your professional profile has been successfully created.",
      });

      router.push('/dashboard');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to complete profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      form.reset(formData[currentStep - 1] || getDefaultValues(currentStep - 1));
    }
  };

  const saveAndContinueLater = () => {
    const currentData = form.getValues();
    saveProgress(currentData);
    toast({
      title: "Progress Saved",
      description: "Your progress has been saved. You can continue later.",
    });
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Complete Your Professional Profile
          </h1>
          <p className="text-gray-600">
            Help us understand your background to provide personalized career guidance
          </p>
        </div>

        {/* Progress Bar */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-gray-700">
                Step {currentStep} of {steps.length}
              </span>
              <span className="text-sm font-medium text-gray-700">
                {Math.round(progress)}% Complete
              </span>
            </div>
            <Progress value={progress} className="h-2 mb-4" />
            
            {/* Step indicators */}
            <div className="flex justify-between">
              {steps.map((step) => {
                const Icon = step.icon;
                const isCompleted = completedSteps.includes(step.id);
                const isCurrent = currentStep === step.id;
                
                return (
                  <div
                    key={step.id}
                    className={`flex flex-col items-center ${
                      isCurrent ? 'text-blue-600' : 
                      isCompleted ? 'text-green-600' : 'text-gray-400'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                      isCurrent ? 'bg-blue-100 border-2 border-blue-600' :
                      isCompleted ? 'bg-green-100 border-2 border-green-600' :
                      'bg-gray-100 border-2 border-gray-300'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <Icon className="w-4 h-4" />
                      )}
                    </div>
                    <span className="text-xs text-center hidden sm:block">
                      {step.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Form Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <currentStepData.icon className="w-5 h-5" />
              {currentStepData.title}
            </CardTitle>
            <CardDescription>
              {getStepDescription(currentStep)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {renderStepContent(currentStep, form)}
                
                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6 border-t">
                  <div className="flex gap-2">
                    {currentStep > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={goToPreviousStep}
                      >
                        <ChevronLeft className="w-4 h-4 mr-2" />
                        Previous
                      </Button>
                    )}
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={saveAndContinueLater}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save & Continue Later
                    </Button>
                  </div>
                  
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="min-w-[120px]"
                  >
                    {isLoading ? (
                      "Submitting..."
                    ) : currentStep === steps.length ? (
                      "Complete Profile"
                    ) : (
                      <>
                        Next
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function getStepDescription(step: number): string {
  switch (step) {
    case 1:
      return "Let's start with your basic information and professional summary.";
    case 2:
      return "Tell us about your educational background and academic achievements.";
    case 3:
      return "Share your work experience and professional accomplishments.";
    case 4:
      return "List your technical skills and proficiency levels.";
    case 5:
      return "Rate your soft skills and interpersonal abilities.";
    case 6:
      return "Help us understand your work style and professional approach.";
    case 7:
      return "Add your certifications, awards, and notable achievements.";
    case 8:
      return "Finally, share your career goals and preferences.";
    default:
      return "";
  }
}

function renderStepContent(step: number, form: any) {
  switch (step) {
    case 1:
      return <PersonalInfoStep form={form} />;
    case 2:
      return <EducationStep form={form} />;
    case 3:
      return <ExperienceStep form={form} />;
    case 4:
      return <TechnicalSkillsStep form={form} />;
    case 5:
      return <SoftSkillsStep form={form} />;
    case 6:
      return <SelfAssessmentStep form={form} />;
    case 7:
      return <CertificationsStep form={form} />;
    case 8:
      return <GoalsStep form={form} />;
    default:
      return null;
  }
}

// Step Components
function PersonalInfoStep({ form }: { form: any }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        control={form.control}
        name="fullName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Full Name *</FormLabel>
            <FormControl>
              <Input placeholder="John Doe" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="professionalHeadline"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Professional Headline *</FormLabel>
            <FormControl>
              <Input placeholder="Senior Software Engineer" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email *</FormLabel>
            <FormControl>
              <Input type="email" placeholder="john@example.com" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Phone Number *</FormLabel>
            <FormControl>
              <Input placeholder="+1 (555) 123-4567" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Location *</FormLabel>
            <FormControl>
              <Input placeholder="San Francisco, CA" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="linkedinUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel>LinkedIn Profile</FormLabel>
            <FormControl>
              <Input placeholder="https://linkedin.com/in/johndoe" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="githubUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel>GitHub Profile</FormLabel>
            <FormControl>
              <Input placeholder="https://github.com/johndoe" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="portfolioUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Portfolio URL</FormLabel>
            <FormControl>
              <Input placeholder="https://johndoe.dev" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="professionalSummary"
        render={({ field }) => (
          <FormItem className="md:col-span-2">
            <FormLabel>Professional Summary *</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Write a compelling summary of your professional background, key skills, and career objectives..."
                className="min-h-[120px]"
                {...field} 
              />
            </FormControl>
            <FormDescription>
              Minimum 50 characters. This will be used in your professional documents.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

function EducationStep({ form }: { form: any }) {
  const { fields, append, remove } = form.useFieldArray({
    control: form.control,
    name: "education",
  });

  return (
    <div className="space-y-6">
      {fields.map((field: any, index: number) => (
        <Card key={field.id} className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Education {index + 1}</h3>
            {fields.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => remove(index)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name={`education.${index}.degree`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Degree *</FormLabel>
                  <FormControl>
                    <Input placeholder="Bachelor of Science" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name={`education.${index}.institution`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Institution *</FormLabel>
                  <FormControl>
                    <Input placeholder="University of California" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name={`education.${index}.major`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Major *</FormLabel>
                  <FormControl>
                    <Input placeholder="Computer Science" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name={`education.${index}.minor`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Minor</FormLabel>
                  <FormControl>
                    <Input placeholder="Mathematics" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name={`education.${index}.gpa`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GPA</FormLabel>
                  <FormControl>
                    <Input placeholder="3.8/4.0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name={`education.${index}.graduationDate`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Graduation Date *</FormLabel>
                  <FormControl>
                    <Input type="month" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name={`education.${index}.relevantCoursework`}
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Relevant Coursework</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Data Structures, Algorithms, Database Systems..."
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name={`education.${index}.achievements`}
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Academic Achievements</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Dean's List, Magna Cum Laude, Research publications..."
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </Card>
      ))}
      
      <Button
        type="button"
        variant="outline"
        onClick={() => append({
          degree: "",
          institution: "",
          major: "",
          minor: "",
          gpa: "",
          graduationDate: "",
          relevantCoursework: "",
          achievements: "",
        })}
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Another Education
      </Button>
    </div>
  );
}

function ExperienceStep({ form }: { form: any }) {
  const { fields, append, remove } = form.useFieldArray({
    control: form.control,
    name: "experience",
  });

  return (
    <div className="space-y-6">
      {fields.map((field: any, index: number) => (
        <Card key={field.id} className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Experience {index + 1}</h3>
            {fields.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => remove(index)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name={`experience.${index}.company`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company *</FormLabel>
                  <FormControl>
                    <Input placeholder="Tech Corp Inc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name={`experience.${index}.title`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Title *</FormLabel>
                  <FormControl>
                    <Input placeholder="Senior Software Engineer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name={`experience.${index}.startDate`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date *</FormLabel>
                  <FormControl>
                    <Input type="month" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name={`experience.${index}.endDate`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Date</FormLabel>
                  <FormControl>
                    <Input 
                      type="month" 
                      {...field} 
                      disabled={form.watch(`experience.${index}.current`)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name={`experience.${index}.current`}
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 md:col-span-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>I currently work here</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name={`experience.${index}.responsibilities`}
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Key Responsibilities *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your main responsibilities and duties..."
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name={`experience.${index}.achievements`}
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Notable Achievements *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your key accomplishments and impact..."
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name={`experience.${index}.technologies`}
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Technologies Used</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="React, Node.js, PostgreSQL, AWS..."
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </Card>
      ))}
      
      <Button
        type="button"
        variant="outline"
        onClick={() => append({
          company: "",
          title: "",
          startDate: "",
          endDate: "",
          current: false,
          responsibilities: "",
          achievements: "",
          technologies: "",
        })}
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Another Experience
      </Button>
    </div>
  );
}

function TechnicalSkillsStep({ form }: { form: any }) {
  const skillCategories = [
    { name: "programmingLanguages", label: "Programming Languages", placeholder: "JavaScript, Python, Java..." },
    { name: "frameworks", label: "Frameworks & Libraries", placeholder: "React, Angular, Django..." },
    { name: "tools", label: "Development Tools", placeholder: "Git, Docker, VS Code..." },
    { name: "databases", label: "Databases", placeholder: "PostgreSQL, MongoDB, Redis..." },
    { name: "cloudPlatforms", label: "Cloud Platforms", placeholder: "AWS, Azure, GCP..." },
  ];

  return (
    <div className="space-y-8">
      {skillCategories.map((category) => (
        <SkillCategorySection
          key={category.name}
          form={form}
          categoryName={category.name}
          label={category.label}
          placeholder={category.placeholder}
        />
      ))}
    </div>
  );
}

function SkillCategorySection({ form, categoryName, label, placeholder }: any) {
  const { fields, append, remove } = form.useFieldArray({
    control: form.control,
    name: categoryName,
  });

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">{label}</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ name: "", proficiency: 3 })}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Skill
        </Button>
      </div>
      
      <div className="space-y-4">
        {fields.map((field: any, index: number) => (
          <div key={field.id} className="flex items-center gap-4">
            <FormField
              control={form.control}
              name={`${categoryName}.${index}.name`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input placeholder={placeholder} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name={`${categoryName}.${index}.proficiency`}
              render={({ field }) => (
                <FormItem className="w-32">
                  <FormControl>
                    <div className="space-y-2">
                      <Slider
                        min={1}
                        max={5}
                        step={1}
                        value={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                      />
                      <div className="text-center text-sm text-gray-600">
                        Level {field.value}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => remove(index)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
        
        {fields.length === 0 && (
          <p className="text-gray-500 text-center py-4">
            No skills added yet. Click "Add Skill" to get started.
          </p>
        )}
      </div>
    </Card>
  );
}

function SoftSkillsStep({ form }: { form: any }) {
  const softSkills = [
    { name: "communication", label: "Communication" },
    { name: "leadership", label: "Leadership" },
    { name: "teamwork", label: "Teamwork" },
    { name: "problemSolving", label: "Problem Solving" },
    { name: "timeManagement", label: "Time Management" },
    { name: "adaptability", label: "Adaptability" },
  ];

  return (
    <div className="space-y-6">
      <p className="text-gray-600">
        Rate your proficiency in these soft skills on a scale of 1-5, where 1 is beginner and 5 is expert.
      </p>
      
      {softSkills.map((skill) => (
        <FormField
          key={skill.name}
          control={form.control}
          name={skill.name}
          render={({ field }) => (
            <FormItem>
              <div className="flex justify-between items-center mb-2">
                <FormLabel className="text-base">{skill.label}</FormLabel>
                <Badge variant="outline">Level {field.value}</Badge>
              </div>
              <FormControl>
                <Slider
                  min={1}
                  max={5}
                  step={1}
                  value={[field.value]}
                  onValueChange={(value) => field.onChange(value[0])}
                  className="w-full"
                />
              </FormControl>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Beginner</span>
                <span>Expert</span>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      ))}
    </div>
  );
}

function SelfAssessmentStep({ form }: { form: any }) {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="strengths"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Career Strengths *</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Describe your key professional strengths and what sets you apart..."
                className="min-h-[100px]"
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="areasForImprovement"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Areas for Improvement *</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="What skills or areas would you like to develop further?"
                className="min-h-[100px]"
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="challengesOvercome"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Professional Challenges Overcome *</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Describe significant challenges you've faced and how you overcame them..."
                className="min-h-[100px]"
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="workStyle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Work Style Preference</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select work style" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="independent">Independent</SelectItem>
                  <SelectItem value="collaborative">Collaborative</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="teamRole"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preferred Team Role</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select team role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="leader">Leader</SelectItem>
                  <SelectItem value="contributor">Contributor</SelectItem>
                  <SelectItem value="supporter">Supporter</SelectItem>
                  <SelectItem value="innovator">Innovator</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="learningStyle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Learning Style</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select learning style" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="visual">Visual</SelectItem>
                  <SelectItem value="auditory">Auditory</SelectItem>
                  <SelectItem value="kinesthetic">Kinesthetic</SelectItem>
                  <SelectItem value="reading">Reading/Writing</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <FormField
        control={form.control}
        name="stressManagement"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Stress Management Approach *</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="How do you handle stress and pressure in professional situations?"
                className="min-h-[80px]"
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

function CertificationsStep({ form }: { form: any }) {
  const { fields: certFields, append: appendCert, remove: removeCert } = form.useFieldArray({
    control: form.control,
    name: "certifications",
  });
  
  const { fields: achievementFields, append: appendAchievement, remove: removeAchievement } = form.useFieldArray({
    control: form.control,
    name: "achievements",
  });

  return (
    <div className="space-y-8">
      {/* Certifications Section */}
      <Card className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Professional Certifications</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => appendCert({
              name: "",
              issuer: "",
              dateObtained: "",
              expirationDate: "",
              credentialId: "",
            })}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Certification
          </Button>
        </div>
        
        <div className="space-y-4">
          {certFields.map((field: any, index: number) => (
            <div key={field.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium">Certification {index + 1}</h4>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeCert(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name={`certifications.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Certification Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="AWS Certified Solutions Architect" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name={`certifications.${index}.issuer`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Issuing Organization *</FormLabel>
                      <FormControl>
                        <Input placeholder="Amazon Web Services" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name={`certifications.${index}.dateObtained`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date Obtained *</FormLabel>
                      <FormControl>
                        <Input type="month" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name={`certifications.${index}.expirationDate`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expiration Date</FormLabel>
                      <FormControl>
                        <Input type="month" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name={`certifications.${index}.credentialId`}
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Credential ID</FormLabel>
                      <FormControl>
                        <Input placeholder="ABC123DEF456" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          ))}
          
          {certFields.length === 0 && (
            <p className="text-gray-500 text-center py-4">
              No certifications added yet. Click "Add Certification" to get started.
            </p>
          )}
        </div>
      </Card>

      {/* Achievements Section */}
      <Card className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Achievements & Recognition</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => appendAchievement({
              title: "",
              description: "",
              date: "",
              type: "award",
            })}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Achievement
          </Button>
        </div>
        
        <div className="space-y-4">
          {achievementFields.map((field: any, index: number) => (
            <div key={field.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium">Achievement {index + 1}</h4>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeAchievement(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name={`achievements.${index}.title`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Achievement Title *</FormLabel>
                      <FormControl>
                        <Input placeholder="Employee of the Year" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name={`achievements.${index}.type`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="award">Award</SelectItem>
                          <SelectItem value="patent">Patent</SelectItem>
                          <SelectItem value="publication">Publication</SelectItem>
                          <SelectItem value="speaking">Speaking Engagement</SelectItem>
                          <SelectItem value="opensource">Open Source Contribution</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name={`achievements.${index}.date`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date *</FormLabel>
                      <FormControl>
                        <Input type="month" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name={`achievements.${index}.description`}
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Description *</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe the achievement and its significance..."
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          ))}
          
          {achievementFields.length === 0 && (
            <p className="text-gray-500 text-center py-4">
              No achievements added yet. Click "Add Achievement" to get started.
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}

function GoalsStep({ form }: { form: any }) {
  const industries = [
    "Technology", "Healthcare", "Finance", "Education", "Manufacturing",
    "Retail", "Consulting", "Media", "Government", "Non-profit"
  ];

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="shortTermGoals"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Short-term Goals (1-2 years) *</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Describe your professional goals for the next 1-2 years..."
                className="min-h-[100px]"
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="longTermGoals"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Long-term Goals (3-5 years) *</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Describe your long-term career aspirations..."
                className="min-h-[100px]"
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="preferredEnvironment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preferred Work Environment</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select environment" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="startup">Startup</SelectItem>
                  <SelectItem value="corporate">Corporate</SelectItem>
                  <SelectItem value="agency">Agency</SelectItem>
                  <SelectItem value="freelance">Freelance</SelectItem>
                  <SelectItem value="nonprofit">Non-profit</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <FormField
        control={form.control}
        name="desiredResponsibilities"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Desired Role Responsibilities *</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="What type of work and responsibilities would you like in your ideal role?"
                className="min-h-[100px]"
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="industryPreferences"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Industry Preferences *</FormLabel>
            <FormDescription>
              Select all industries you're interested in working in.
            </FormDescription>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
              {industries.map((industry) => (
                <div key={industry} className="flex items-center space-x-2">
                  <Checkbox
                    id={industry}
                    checked={field.value?.includes(industry)}
                    onCheckedChange={(checked) => {
                      const updatedValue = checked
                        ? [...(field.value || []), industry]
                        : (field.value || []).filter((value: string) => value !== industry);
                      field.onChange(updatedValue);
                    }}
                  />
                  <label
                    htmlFor={industry}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {industry}
                  </label>
                </div>
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <Card className="p-4">
        <h3 className="text-lg font-medium mb-4">Salary Expectations</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="salaryExpectations.min"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Minimum Salary</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="50000"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="salaryExpectations.max"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Maximum Salary</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="80000"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="salaryExpectations.currency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Currency</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                    <SelectItem value="CAD">CAD</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </Card>
    </div>
  );
}