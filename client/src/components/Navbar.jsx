import { Link, NavLink, useNavigate } from "react-router";
import { useUser, useClerk } from "@clerk/clerk-react";
import { Avatar } from "./ui/Avatar";
import { Button } from "./ui/Button";
import { useCurrentUser } from "../hooks/user";

export function Navbar() {
    const { user: currentUser } = useCurrentUser();
    const navigate = useNavigate();
    const { signOut } = useClerk();

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-base-100/80 backdrop-blur-xl px-4 md:px-6 h-16 flex items-center justify-between transition-all duration-300">
            {/* Logo area */}
            <Link to="/" className="group flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-linear-to-tr from-primary to-accent flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                    S
                </div>
                <span className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-base-content to-base-content/50 hidden md:block">
                    STAGR
                </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1 bg-base-200/50 p-1 rounded-full border border-base-content/5 backdrop-blur-md absolute left-1/2 -translate-x-1/2">
                <NavPill to="/" icon="Home" label="Home" />
                <NavPill to="/stories" icon="Book" label="Stories" />
                <NavPill to="/explore" icon="Explore" label="Explore" />
                <NavPill to="/users" icon="People" label="Find" />
            </div>

            <div className="flex items-center gap-4">
                <Button
                    variant="primary"
                    size="sm"
                    onClick={() => navigate("/create-post")}
                    className="hidden md:flex rounded-full px-6 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all hover:scale-105"
                >
                    + Create
                </Button>

                {currentUser ? (
                    <div className="dropdown dropdown-end">
                        <label tabIndex={0} className="btn btn-ghost btn-circle avatar border border-base-content/10">
                            <Avatar src={currentUser?.imageUrl} alt={currentUser?.username} size="sm" />
                        </label>
                        <ul tabIndex={0} className="mt-3 z-1 p-2 shadow-2xl menu menu-sm dropdown-content bg-base-100 rounded-3xl w-52 border border-base-content/5">
                            <li><Link to={`/profile/${currentUser.username}`}>Profile</Link></li>
                            <li><Link to="/settings">Settings</Link></li>
                            <div className="divider my-1"></div>
                            <li><button onClick={() => signOut()} className="text-error">Logout</button></li>
                        </ul>
                    </div>
                ) : (
                    <Button size="sm" variant="ghost" onClick={() => navigate("/sign-in")}>Sign In</Button>
                )}
            </div>
        </nav>
    );
}

function NavPill({ to, icon, label }) {
    return (
        <NavLink
            to={to}
            className={({ isActive }) => `px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${isActive ? "bg-base-100 text-primary shadow-sm scale-105" : "text-base-content/60 hover:text-base-content hover:bg-base-content/5"}`}
        >
            {label}
        </NavLink>
    );
}
