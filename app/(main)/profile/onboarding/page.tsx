"use client";

import { useContext, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  User, 
  Briefcase, 
  MapPin, 
  Award, 
  CheckCircle
} from "lucide-react";
import { UserContext } from "@/contexts/User";
const axios = require('axios');
// Define the form schemas using Zod

const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  currentPosition: z.string().min(2, {
    message: "Current position must be at least 2 characters.",
  }),
  location: z.string().min(2, {
    message: "Location must be at least 2 characters.",
  }),
  bio: z.string().max(500, {
    message: "Bio must not exceed 500 characters.",
  }),
  careerGoals: z.string().max(1000, {
    message: "Career goals must not exceed 1000 characters.",
  }),
});

const experienceFormSchema = z.object({
  id: z.string(),
  userId: z.string(),
  title: z.string().min(2, {
    message: "Job title must be at least 2 characters.",
  }),
  company: z.string().min(2, {
    message: "Company name must be at least 2 characters.",
  }),
  startDate: z.string(),
  endDate: z.string().optional(),
  current: z.boolean().optional(),
  description: z.string().max(500, {
    message: "Description must not exceed 500 characters.",
  }),
  achievements: z.string().max(500, {
    message: "Achievements must not exceed 500 characters.",
  }),
});

 const skillFormSchema = z.object({
  name: z.string().min(2, {
    message: "Skill name must be at least 2 characters.",
  }),
  category: z.string().min(2, {
    message: "Category must be at least 2 characters.",
  }),
  level: z.number().min(1).max(5),
});

