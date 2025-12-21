import { NavLink } from "react-router";
import { Avatar } from "../ui/Avatar";
import { useCurrentUser } from "../../hooks/user";

export function BottomNav() {
    const { user: currentUser } = useCurrentUser();
    const username = currentUser?.username;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-base-100/90 backdrop-blur-xl border-t border-base-content/5 pb-safe md:hidden">
            <div className="flex items-center justify-around h-16 px-2">
                <NavLink
                    to="/"
                    className={({ isActive }) => `p-3 rounded-full transition-all ${isActive ? "text-primary scale-110" : "text-base-content/50"}`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={({ isActive }) => isActive ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2} className="w-7 h-7">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                    </svg>
                </NavLink>

                <NavLink
                    to="/explore"
                    className={({ isActive }) => `p-3 rounded-full transition-all ${isActive ? "text-primary scale-110" : "text-base-content/50"}`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-7 h-7">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                </NavLink>

                <NavLink
                    to="/create-post"
                    className="p-1"
                >
                    <div className="bg-primary text-primary-content rounded-xl p-2 shadow-lg shadow-primary/30 transform transition-transform active:scale-90">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-7 h-7">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                    </div>
                </NavLink>

                <NavLink
                    to="/users"
                    className={({ isActive }) => `p-3 rounded-full transition-all ${isActive ? "text-primary scale-110" : "text-base-content/50"}`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-7 h-7">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 001.753-1.124 9.123 9.123 0 00-4.446-5.777M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                    </svg>
                </NavLink>

                <NavLink
                    to={username ? `/profile/${username}` : "/sign-in"}
                    className={({ isActive }) => `p-1 rounded-full border-2 transition-all ${isActive ? "border-primary scale-110" : "border-transparent"}`}
                >
                    <Avatar src={currentUser?.imageUrl} alt={username} size="xs" className="w-7 h-7" />
                </NavLink>
            </div>
        </div>
    );
}
