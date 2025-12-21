import { useNavigate } from "react-router";
import { Avatar } from "./ui/Avatar";

export function UserCard({ user }) {
    const navigate = useNavigate();

    return (
        <div
            className="group relative flex flex-col items-center p-6 bg-base-100/40 backdrop-blur-sm border border-base-content/5 rounded-3xl hover:border-primary/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5 cursor-pointer"
            onClick={() => navigate(`/U/${user.username}`)}
        >
            <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity duration-500" />

            <div className="relative mb-4">
                <Avatar src={user.imageUrl} alt={user.username} size="lg" className="shadow-lg ring-4 ring-base-100/50" />
            </div>

            <h3 className="relative font-bold text-lg leading-tight">{user.name || user.username}</h3>
            <p className="relative text-sm text-base-content/50 font-medium mb-4">@{user.username}</p>

            <button className="relative w-full py-2 bg-base-200/50 hover:bg-primary hover:text-primary-content rounded-xl font-medium text-sm transition-colors flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-primary/20">
                View Profile
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
            </button>
        </div>
    );
}
