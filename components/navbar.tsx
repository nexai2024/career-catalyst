"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard, Briefcase, BookOpen,
  FileText, User, Menu, X, BrainCircuit,
  Video, LogOut,
  Settings,
  LucideAward
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";
import UserComponent from "./UserComponent";
import { useUser } from "@clerk/nextjs";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle, } from "@/components/ui/navigation-menu";
import { CreditCardIcon, Loader, LucideIcon, SquareCheckIcon, SquareChevronUpIcon, SquarePowerIcon, ToggleRight, } from "lucide-react";

const anonComponents: { title: string; href: string; description: string; icon: LucideIcon; }[] = [
  {
    title: "Features",
    href: "/",
    description: "Explore the features of our platform.",
    icon: LayoutDashboard,
  },
  {
    title: "Pricing",
    href: "/pricing",
    description: "View our pricing plans and choose the best one for you.",
    icon: BrainCircuit,
  },
  {
    title: "Features",
    href: "/",
    description: "Explore the features of our platform.",
    icon: LayoutDashboard,
  },
  {
    title: "Contact Us",
    href: "/",
    description: "Get in touch with our support team.",
    icon: BrainCircuit,
  },
];
const components: { title: string; parent: string; href: string; description: string; icon: LucideIcon; }[] = [
  {
    title: "Dashboard",
    parent: "",
    href: "/dashboard",
    description: "Your personal dashboard with an overview of your activities.",
    icon: LayoutDashboard,
  },

  {
    title: "Assessments",
    parent: "Learning",
    href: "/dashboard/assessments",
    description: "Take assessments to evaluate your skills and knowledge.",
    icon: BrainCircuit,
  },
  {
    title: "Career Plan",
    parent: "Career",
    href: "/dashboard/career-plan",
    description: "Create and manage your career plan.",
    icon: Briefcase,
  },
  {
    title: "Learning Plan",
    parent: "Learning",
    href: "/dashboard/learning",
    description: "Create and manage your learning plan.",
    icon: BookOpen,
  },
  {
    title: "Interview Prep",
    parent: "Career",
    href: "/dashboard/interviews",
    description: "Prepare for interviews with tailored questions and resources.",
    icon: Video,
  },
  {
    title: "Documents",
    parent: "Career",
    href: "/dashboard/documents",
    description: "Create and manage your career documents like resumes and cover letters.",
    icon: FileText,
  },
  {
    title: "Jobs",
    parent: "Career",
    href: "/dashboard/jobs",
    description: "Search and apply for jobs that match your skills and interests.",
    icon: Briefcase,
  },
  {
    title: "Settings",
    parent: "Tools",
    href: "/settings",
    description: "Manage your account settings and preferences.",
    icon: Settings,
  },
  {
    title: "Subscription",
    parent: "Account",
    href: "/profile/subscription",
    description: "Manage your subscription and view usage.",
    icon: User,
  },
  {
    title: "Profile",
    parent: "Account",
    href: "/profile",
    description: "Manage your profile and account settings.",
    icon: User,
  },
];


import * as React from "react";

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { icon: LucideIcon }
>(({ className, title, children, icon: Icon, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="font-semibold tracking-tight leading-none flex items-center gap-2">
            <Icon className="h-5 w-5" />
            {title}
          </div>
          <p className="mt-2 line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export default function NavBar() {
  const user = useUser();
  return (
    <>
      {user.isSignedIn ? (
        <div className="border-b bg-background sticky top-0 z-50">
          <div className="flex items-center justify-between bg-background p-4">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <BookOpen className="h-6 w-6 text-primary" />
                <span className="font-bold text-xl text-primary">Career Catalyst</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <NavigationMenu className="">
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <Link href="/dashboard" legacyBehavior passHref>
                      <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        Dashboard
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>Learning</NavigationMenuTrigger>
                    <NavigationMenuContent className="p-4">
                      <div className="grid grid-cols-3 gap-3 p-4 w-[900px] divide-x">
                        <div className="col-span-2">
                          <h6 className="pl-2.5 font-semibold uppercase text-sm text-muted-foreground">
                            Standard
                          </h6>
                          <ul className="mt-2.5 grid grid-cols-2 gap-3">
                            {components
                              .filter((component) => component.parent === "Learning")
                              .map((component) => (
                                <ListItem
                                  key={component.title}
                                  title={component.title}
                                  href={component.href}
                                  icon={component.icon}
                                >
                                  {component.description}
                                </ListItem>
                              ))}
                          </ul>
                        </div>
                        <div className="pl-4">
                          <h6 className="pl-2.5 font-semibold uppercase text-sm text-muted-foreground">
                            Premium
                          </h6>
                          <ul className="mt-2.5 grid gap-3">
                            {components
                              .filter((component) => component.parent === "Learning")
                              .map((component) => (
                                <ListItem
                                  key={component.title}
                                  title={component.title}
                                  href={component.href}
                                  icon={component.icon}
                                >
                                  {component.description}
                                </ListItem>
                              ))}
                          </ul>
                        </div>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>Career</NavigationMenuTrigger>
                    <NavigationMenuContent className="px-4 py-6">
                      <div className="pl-4">
                        <h6 className="pl-2.5 font-semibold uppercase text-sm text-muted-foreground">
                          Solutions
                        </h6>
                        <ul className="mt-2.5 grid w-[400px] gap-3 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                          {components
                            .filter((component) => component.parent === "Career")
                            .map((component) => (
                              <ListItem
                                key={component.title}
                                title={component.title}
                                href={component.href}
                                icon={component.icon}
                              >
                                {component.description}
                              </ListItem>
                            ))}
                        </ul>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>Tools</NavigationMenuTrigger>
                    <NavigationMenuContent className="px-4 py-6">
                      <div className="pl-4">
                        <h6 className="pl-2.5 font-semibold uppercase text-sm text-muted-foreground">
                          Tools
                        </h6>
                        <ul className="mt-2.5 grid w-[400px] gap-3 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                          {components
                            .filter((component) => component.parent === "Tools")
                            .map((component) => (
                              <ListItem
                                key={component.title}
                                title={component.title}
                                href={component.href}
                                icon={component.icon}
                              >
                                {component.description}
                              </ListItem>
                            ))}
                        </ul>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link href="/admin" legacyBehavior passHref>
                      <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        Admin
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>
            <div className="flex items-center space-x-2">
              <UserComponent />
            </div>
          </div>
        </div>
      ) : (
      <NavigationMenu className="border-b bg-background sticky top-0 z-50">
        <NavigationMenuList>
          {anonComponents.map((component) => (
            <NavigationMenuItem key={component.title}>
              <Link href={component.href} legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  {component.icon && <component.icon className="mr-2 h-4 w-4" />}
                  {component.title}
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
      )}
    </>
  );
}