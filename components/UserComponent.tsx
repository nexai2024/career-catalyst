import { LogOut, LogIn } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { redirect } from "next/navigation";

export default async function UserComponent() {
    let isLoggedIn = false


    // DISPLAY LOGGED IN USER WITH LINK TO LOGOUT OR LOGIN LINK IF NO USER
    return (
        isLoggedIn ? (
            <div className="px-2 mt-4">
            <Button variant="outline" className="w-full flex items-center justify-center gap-2">
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
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