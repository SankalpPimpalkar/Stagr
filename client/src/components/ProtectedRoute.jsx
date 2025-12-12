import { useUser, RedirectToSignIn, SignedIn } from "@clerk/clerk-react"
import { Outlet } from "react-router"

export function ProtectedRoute() {
    const { isLoaded, isSignedIn } = useUser()

    if (!isLoaded) return null
    if (!isSignedIn) return <RedirectToSignIn />

    return (
        <SignedIn>
            <Outlet />
        </SignedIn>
    )
}
