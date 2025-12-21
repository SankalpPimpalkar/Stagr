import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@clerk/clerk-react";
import { userAPI, postAPI } from "../utils/api";
import { ProfileHeader } from "../components/profile/ProfileHeader";
import { PostGrid } from "../components/profile/PostGrid";

export default function U() {
    const { username } = useParams();
    const { user: currentUser } = useUser();

    // Fetch User Details
    const { data: userProfile, isLoading: isUserLoading } = useQuery({
        queryKey: ["user", username],
        queryFn: () => userAPI.getUserByUsername(username),
        enabled: !!username
    });

    // Fetch User Posts
    const { data: postsData, isLoading: isPostsLoading } = useQuery({
        queryKey: ["posts", username],
        queryFn: () => postAPI.getAllPosts({ username }),
        enabled: !!username
    });

    const posts = postsData?.posts || [];

    // Check if viewing own profile
    // We match by username as it's visible in URL and profile
    const isOwnProfile = currentUser?.username === username;

    if (isUserLoading) return (
        <div className="flex justify-center items-center h-[50vh]">
            <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
    );

    if (!userProfile) return (
        <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-2 border-base-content/20 rounded-full flex items-center justify-center mb-4 text-4xl">
                ?
            </div>
            <h1 className="text-2xl font-bold">User not found</h1>
            <p className="opacity-60">The user you are looking for does not exist.</p>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto py-8">
            <ProfileHeader
                user={userProfile}
                isOwnProfile={isOwnProfile}
                onEditProfile={() => {/* Read only view usually, but technically shouldn't happen here if nav logic is correct */ }}
                postCount={posts.length}
            />

            <div className="border-t border-base-content/10 mt-8 mb-8" />

            <div className="mb-6 flex justify-center gap-12 text-sm font-semibold tracking-wide uppercase">
                <span className="flex items-center gap-2 border-t border-base-content pt-4 -mt-4.5 cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                    </svg>
                    Posts
                </span>
            </div>

            {isPostsLoading ? (
                <div className="flex justify-center py-20">
                    <span className="loading loading-spinner text-primary"></span>
                </div>
            ) : (
                <PostGrid posts={posts} />
            )}
        </div>
    );
}
