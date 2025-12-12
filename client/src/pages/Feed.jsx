import { useUser } from "@clerk/clerk-react"

export default function Feed() {

    const { user, isLoaded } = useUser()

    if (!isLoaded) return <span className="loading-bars loading-xl" />

    return (
        <div className="w-full h-screen flex items-center justify-center">
            <h5 className="font-semibold text-lg text-base-content/70">
                Hello {user.fullName}
            </h5>
        </div>
    )
}
