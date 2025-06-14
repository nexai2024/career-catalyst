"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Download, Trash2, PlusCircle, FileEdit, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function DocumentsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Mock documents data
  const documents = [
    {
      id: 1,
      type: "Resume",
      title: "Software Engineer Resume",
      lastModified: "2025-03-15",
      status: "Active",
    },
    {
      id: 2,
      type: "Cover Letter",
      title: "Full Stack Developer Application",
      lastModified: "2025-03-10",
      status: "Draft",
    },
    {
      id: 3,
      type: "Portfolio",
      title: "Technical Portfolio",
      lastModified: "2025-03-01",
      status: "Active",
    },
  ];

  const handleGenerateDocument = (type: string) => {
    setIsLoading(true);
    // Simulate document generation
    setTimeout(() => {
      toast({
        title: "Document Generated",
        description: `Your ${type.toLowerCase()} has been generated successfully.`,
      });
      setIsLoading(false);
    }, 2000);
  };

  const handleDeleteDocument = (id: number) => {
    toast({
      title: "Document Deleted",
      description: "The document has been deleted successfully.",
    });
  };

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
        <p className="text-muted-foreground">
          Manage your professional documents and generate new ones with AI assistance
        </p>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Resume</CardTitle>
            <CardDescription>
              Create and manage your professional resume
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              className="w-full"
              onClick={() => handleGenerateDocument("Resume")}
              disabled={isLoading}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Generate Resume
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Cover Letter</CardTitle>
            <CardDescription>
              Generate tailored cover letters for job applications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              className="w-full"
              onClick={() => handleGenerateDocument("Cover Letter")}
              disabled={isLoading}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Generate Cover Letter
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Portfolio</CardTitle>
            <CardDescription>
              Showcase your work and achievements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              className="w-full"
              onClick={() => handleGenerateDocument("Portfolio")}
              disabled={isLoading}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Generate Portfolio
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>My Documents</CardTitle>
          <CardDescription>
            View and manage your saved documents
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="all">All Documents</TabsTrigger>
              <TabsTrigger value="resumes">Resumes</TabsTrigger>
              <TabsTrigger value="cover-letters">Cover Letters</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <FileText className="h-8 w-8 text-primary" />
                    <div>
                      <h3 className="font-medium">{doc.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {doc.type} • Last modified: {doc.lastModified}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <FileEdit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDeleteDocument(doc.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="resumes" className="space-y-4">
              {documents
                .filter((doc) => doc.type === "Resume")
                .map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <FileText className="h-8 w-8 text-primary" />
                      <div>
                        <h3 className="font-medium">{doc.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          Last modified: {doc.lastModified}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <FileEdit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDeleteDocument(doc.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
            </TabsContent>

            <TabsContent value="cover-letters" className="space-y-4">
              {documents
                .filter((doc) => doc.type === "Cover Letter")
                .map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <FileText className="h-8 w-8 text-primary" />
                      <div>
                        <h3 className="font-medium">{doc.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          Last modified: {doc.lastModified}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <FileEdit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDeleteDocument(doc.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}