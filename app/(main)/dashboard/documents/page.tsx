"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  FileText, 
  Download, 
  Trash2, 
  PlusCircle, 
  FileEdit, 
  Eye, 
  Sparkles,
  Briefcase,
  User,
  Globe,
  Loader2,
  ExternalLink
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface Document {
  id: string;
  type: string;
  title: string;
  content?: string;
  metadata?: any;
  status: string;
  created_at: string;
  updated_at: string;
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [selectedType, setSelectedType] = useState<string>("");
  const [jobDescription, setJobDescription] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await fetch("/api/documents");
        if (response.ok) {
          const data = await response.json();
          setDocuments(data);
        }
      } catch (error) {
        console.error("Error fetching documents:", error);
        toast({
          title: "Error",
          description: "Failed to load documents",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchDocuments();
  }, []);

 

  const handleGenerateDocument = async () => {
    if (!selectedType) {
      toast({
        title: "Error",
        description: "Please select a document type",
        variant: "destructive",
      });
      return;
    }

    setGenerating(true);
    setGenerationProgress(0);

    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      const response = await fetch("/api/documents/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: selectedType,
          jobDescription: jobDescription || undefined,
          companyName: companyName || undefined,
        }),
      });

      clearInterval(progressInterval);
      setGenerationProgress(100);

      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Document Generated!",
          description: `Your ${selectedType.replace('_', ' ')} has been generated successfully.`,
        });
        
        setIsGenerateDialogOpen(false);
        setSelectedType("");
        setJobDescription("");
        setCompanyName("");
        fetchDocuments();
      } else {
        const error = await response.json();
        throw new Error(error.error || "Failed to generate document");
      }
    } catch (error) {
      clearInterval(progressInterval);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate document",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
      setGenerationProgress(0);
    }
  };

  const handleDeleteDocument = async (id: string) => {
    try {
      const response = await fetch(`/api/documents/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast({
          title: "Document Deleted",
          description: "The document has been deleted successfully.",
        });
        fetchDocuments();
      } else {
        throw new Error("Failed to delete document");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete document",
        variant: "destructive",
      });
    }
  };

  const handleExportDocument = async (id: string, title: string, format: string = 'html') => {
    try {
      const response = await fetch(`/api/documents/export/${id}?format=${format}`);
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `${title}.${format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        toast({
          title: "Export Successful",
          description: `Document exported as ${format.toUpperCase()}`,
        });
      } else {
        throw new Error("Failed to export document");
      }
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export document",
        variant: "destructive",
      });
    }
  };

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'resume':
        return <User className="h-8 w-8 text-blue-500" />;
      case 'cover_letter':
        return <FileText className="h-8 w-8 text-green-500" />;
      case 'portfolio':
        return <Globe className="h-8 w-8 text-purple-500" />;
      default:
        return <FileText className="h-8 w-8 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'generated':
        return 'default';
      case 'draft':
        return 'secondary';
      case 'published':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const documentsByType = {
    resume: documents.filter(doc => doc.type === 'resume'),
    cover_letter: documents.filter(doc => doc.type === 'cover_letter'),
    portfolio: documents.filter(doc => doc.type === 'portfolio'),
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 md:p-6 space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
          <p className="text-muted-foreground">Loading documents...</p>
        </div>
        <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-full"></div>
              </CardHeader>
              <CardContent>
                <div className="h-20 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
            <p className="text-muted-foreground">
              Generate and manage your professional documents with AI assistance
            </p>
          </div>
          <Dialog open={isGenerateDialogOpen} onOpenChange={setIsGenerateDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                <Sparkles className="h-4 w-4 mr-2" />
                Generate with AI
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                  Generate Document with AI
                </DialogTitle>
                <DialogDescription>
                  Create professional documents tailored to your profile and career goals.
                </DialogDescription>
              </DialogHeader>
              
              {generating ? (
                <div className="space-y-4 py-4">
                  <div className="flex items-center justify-center space-x-2">
                    <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
                    <span className="text-lg font-medium">Generating your document...</span>
                  </div>
                  <Progress value={generationProgress} className="h-2" />
                  <p className="text-center text-sm text-muted-foreground">
                    This may take a few moments while our AI analyzes your profile
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="document-type">Document Type</Label>
                    <Select value={selectedType} onValueChange={setSelectedType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select document type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="resume">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Resume
                          </div>
                        </SelectItem>
                        <SelectItem value="cover_letter">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Cover Letter
                          </div>
                        </SelectItem>
                        <SelectItem value="portfolio">
                          <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4" />
                            Portfolio Website
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {(selectedType === 'resume' || selectedType === 'cover_letter') && (
                    <div className="space-y-2">
                      <Label htmlFor="job-description">Job Description (Optional)</Label>
                      <Textarea
                        id="job-description"
                        placeholder="Paste the job description to tailor your document..."
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        className="min-h-[100px]"
                      />
                    </div>
                  )}

                  {selectedType === 'cover_letter' && (
                    <div className="space-y-2">
                      <Label htmlFor="company-name">Company Name</Label>
                      <Input
                        id="company-name"
                        placeholder="Enter company name"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                      />
                    </div>
                  )}

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setIsGenerateDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleGenerateDocument}
                      disabled={!selectedType}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Quick Generate Cards */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-dashed border-blue-200 hover:border-blue-400">
          <CardHeader className="space-y-1">
            <div className="flex items-center gap-2">
              <User className="h-6 w-6 text-blue-500" />
              <CardTitle className="text-xl">AI Resume</CardTitle>
            </div>
            <CardDescription>
              Generate a professional resume optimized for your target role
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="h-4 w-4" />
                <span>ATS-optimized formatting</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="h-4 w-4" />
                <span>Tailored to job descriptions</span>
              </div>
              <Button 
                className="w-full" 
                onClick={() => {
                  setSelectedType('resume');
                  setIsGenerateDialogOpen(true);
                }}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Generate Resume
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-dashed border-green-200 hover:border-green-400">
          <CardHeader className="space-y-1">
            <div className="flex items-center gap-2">
              <FileText className="h-6 w-6 text-green-500" />
              <CardTitle className="text-xl">AI Cover Letter</CardTitle>
            </div>
            <CardDescription>
              Create compelling cover letters for specific job applications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="h-4 w-4" />
                <span>Company-specific content</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="h-4 w-4" />
                <span>Persuasive storytelling</span>
              </div>
              <Button 
                className="w-full" 
                onClick={() => {
                  setSelectedType('cover_letter');
                  setIsGenerateDialogOpen(true);
                }}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Generate Cover Letter
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-dashed border-purple-200 hover:border-purple-400">
          <CardHeader className="space-y-1">
            <div className="flex items-center gap-2">
              <Globe className="h-6 w-6 text-purple-500" />
              <CardTitle className="text-xl">AI Portfolio</CardTitle>
            </div>
            <CardDescription>
              Build a stunning portfolio website to showcase your work
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="h-4 w-4" />
                <span>Modern, responsive design</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="h-4 w-4" />
                <span>Project showcases</span>
              </div>
              <Button 
                className="w-full" 
                onClick={() => {
                  setSelectedType('portfolio');
                  setIsGenerateDialogOpen(true);
                }}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Generate Portfolio
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Documents List */}
      <Card>
        <CardHeader>
          <CardTitle>My Documents</CardTitle>
          <CardDescription>
            View and manage your generated documents
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="all">All Documents ({documents.length})</TabsTrigger>
              <TabsTrigger value="resume">Resumes ({documentsByType.resume.length})</TabsTrigger>
              <TabsTrigger value="cover_letter">Cover Letters ({documentsByType.cover_letter.length})</TabsTrigger>
              <TabsTrigger value="portfolio">Portfolios ({documentsByType.portfolio.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {documents.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Documents Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Generate your first document using our AI-powered tools above.
                  </p>
                </div>
              ) : (
                documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      {getDocumentIcon(doc.type)}
                      <div>
                        <h3 className="font-medium">{doc.title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-sm text-muted-foreground">
                            {doc.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} • 
                            Created {new Date(doc.created_at).toLocaleDateString()}
                          </p>
                          <Badge variant={getStatusColor(doc.status)}>
                            {doc.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="icon" title="Preview">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" title="Edit">
                        <FileEdit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        title="Export as HTML"
                        onClick={() => handleExportDocument(doc.id, doc.title, 'html')}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        title="Delete"
                        onClick={() => handleDeleteDocument(doc.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </TabsContent>

            {Object.entries(documentsByType).map(([type, docs]) => (
              <TabsContent key={type} value={type} className="space-y-4">
                {docs.length === 0 ? (
                  <div className="text-center py-12">
                    {getDocumentIcon(type)}
                    <h3 className="text-lg font-medium mb-2 mt-4">
                      No {type.replace('_', ' ')} documents yet
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Generate your first {type.replace('_', ' ')} using AI.
                    </p>
                    <Button 
                      onClick={() => {
                        setSelectedType(type);
                        setIsGenerateDialogOpen(true);
                      }}
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate {type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Button>
                  </div>
                ) : (
                  docs.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        {getDocumentIcon(doc.type)}
                        <div>
                          <h3 className="font-medium">{doc.title}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-sm text-muted-foreground">
                              Created {new Date(doc.created_at).toLocaleDateString()}
                            </p>
                            <Badge variant={getStatusColor(doc.status)}>
                              {doc.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="icon" title="Preview">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" title="Edit">
                          <FileEdit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          title="Export as HTML"
                          onClick={() => handleExportDocument(doc.id, doc.title, 'html')}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          title="Delete"
                          onClick={() => handleDeleteDocument(doc.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}