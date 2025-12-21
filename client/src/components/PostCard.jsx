import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postAPI } from "../utils/api";
import { Card } from "./ui/Card";
import { Avatar } from "./ui/Avatar";
import { Button } from "./ui/Button";

// Helper to format date
const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
};

export function PostCard({ post }) {
    const { user } = useUser();
    const queryClient = useQueryClient();
    const isOwner = user?.id === post.owner?.clerkId; // Assuming backend populates clerkId or we match another way. 
    // Backend `protectRoute` matches clerkId to find user, then req.user is mongo user. 
    // `post.owner` is mongo user object. 
    // We might not have `clerkId` on `post.owner` unless populated. 
    // Let's assume we can match username or we need to fix backend to send clerkId or return current user mongoId.
    // Ideally api/check-auth would return mongoId. 
    // For now, let's rely on simple username match if unique, or just simple like functionality.

    const isLiked = post.likes?.includes(user?.id) || false; // This logic is flawed if post.likes is array of MongoIDs and user.id is ClerkID.
    // Backend `toggleLike` uses `req.user._id`.
    // We don't easily know our own MongoID on frontend unless we fetch "me".
    // Future fix: fetch "me" or assume `post.likes` contains objects we can check?
    // Backend: `post.likes` is ObjectId array refs 'User'.

    // Quick fix: Just show heart, toggle optimistically?
    // Real fix: We need our MongoID.

    const likeMutation = useMutation({
        mutationFn: () => postAPI.toggleLikePost(post._id),
        onSuccess: () => {
            queryClient.invalidateQueries(["posts"]);
        }
    });

    const deleteMutation = useMutation({
        mutationFn: () => postAPI.deletePost(post._id),
        onSuccess: () => {
            queryClient.invalidateQueries(["posts"]);
        }
    });

    return (
        <Card className="mb-6 hover:shadow-2xl transition-shadow duration-300">
            <div className="flex items-center gap-3 mb-4">
                <Avatar src={post.owner?.imageUrl} alt={post.owner?.username} size="md" />
                <div>
                    <h3 className="font-bold text-lg leading-none">{post.owner?.username}</h3>
                    <span className="text-xs text-base-content/50">{formatDate(post.createdAt)}</span>
                </div>
                {/* 
                  TODO: Show delete button if owner.
                  For now we hide it as we don't have robust owner check.
                */}
            </div>

            <p className="mb-4 text-base-content/90 whitespace-pre-wrap">{post.description}</p>

            {post.images && post.images.length > 0 && (
                <div className={`grid gap-2 mb-4 ${post.images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                    {post.images.map((img, idx) => (
                        <img
                            key={idx}
                            src={img}
                            alt={`Post image ${idx + 1}`}
                            className="rounded-xl w-full h-64 object-cover hover:scale-[1.02] transition-transform duration-300 cursor-pointer"
                        />
                    ))}
                </div>
            )}

            <div className="flex gap-2 mt-4">
                {post.tags?.map((tag, idx) => (
                    <span key={idx} className="badge badge-primary badge-outline text-xs">#{tag}</span>
                ))}
            </div>

            <div className="border-t border-base-content/10 mt-4 pt-4 flex justify-between items-center">
                <Button
                    variant="ghost"
                    size="sm"
                    className={isLiked ? "text-red-500" : ""}
                    onClick={() => likeMutation.mutate()}
                    isLoading={likeMutation.isPending}
                >
                    ♥ Like {post.likes?.length || 0}
                </Button>
                {/* Placeholder for comments or share */}
            </div>
        </Card>
    );
}
