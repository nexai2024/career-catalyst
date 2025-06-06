"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, Briefcase, BookOpen, 
  FileText, User, Menu, X, BrainCircuit,
  Video, LogOut
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";
import UserComponent from "./UserComponent";
import { useUser } from "@stackframe/stack";

const anonRoutes = [
    {
      name: "Features",
      path: "/",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      name: "Pricing",
      path: "/",
      icon: <BrainCircuit className="h-5 w-5" />,
    },
    {
      name: "Features",
      path: "/",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      name: "Contact Us",
      path: "/",
      icon: <BrainCircuit className="h-5 w-5" />,
    },
  ];
const routes = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    name: "Assessments",
    path: "/dashboard/assessments",
    icon: <BrainCircuit className="h-5 w-5" />,
  },
  {
    name: "Career Plan",
    path: "/dashboard/career-plan",
    icon: <Briefcase className="h-5 w-5" />,
  },
  {
    name: "Learning",
    path: "/dashboard/learning",
    icon: <BookOpen className="h-5 w-5" />,
  },
  {
    name: "Interview Prep",
    path: "/dashboard/interviews",
    icon: <Video className="h-5 w-5" />,
  },
  {
    name: "Documents",
    path: "/dashboard/documents",
    icon: <FileText className="h-5 w-5" />,
  },
  {
    name: "Jobs",
    path: "/dashboard/jobs",
    icon: <Briefcase className="h-5 w-5" />,
  },
  {
    name: "Profile",
    path: "/profile",
    icon: <User className="h-5 w-5" />,
  },
];

function NavBar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);
  //
  const user = useUser();
  // Close the mobile menu when a route is clicked
  const handleRouteClick = () => {
    setIsOpen(false);
  };

  return (
    <>
    {user ? (
    <nav className="border-b bg-background sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <BookOpen className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl text-primary">Career Catalyst</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-6">
              {routes.map((route) => (
                <Link
                  key={route.path}
                  href={route.path}
                  className={cn(
                    "flex items-center text-sm font-medium transition-colors hover:text-primary",
                    pathname === route.path
                      ? "text-primary"
                      : "text-muted-foreground"
                  )}
                >
                  {route.name}
                </Link>
              ))}
              <ThemeToggle />
             <UserComponent />
            </div>
          </div>

          {/* Mobile navigation */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64 sm:w-80">
                <div className="flex flex-col space-y-4 py-4">
                  <div className="flex items-center justify-between px-4">
                    <Link href="/" className="flex items-center space-x-2" onClick={handleRouteClick}>
                      <BookOpen className="h-6 w-6 text-primary" />
                      <span className="font-bold text-xl text-primary">Career Catalyst</span>
                    </Link>
                    <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                      <X className="h-5 w-5" />
                      <span className="sr-only">Close menu</span>
                    </Button>
                  </div>
                  <div className="space-y-1 px-2">
                    {routes.map((route) => (
                      <Link
                        key={route.path}
                        href={route.path}
                        onClick={handleRouteClick}
                        className={cn(
                          "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                          pathname === route.path
                            ? "bg-accent text-accent-foreground"
                            : "text-muted-foreground"
                        )}
                      >
                        {route.icon}
                        <span className="ml-3">{route.name}</span>
                      </Link>
                    ))}
                  </div>
                 <UserComponent />
                  {/* <div className="px-2 mt-4">
                    <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </Button>
                  </div> */}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
                  ) : (
                    <nav className="border-b bg-background sticky top-0 z-50">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                      <div className="flex h-16 items-center justify-between">
                        <div className="flex items-center">
                          <Link href="/" className="flex items-center space-x-2">
                            <BookOpen className="h-6 w-6 text-primary" />
                            <span className="font-bold text-xl text-primary">Career Catalyst</span>
                          </Link>
                        </div>
              
                        {/* Desktop navigation */}
                        <div className="hidden md:block">
                          <div className="flex items-center space-x-6">
                            {anonRoutes.map((route) => (
                              <Link
                                key={route.path}
                                href={route.path}
                                className={cn(
                                  "flex items-center text-sm font-medium transition-colors hover:text-primary",
                                  pathname === route.path
                                    ? "text-primary"
                                    : "text-muted-foreground"
                                )}
                              >
                                {route.name}
                              </Link>
                            ))}
                            <ThemeToggle />
                           <UserComponent />
                          </div>
                        </div>
              
                        {/* Mobile navigation */}
                        <div className="md:hidden flex items-center space-x-2">
                          <ThemeToggle />
                          <Sheet open={isOpen} onOpenChange={setIsOpen}>
                            <SheetTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle menu</span>
                              </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-64 sm:w-80">
                              <div className="flex flex-col space-y-4 py-4">
                                <div className="flex items-center justify-between px-4">
                                  <Link href="/" className="flex items-center space-x-2" onClick={handleRouteClick}>
                                    <BookOpen className="h-6 w-6 text-primary" />
                                    <span className="font-bold text-xl text-primary">Career Catalyst</span>
                                  </Link>
                                  <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                                    <X className="h-5 w-5" />
                                    <span className="sr-only">Close menu</span>
                                  </Button>
                                </div>
                                <div className="space-y-1 px-2">
                                  {anonRoutes.map((route) => (
                                    <Link
                                      key={route.path}
                                      href={route.path}
                                      onClick={handleRouteClick}
                                      className={cn(
                                        "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                                        pathname === route.path
                                          ? "bg-accent text-accent-foreground"
                                          : "text-muted-foreground"
                                      )}
                                    >
                                      {route.icon}
                                      <span className="ml-3">{route.name}</span>
                                    </Link>
                                  ))}
                                </div>
                               <UserComponent />
                                {/* <div className="px-2 mt-4">
                                  <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                                    <LogOut className="h-4 w-4" />
                                    Sign Out
                                  </Button>
                                </div> */}
                              </div>
                            </SheetContent>
                          </Sheet>
                        </div>
                      </div>
                    </div>
                  </nav>
                  )
    }
    </>
  );
} 
export default NavBar;