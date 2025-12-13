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
        <div className="max-w-xl mx-auto py-8">
            <h1 className="text-3xl font-bold mb-6 text-center bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">Find People</h1>

            <div className="mb-8">
                <Input
                    placeholder="Search by username..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="text-lg py-3"
                    autoFocus
                />
            </div>

            {isLoading ? (
                <div className="flex justify-center">
                    <span className="loading loading-bars loading-lg text-primary"></span>
                </div>
            ) : (
                <div className="space-y-4">
                    {users.length === 0 ? (
                        <div className="text-center opacity-50 py-10">
                            {debouncedSearch ? "No users found." : "Search for users to follow"}
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
