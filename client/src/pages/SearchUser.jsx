import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { userAPI } from "../utils/api";
import { Input } from "../components/ui/Input";
import { UserCard } from "../components/UserCard";

function useDebounceValue(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
}

export default function SearchUser() {
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounceValue(search, 500);

    const { data: usersData, isLoading } = useQuery({
        queryKey: ["users", debouncedSearch],
        queryFn: () => userAPI.getUsers(debouncedSearch),
    });

    const users = usersData?.users || [];

    return (
        <div className="max-w-4xl mx-auto py-10 px-4 md:px-0">
            <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-linear-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                    Command Center
                </h1>
                <p className="text-base-content/60 text-lg">Find creators, friends, and inspiration.</p>
            </div>

            <div className="mb-12 relative max-w-2xl mx-auto group">
                <div className="absolute inset-0 bg-linear-to-r from-primary to-accent opacity-20 blur-xl rounded-full group-hover:opacity-30 transition-opacity duration-500"></div>
                <Input
                    placeholder="Search connection..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="text-xl py-4 px-8 rounded-full border-2 border-base-content/10 bg-base-100/50 backdrop-blur-md shadow-2xl focus:border-primary/50 transition-all duration-300"
                    autoFocus
                />
                <div className="absolute right-6 top-1/2 -translate-y-1/2 text-base-content/30">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-20">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {users.length === 0 ? (
                        <div className="col-span-full text-center opacity-40 py-20">
                            <div className="w-24 h-24 mx-auto bg-base-200 rounded-full flex items-center justify-center mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 001.753-1.124 9.123 9.123 0 00-4.446-5.777M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold">{debouncedSearch ? "No users found" : "Explore the community"}</h3>
                        </div>
                    ) : (
                        users.map(user => (
                            <UserCard key={user._id} user={user} />
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
