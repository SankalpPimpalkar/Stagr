import { Link, NavLink, useNavigate } from "react-router";
import { UserButton, useUser, useClerk } from "@clerk/clerk-react";
import { Button } from "./ui/Button";
import { useCurrentUser } from "../hooks/user";

export function Navbar() {
    const { user: currentUser } = useCurrentUser();
    console.log(currentUser, 'Myuserss')
    const navigate = useNavigate();

    return (
        <nav className="border-b border-base-300 flex justify-between items-center bg-base-100/80 backdrop-blur-md sticky top-0 z-50 px-4 py-3">
            <Link to="/" className="text-xl font-bold bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent hover:opacity-80 transition-opacity">
                Stagr
            </Link>

            <div className="flex items-center gap-4">
                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-4 mr-4">
                    <NavLink to="/" className={({ isActive }) => `btn btn-sm btn-ghost ${isActive ? "bg-base-200" : ""}`}>Feed</NavLink>
                    <NavLink to="/explore" className={({ isActive }) => `btn btn-sm btn-ghost ${isActive ? "bg-base-200" : ""}`}>Explore</NavLink>
                    <NavLink to="/users" className={({ isActive }) => `btn btn-sm btn-ghost ${isActive ? "bg-base-200" : ""}`}>People</NavLink>
                </div>

                <Button
                    variant="primary"
                    size="sm"
                    onClick={() => navigate("/create-post")}
                    className="hidden sm:flex"
                >
                    + Create
                </Button>

                {/* Mobile Create Icon */}
                <button
                    onClick={() => navigate("/create-post")}
                    className="btn btn-circle btn-primary btn-sm sm:hidden flex items-center justify-center text-lg"
                >
                    +
                </button>
                {(currentUser?.username) && (
                    <NavLink to={`/profile/${currentUser?.username}`} className={({ isActive }) => `btn btn-sm btn-ghost ${isActive ? "bg-base-200" : ""}`}>Profile</NavLink>
                )}
                {/* <UserButton afterSignOutUrl="/sign-in" /> */}
            </div>
        </nav>
    );
}
