import { useParams } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userAPI, postAPI } from "../utils/api";
import { Modal } from "../components/ui/Modal";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { useState } from "react";
import { useCurrentUser } from "../hooks/user";
import { ProfileHeader } from "../components/profile/ProfileHeader";
import { PostGrid } from "../components/profile/PostGrid";

export default function Profile() {
    const { username } = useParams();
    const queryClient = useQueryClient();
    const [isEditBioOpen, setIsEditBioOpen] = useState(false);
    const [bio, setBio] = useState("");
    const { user: currentUser } = useCurrentUser();

    // Fetch User Posts
    const { data: postsData, isLoading: isPostsLoading } = useQuery({
        queryKey: ["posts", username],
        queryFn: () => postAPI.getAllPosts({ username }),
        enabled: !!username
    });

    const updateBioMutation = useMutation({
        mutationFn: (newBio) => userAPI.updateBio(newBio),
        onSuccess: () => {
            queryClient.invalidateQueries(["currentUser"]);
            setIsEditBioOpen(false);
        }
    });

    const posts = postsData?.posts || [];
    const isOwnProfile = currentUser?.username === username;

    if (!currentUser) return (
        <div className="flex justify-center items-center h-[50vh]">
            <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto py-8">
            <ProfileHeader
                user={currentUser}
                isOwnProfile={isOwnProfile}
                onEditProfile={() => {
                    setBio(currentUser.bio || "");
                    setIsEditBioOpen(true);
                }}
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
                <span className="flex items-center gap-2 pt-4 opacity-40 cursor-not-allowed">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                    </svg>
                    Saved
                </span>
                <span className="flex items-center gap-2 pt-4 opacity-40 cursor-not-allowed">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                    Tagged
                </span>
            </div>

            {isPostsLoading ? (
                <div className="flex justify-center py-20">
                    <span className="loading loading-spinner text-primary"></span>
                </div>
            ) : (
                <PostGrid posts={posts} />
            )}

            {/* Edit Bio Modal */}
            <Modal
                isOpen={isEditBioOpen}
                onClose={() => setIsEditBioOpen(false)}
                title="Edit Profile"
            >
                <div className="space-y-4 mt-4">
                    <Input
                        label="Bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Tell us about yourself"
                        multiline
                        rows={3}
                    />
                    <div className="flex justify-end gap-2 mt-6">
                        <Button variant="ghost" onClick={() => setIsEditBioOpen(false)}>Cancel</Button>
                        <Button
                            variant="primary"
                            onClick={() => updateBioMutation.mutate(bio)}
                            isLoading={updateBioMutation.isPending}
                        >
                            Save Profile
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
