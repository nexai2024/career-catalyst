"use client"
import { LogOut, LogIn } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { redirect } from "next/navigation";
import { SignInButton, SignOutButton, UserButton, useUser } from "@clerk/nextjs";


export default function UserComponent() {
  const { isSignedIn, user, isLoaded } = useUser();
    // DISPLAY LOGGED IN USER WITH LINK TO LOGOUT OR LOGIN LINK IF NO USER
    return (
        user ? (
            <div className="px-2 mt-4">
            <UserButton />
            <SignOutButton />
          </div>
        ) : (
            <div className="px-2 mt-4">
                <SignInButton />
          </div>
        )
    )
}