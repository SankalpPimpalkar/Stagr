import { useState } from "react";
import { Avatar } from "../ui/Avatar";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tagAPI } from "../../utils/api";
import { useCurrentUser } from "../../hooks/user";

export function TagCard({ tag }) {
    const { user } = useCurrentUser();
    const queryClient = useQueryClient();
    const isLiked = tag.likes?.includes(user?._id);

    const likeMutation = useMutation({
        mutationFn: () => tagAPI.toggleLikeTag(tag._id),
        onSuccess: () => {
            queryClient.invalidateQueries(["tags"]);
            queryClient.invalidateQueries(["stories"]); // In case it affects story view
        }
    });

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        });
    };

    return (
        <div className="border-b border-base-content/10 py-4 hover:bg-base-200/50 transition-colors px-4 -mx-4">
            <div className="flex gap-3">
                <Avatar
                    src={tag.owner?.imageUrl}
                    alt={tag.owner?.username}
                    size="sm"
                    className="mt-1"
                />

                <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-sm">{tag.owner?.username}</span>
                        <span className="text-xs opacity-40">• {formatDate(tag.createdAt)}</span>
                        {tag.story && (
                            <span className="text-xs text-primary/70 bg-primary/10 px-1.5 rounded-full truncate max-w-[100px]">
                                Re: Story
                            </span>
                        )}
                    </div>

                    {/* Content */}
                    <p className="text-sm text-base-content/90 leading-relaxed wrap-break-word whitespace-pre-wrap">
                        {tag.content}
                    </p>

                    {/* Actions */}
                    <div className="mt-3 flex items-center gap-4">
                        <button
                            onClick={() => likeMutation.mutate()}
                            className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${isLiked ? "text-pink-500" : "text-base-content/40 hover:text-pink-500"}`}
                        >
                            {isLiked ? (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                    <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                                </svg>
                            )}
                            {tag.likes?.length || 0}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
