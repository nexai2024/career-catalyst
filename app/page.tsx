import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronRight, Briefcase, BrainCircuit, FileText, BookOpen } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-primary/90 via-primary/80 to-primary/90 text-white">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Accelerate Your Career Growth with AI
              </h1>
              <p className="mx-auto max-w-[700px] text-lg md:text-xl text-white/90">
                Personalized career guidance, skill assessments, and AI-powered tools to help you achieve your professional goals.
              </p>
            </div>
            <div className="space-x-4">
              <Link href="/dashboard">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                  Get Started
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section id="features" className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Comprehensive Career Development
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Our platform offers everything you need to advance your career and reach your professional goals.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            <FeatureCard 
              icon={<BrainCircuit className="h-12 w-12 text-primary" />}
              title="Skills Assessment"
              description="Comprehensive evaluations to identify your strengths and areas for growth."
            />
            <FeatureCard 
              icon={<Briefcase className="h-12 w-12 text-primary" />}
              title="Career Planning"
              description="AI-powered career roadmaps based on your goals and industry trends."
            />
            <FeatureCard 
              icon={<BookOpen className="h-12 w-12 text-primary" />}
              title="Learning Modules"
              description="Personalized courses and resources to build in-demand skills."
            />
            <FeatureCard 
              icon={<FileText className="h-12 w-12 text-primary" />}
              title="Document Generation"
              description="Create optimized resumes and cover letters with AI assistance."
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Success Stories
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Hear from professionals who have accelerated their careers with our platform.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            <TestimonialCard 
              quote="Career Catalyst helped me transition from marketing to product management in just 6 months. The personalized learning path made all the difference."
              author="Sarah J."
              role="Product Manager"
            />
            <TestimonialCard 
              quote="The interview preparation module is incredible. I felt so confident going into my interviews and landed a role that increased my salary by 30%."
              author="Michael T."
              role="Software Engineer"
            />
            <TestimonialCard 
              quote="As someone looking to re-enter the workforce after a break, Career Catalyst gave me the structure and confidence I needed to update my skills and find a great position."
              author="Elena R."
              role="Data Analyst"
            />
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Ready to Transform Your Career?
              </h2>
              <p className="mx-auto max-w-[700px] md:text-xl opacity-90">
                Join thousands of professionals who are achieving their career goals faster with Career Catalyst.
              </p>
            </div>
            <div>
              <Link href="/dashboard">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                  Get Started Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-6 bg-background border-t">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">Career Catalyst</span>
            </div>
            <div className="mt-4 md:mt-0">
              <p className="text-sm text-muted-foreground">
                © 2025 Career Catalyst. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="flex flex-col items-center text-center p-6 bg-card rounded-lg shadow-sm border transition-all hover:shadow-md">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}

function TestimonialCard({ quote, author, role }: { quote: string, author: string, role: string }) {
  return (
    <div className="flex flex-col p-6 bg-card rounded-lg shadow-sm border">
      <p className="text-lg italic mb-4">{quote}</p>
      <div className="mt-auto">
        <p className="font-semibold">{author}</p>
        <p className="text-sm text-muted-foreground">{role}</p>
      </div>
    </div>
  );
}