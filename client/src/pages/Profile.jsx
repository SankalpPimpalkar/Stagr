import { useParams } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useUser } from "@clerk/clerk-react";
import { userAPI, postAPI } from "../utils/api";
import { PostCard } from "../components/PostCard";
import { Avatar } from "../components/ui/Avatar";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Modal } from "../components/ui/Modal";
import { Input } from "../components/ui/Input";
import { useState } from "react";
import { useCurrentUser } from "../hooks/user";

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
            queryClient.invalidateQueries(["user", username]);
            setIsEditBioOpen(false);
        }
    });

    const posts = postsData?.posts || [];
    const isOwnProfile = currentUser?.username === username;

    if (isPostsLoading) return (
        <div className="flex justify-center mt-20">
            <span className="loading loading-bars loading-lg text-primary"></span>
        </div>
    );

    if (!currentUser) return (
        <div className="text-center mt-20">
            <h1 className="text-2xl font-bold">User not found</h1>
        </div>
    );

    return (
        <div className="max-w-2xl mx-auto py-8">
            <Card className="mb-8 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-24 bg-linear-to-r from-primary/20 to-secondary/20 z-0"></div>
                <div className="relative z-10 pt-10">
                    <div className="inline-block p-1 bg-base-100 rounded-full mb-4">
                        <Avatar src={currentUser.imageUrl} alt={currentUser.username} size="xl" />
                    </div>
                    <h1 className="text-3xl font-bold">{currentUser.name}</h1>
                    <p className="opacity-70 text-lg">@{currentUser.username}</p>

                    <div className="mt-4 px-8">
                        <p className="text-base-content/80 whitespace-pre-wrap">{currentUser.bio || "No bio yet."}</p>
                    </div>

                    {isOwnProfile && (
                        <div className="mt-6 mb-2">
                            <Button variant="outline" size="sm" onClick={() => {
                                setBio(currentUser.bio || "");
                                setIsEditBioOpen(true);
                            }}>
                                Edit Profile
                            </Button>
                        </div>
                    )}
                </div>
            </Card>

            <h2 className="text-2xl font-bold mb-4 px-2 border-b border-base-content/10 pb-2">Posts</h2>

            {isPostsLoading ? (
                <div className="flex justify-center py-10">
                    <span className="loading loading-spinner text-primary"></span>
                </div>
            ) : (
                <div className="space-y-6">
                    {posts.length === 0 ? (
                        <p className="text-center opacity-50 py-10">No posts shared yet.</p>
                    ) : (
                        posts.map(post => (
                            <PostCard key={post._id} post={post} />
                        ))
                    )}
                </div>
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
                    />
                    <div className="flex justify-end gap-2 mt-6">
                        <Button variant="ghost" onClick={() => setIsEditBioOpen(false)}>Cancel</Button>
                        <Button
                            variant="primary"
                            onClick={() => updateBioMutation.mutate(bio)}
                            isLoading={updateBioMutation.isPending}
                        >
                            Save
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
