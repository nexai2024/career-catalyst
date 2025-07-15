"use client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Form } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { errorMonitor } from "node:events"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "./ui/form"

const careerPlanFormSchema = z.object({
  currentPosition: z.string().min(2, {
    message: "Current Position must be at least 2 characters.",
  }),
  desiredPosition: z.string().min(2, {
    message: "Desired Position must be at least 2 characters.",
  }),
  otherInfo: z.string().optional(),
  specialRequirements: z.string().optional(),
});

export default function GenerateCareerPlanForm() {
    const [loading, setLoading] = useState(false);
     
  const careerPlanForm = useForm<z.infer<typeof careerPlanFormSchema>>({
      resolver: zodResolver(careerPlanFormSchema),
        defaultValues: {
            currentPosition: "",
            desiredPosition: "",
            otherInfo: "",
            specialRequirements: "",
            },
    });
    console.log("careerPlanForm", careerPlanForm)
  const { reset: resetForm } = careerPlanForm;
  const reset = () => {
    resetForm({
      currentPosition: "",
      desiredPosition: "",
      otherInfo: "",
      specialRequirements: "",
    });
  };
  // Function to handle form submission
const onCareerPlanFormSubmit = async (values: z.infer<typeof careerPlanFormSchema>) => {
    setLoading(true);
    try {
      const response = await fetch("/api/learning-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPosition: values.currentPosition,
          desiredPostion: values.desiredPosition,
          otberInfo: values.otherInfo,
          specialRequirements: values.specialRequirements,
        }),
      });

      if (!response.ok) throw new Error("Failed to create assessment");

      careerPlanForm.reset();
    } catch (error) {
      console.log("error in dialog", error)
    } finally {
      setLoading(false);
    }
  };
  return (
    <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Generate Career Plan</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Update your career parameters here, and press Gernerate to create plan.
            </DialogDescription>
          </DialogHeader>
          <Form {...careerPlanForm}>
            <form onSubmit={careerPlanForm.handleSubmit(onCareerPlanFormSubmit)} className="space-y-4">
            <FormField
                control={careerPlanForm.control}
                name="currentPosition"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Current Position</FormLabel>
                        <FormControl>
                            <Input placeholder="Current Position" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={careerPlanForm.control}
                name="desiredPosition"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Desired Position</FormLabel>
                        <FormControl>
                            <Input placeholder="Desired Position" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={careerPlanForm.control}    
                name="otherInfo"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Other Information</FormLabel>
                        <FormControl>
                            <Input placeholder="Other Information" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={careerPlanForm.control}
                name="specialRequirements"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Special Requirements</FormLabel>
                        <FormControl>
                            <Input placeholder="Special Requirements" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
         </form>
           </Form>

          
        </DialogContent>
    </Dialog>
  )
}
