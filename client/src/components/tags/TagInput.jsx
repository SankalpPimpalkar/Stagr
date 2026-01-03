import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tagAPI } from "../../utils/api";
import { useCurrentUser } from "../../hooks/user";
import { Avatar } from "../ui/Avatar";

export function TagInput({ storyId, onTagCreated }) {
    const { user } = useCurrentUser();
    const [content, setContent] = useState("");
    const queryClient = useQueryClient();

    const createTagMutation = useMutation({
        mutationFn: (newTag) => tagAPI.createTag(newTag),
        onSuccess: () => {
            setContent("");
            queryClient.invalidateQueries(["tags"]);
            if (storyId) queryClient.invalidateQueries(["story-tags", storyId]);
            if (onTagCreated) onTagCreated();
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!content.trim()) return;

        createTagMutation.mutate({
            content,
            storyId: storyId || null
        });
    };

    if (!user) return (
        <div className="text-center p-4 bg-base-200/50 rounded-xl text-sm opacity-70">
            Sign in to add a tag.
        </div>
    );

    return (
        <form onSubmit={handleSubmit} className="flex gap-3 pt-4 pb-2">
            <Avatar
                src={user.imageUrl}
                alt={user.username}
                size="sm"
            />
            <div className="flex-1 relative">
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={storyId ? "Share your thoughts on this story..." : "What's happening?"}
                    className="w-full bg-transparent border-0 focus:ring-0 p-0 text-base resize-none min-h-[80px]"
                    maxLength={280}
                />

                <div className="flex items-center justify-between mt-2 border-t border-base-content/5 pt-2">
                    <span className={`text-xs ${content.length > 250 ? "text-warning" : "opacity-40"}`}>
                        {content.length}/280
                    </span>
                    <button
                        type="submit"
                        disabled={!content.trim() || createTagMutation.isPending}
                        className="btn btn-primary btn-sm rounded-full px-4"
                    >
                        {createTagMutation.isPending ? "Posting..." : "Post Tag"}
                    </button>
                </div>
            </div>
        </form>
    );
}
