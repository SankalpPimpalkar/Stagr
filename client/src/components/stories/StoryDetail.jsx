import { Link } from "react-router";
import { Avatar } from "../ui/Avatar";
import { TagList } from "../tags/TagList";
import { TagInput } from "../tags/TagInput";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { storyAPI, tagAPI } from "../../utils/api";
import { useCurrentUser } from "../../hooks/user";
import { useNavigate } from "react-router-dom";

export function StoryDetail({ story }) {
    const { user } = useCurrentUser();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    console.log(story, "000story");
    // Fetch tags for this story
    const { data: tags, isLoading: tagsLoading } = useQuery({
        queryKey: ["story-tags", story?.story?._id],
        queryFn: () => tagAPI.getTagsByStory(story?.story?._id),
        enabled: !!story?.story?._id,
    });
    console.log(tags, "tags");
    const isLiked = story?.story?.likes?.includes(user?._id);

    const likeMutation = useMutation({
        mutationFn: () => storyAPI.toggleLikeStory(story?.story?._id),
        onSuccess: () => {
            queryClient.invalidateQueries(["story", story?.story?._id]);
        }
    });

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric"
        });
    };
    const handleUserClick = (username) => {
        navigate(`/u/${username}`);
    };
    return (
        <div className="max-w-3xl mx-auto w-full pb-20 animate-in fade-in duration-500">
            {/* Back Navigation */}
            <Link to="/stories" className="inline-flex items-center gap-2 text-sm opacity-60 hover:opacity-100 transition-opacity mb-8">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                Back to Stories
            </Link>

            {/* Header / Cover */}
            <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-8">
               {story?.story?.title}
            </h1>

            <div className="flex items-center justify-between mb-8 border-t border-b border-base-content/10 py-6">
                <div className="flex items-center gap-4" onClick={() => handleUserClick(story?.story?.owner?.username)}>
                    <Avatar
                        src={story?.story?.owner?.imageUrl}
                        alt={story?.story?.owner?.username}
                        size="md"
                    />
                    <div>
                        <div className="font-bold">{story?.story?.owner?.username}</div>
                        <div className="text-xs opacity-60">Published on {formatDate(story?.story?.createdAt)}</div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => likeMutation.mutate()}
                        className={`flex items-center gap-2 transition-colors ${isLiked ? "text-primary" : "opacity-60 hover:opacity-100"}`}
                    >
                        {isLiked ? (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                            </svg>
                        )}
                        <span className="font-bold text-sm">{story.likes?.length || 0}</span>
                    </button>
                </div>
            </div>

            {story?.story?.coverImage && (
                <div className="w-full aspect-2/1 bg-base-200 rounded-3xl overflow-hidden mb-12 shadow-xl">
                    <img
                        src={story?.story?.coverImage}
                        alt={story?.story?.title}
                        className="w-full h-full object-cover"
                    />
                </div>
            )}

            {/* Content Body */}
            <article className="prose prose-lg prose-invert max-w-none font-serif leading-loose opacity-90 mb-20 whitespace-pre-wrap">
                {story?.story?.content}
            </article>

            {/* Tags Section */}
            <div className="border-t border-base-content/10 pt-10">
                <h3 className="text-xl font-bold mb-6">Thoughts ({tags?.tags?.length || 0})</h3>

                <div className="mb-10">
                    <TagInput storyId={story?.story?._id} />
                </div>

                <div className="ml-4 md:ml-0">
                    <TagList tags={tags?.tags} isLoading={tagsLoading} emptyMessage="Be the first to share a thought." />
                </div>
            </div>
        </div>
    );
}
