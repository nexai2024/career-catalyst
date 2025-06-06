"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function JobsPage() {
  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Job Opportunities</h1>
        <p className="text-muted-foreground">
          Find and apply to positions matched to your profile
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
          <CardDescription>
            The jobs feature is currently under development. Check back soon for exciting opportunities!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            We&apos;re working on bringing you personalized job recommendations and an easy application process.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}