export default function ProfilePage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useContext(UserContext);
  if (!user) {
    return <div className="text-center text-muted-foreground">Loading...</div>;
  }
  // Mock user data
  // const user = {
  //   name: "Alex Johnson",
  //   email: "alex.johnson@example.com",
  //   currentPosition: "Senior Software Engineer",
  //   location: "San Francisco, CA",
  //   bio: "Experienced software engineer with a passion for building scalable web applications. Specialized in React, TypeScript, and Node.js.",
  //   careerGoals: "Looking to transition into a technical leadership role where I can mentor junior developers while continuing to build innovative solutions.",
  //   image: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=600",
  // };

  // Mock experiences
  // const experiences = [
  //   {
  //     id: 1,
  //     title: "Senior Software Engineer",
  //     company: "TechCorp Inc.",
  //     startDate: "2021-06",
  //     current: true,
  //     description: "Lead developer for the company's main product, responsible for architecture decisions and implementation of new features.",
  //     achievements: "Improved application performance by 40% through code optimization and introduced CI/CD pipelines."
  //   },
  //   {
  //     id: 2,
  //     title: "Software Engineer",
  //     company: "WebSolutions LLC",
  //     startDate: "2018-03",
  //     endDate: "2021-05",
  //     current: false,
  //     description: "Developed and maintained client-facing web applications using React and Node.js.",
  //     achievements: "Successfully delivered 12 projects on time and under budget."
  //   },
  // ];

  // Mock skills
  // const skills = [
  //   { id: 1, name: "JavaScript", category: "Programming", level: 5 },
  //   { id: 2, name: "React", category: "Frontend", level: 5 },
  //   { id: 3, name: "Node.js", category: "Backend", level: 4 },
  //   { id: 4, name: "TypeScript", category: "Programming", level: 4 },
  //   { id: 5, name: "GraphQL", category: "API", level: 3 },
  //   { id: 6, name: "AWS", category: "Cloud", level: 3 },
  //   { id: 7, name: "Docker", category: "DevOps", level: 3 },
  //   { id: 8, name: "PostgreSQL", category: "Database", level: 4 },
  // ];

  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user?.name,
      email: user?.email,
      currentPosition: user?.currentPosition,
      location: user?.location,
      bio: user?.bio,
      careerGoals: user?.careerGoals,
    },
  });

  const experienceForm = useForm<z.infer<typeof experienceFormSchema>>({
    resolver: zodResolver(experienceFormSchema),
    defaultValues: {
      id: "",
      userId: "",
      title: "",
      company: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
      achievements: "",
    },
  });

   const skillForm = useForm<z.infer<typeof skillFormSchema>>({
    resolver: zodResolver(skillFormSchema),
    defaultValues: {
      name: "",
      category: "",
      level: 3,
    },
  });

  async function  onProfileSubmit(values: z.infer<typeof profileFormSchema>) {
    console.log("Profile form values", values);
    console.log("User context", user);
    setIsLoading(true);
    
    try {
      const response = await axios.post('/api/user', {
        name: values.name,
        email: values.email,
        currentPosition: values.currentPosition,
        location: values.location,
        bio: values.bio,
        careerGoals: values.careerGoals,
      });

      console.log("Profile updated successfully:", response.data);

      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function onExperienceSubmit(values: z.infer<typeof experienceFormSchema>) {
    setIsLoading(true);
    try {
      // In a real app, you would submit to an API here
      console.log(values);
      const response = await axios.post('/api/user/experience', {
        userId: user?.id,
        role: values.title,
        company: values.company,
        startDate: values.startDate,
        endDate: values.endDate,
        //current: values.current,
        description: values.description,
        achievements: values.achievements,
      });
      console.log("Experience added successfully:", response.data);
      toast({
        title: "Experience added",
        description: "Your experience has been added to your profile.",
      });
      
      experienceForm.reset({
        title: "",
        company: "",
        startDate: "",
        endDate: "",
        current: false,
        description: "",
        achievements: "",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function onSkillSubmit(values: z.infer<typeof skillFormSchema>) {
    setIsLoading(true);
    try {
      // In a real app, you would submit to an API here
      console.log(values);
      const response = await axios.post('/api/user/skills', {
        userId: user?.id,
        name: values.name,
        category: values.category,
        level: values.level,
      });
      console.log("Skill added successfully:", response.data);
      toast({
        title: "Skill added",
        description: "Your skill has been added to your profile.",
      });
      
      skillForm.reset({
        name: "",
        category: "",
        level: 3,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">
          Manage your personal information and career details
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile sidebar */}
        <Card className="lg:col-span-1">
          <CardContent className="p-6">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-32 w-32">
                <AvatarImage src={user?.image} alt={user?.name} />
                <AvatarFallback>{user?.name}</AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h2 className="text-2xl font-bold">{user?.name}</h2>
                <p className="text-muted-foreground">{user?.currentPosition}</p>
              </div>
              <div className="w-full space-y-3 pt-4">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">{user?.location}</span>
                </div>
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">{user?.email}</span>
                </div>
                <div className="flex items-center">
                  <Briefcase className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">{user?.yearsOfExperience} work experiences</span>
                </div>
                <div className="flex items-center">
                  <Award className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">{user?.skills?.length} skills</span>
                </div>
              </div>
              <Button className="w-full mt-4">
                Update Profile Picture
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="info" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="info">Basic Info</TabsTrigger>
              <TabsTrigger value="experience">Experience</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
            </TabsList>

            {/* Basic Info Tab */}
            <TabsContent value="info">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>
                    Update your personal and professional details
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...profileForm}>
                    <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={profileForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input placeholder="John Doe" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={profileForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input placeholder="john@example.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={profileForm.control}
                          name="currentPosition"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Current Position</FormLabel>
                              <FormControl>
                                <Input placeholder="Software Engineer" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={profileForm.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Location</FormLabel>
                              <FormControl>
                                <Input placeholder="San Francisco, CA" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={profileForm.control}
                        name="bio"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bio</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Tell us about yourself..." 
                                {...field} 
                                className="min-h-[100px]"
                              />
                            </FormControl>
                            <FormDescription>
                              A brief description of your professional background.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={profileForm.control}
                        name="careerGoals"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Career Goals</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="What are your professional aspirations?" 
                                {...field} 
                                className="min-h-[100px]"
                              />
                            </FormControl>
                            <FormDescription>
                              Outline your short and long-term career objectives.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Saving..." : "Save Changes"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Experience Tab */}
            <TabsContent value="experience" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Work Experience</CardTitle>
                  <CardDescription>
                    Add or edit your professional experience
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {!user?.experiences || user?.experiences.length === 0 ? (
                    <div className="text-center text-muted-foreground">
                      <p>No work experience added yet.</p>
                      <p className="mt-2">Start by adding your first experience!</p>
                      </div>) : (
                            user?.experiences.map((exp) => (
                    <div key={exp.id} className="p-4 border rounded-lg space-y-3">

                  
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-lg">{exp.title}</h3>
                          <p className="text-muted-foreground">{exp.company}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">
                            {new Date(exp.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })} - 
                            {exp.endDate === null ? " Present" : 
                              ` ${new Date(exp.endDate as string).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}`}
                          </p>
                          {exp.endDate === null && (
                            <Badge>Current</Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-sm">{exp.description}</p>
                      <div>
                        <h4 className="text-sm font-medium mb-1">Key Achievements</h4>
                        <p className="text-sm text-muted-foreground">{exp.achievements}</p>
                      </div>
                      <div className="flex justify-end space-x-2 pt-2">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="destructive" size="sm">Delete</Button>
                      </div>
                    </div>
                  )))
                }
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Add New Experience</CardTitle>
                  <CardDescription>
                    Add details about your work history
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...experienceForm}>
                    <form onSubmit={experienceForm.handleSubmit(onExperienceSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={experienceForm.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Job Title</FormLabel>
                              <FormControl>
                                <Input placeholder="Software Engineer" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={experienceForm.control}
                          name="company"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Company</FormLabel>
                              <FormControl>
                                <Input placeholder="Acme Inc." {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={experienceForm.control}
                          name="startDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Start Date</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={experienceForm.control}
                          name="endDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>End Date</FormLabel>
                              <FormControl>
                                <Input 
                                  type="date" 
                                  {...field} 
                                  disabled={experienceForm.watch("current")}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={experienceForm.control}
                        name="current"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <input
                                type="checkbox"
                                checked={field.value}
                                onChange={(e) => field.onChange(e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>
                                I am currently working in this role
                              </FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={experienceForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Describe your role and responsibilities..." 
                                {...field} 
                                className="min-h-[100px]"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={experienceForm.control}
                        name="achievements"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Key Achievements</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="List your major accomplishments in this role..." 
                                {...field} 
                                className="min-h-[100px]"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Adding..." : "Add Experience"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Skills Tab */}
            <TabsContent value="skills" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Skills</CardTitle>
                  <CardDescription>
                    Manage your professional skills and expertise
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {user?.skills?.map((skill) => (
                      <div key={skill.id} className="flex justify-between items-center p-3 border rounded-lg">
                        <div>
                          <h3 className="font-medium">{skill.name}</h3>
                          <p className="text-xs text-muted-foreground">{skill.category}</p>
                        </div>
                        <div className="flex items-center">
                          <div className="flex space-x-1 mr-3">
                            {[...Array(5)].map((_, i) => (
                              <div 
                                key={i} 
                                className={`w-2 h-2 rounded-full ${i < skill.level ? 'bg-primary' : 'bg-muted'}`}
                              />
                            ))}
                          </div>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Add New Skill</CardTitle>
                  <CardDescription>
                    Add a new skill to your profile
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...skillForm}>
                    <form onSubmit={skillForm.handleSubmit(onSkillSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={skillForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Skill Name</FormLabel>
                              <FormControl>
                                <Input placeholder="JavaScript" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={skillForm.control}
                          name="category"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Category</FormLabel>
                              <FormControl>
                                <Input placeholder="Programming" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={skillForm.control}
                        name="level"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Proficiency Level (1-10)</FormLabel>
                            <FormControl>
                              <div className="flex items-center space-x-2">
                                <Input 
                                  type="range" 
                                  min={1} 
                                  max={5} 
                                  step={1}
                                  {...field}
                                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                                  className="w-full"
                                />
                                <span className="font-bold text-lg">{field.value}</span>
                              </div>
                            </FormControl>
                            <FormDescription>
                              1 = Beginner, 5 = Expert
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Adding..." : "Add Skill"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}