"use client"
import { LogOut, LogIn } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { redirect } from "next/navigation";
import { UserButton, useUser } from "@stackframe/stack";

export default function UserComponent() {
  const user = useUser({ or: "redirect" });
    // DISPLAY LOGGED IN USER WITH LINK TO LOGOUT OR LOGIN LINK IF NO USER
    return (
        user ? (
            <div className="px-2 mt-4">
            <UserButton />
          </div>
        ) : (
            <div className="px-2 mt-4">
                <Link href="/login">
            <Button variant="outline" className="w-full flex items-center justify-center gap-2">
              <LogIn className="h-4 w-4" />
              Sign In
            </Button></Link>
          </div>
        )
    )
}