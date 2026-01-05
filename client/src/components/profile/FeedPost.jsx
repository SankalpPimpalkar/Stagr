import { Avatar } from "../ui/Avatar";
import { Button } from "../ui/Button";
import { ImageCarousel } from "../ui/ImageCarousel";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postAPI } from "../../utils/api";
import { useCurrentUser } from "../../hooks/user";

// Helper to format date
const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
    });
};

export function FeedPost({ post }) {
    const currentUser = useCurrentUser();
    const user = currentUser?.data?.user;
    const queryClient = useQueryClient();

    // Check if liked using current user ID (needs auth context fix for ObjectId vs ClerkId ideally)
    // For now, trusting the array contains something we can match, or just optimistic toggle.
    const isLiked = post.likes?.includes(user?._id);
    const likeMutation = useMutation({
        mutationFn: () => postAPI.toggleLikePost(post._id),
        onSuccess: () => {
            queryClient.invalidateQueries(["posts"]);
            queryClient.invalidateQueries(["user"]); // Incase stats update
        }
    });

    return (
        <div className="bg-base-100 border border-base-content/10 rounded-3xl overflow-hidden shadow-sm mb-8">
            {/* Header */}
            <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Avatar src={post.owner?.imageUrl} alt={post.owner?.username} size="sm" />
                    <div>
                        <h3 className="font-bold text-sm leading-none">{post.owner?.name}</h3>
                        <p className="text-xs text-base-content/50">{post.location || formatDate(post.createdAt)}</p>
                    </div>
                </div>
                <button className="btn btn-ghost btn-xs btn-circle opacity-50">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                    </svg>
                </button>
            </div>

            {/* Media Carousel */}
            <div className="aspect-square bg-base-200">
                {post.images && post.images.length > 0 ? (
                    <ImageCarousel images={post.images} altPrefix={`Post by ${post.owner?.username}`} />
                ) : (
                    <div className="w-full h-full flex items-center justify-center p-8 bg-linear-to-br from-base-200 to-base-300">
                        <p className="text-xl font-serif italic text-base-content/60 text-center">{post.description}</p>
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="p-4 pb-2 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => likeMutation.mutate()}
                        className={`transition-transform active:scale-90 ${isLiked ? "text-red-500" : "text-base-content hover:text-red-500"}`}
                    >
                        {isLiked ? (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
                                <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                            </svg>
                        )}
                    </button>
                    <button className="text-base-content hover:text-primary transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
                        </svg>
                    </button>
                    <button className="text-base-content hover:text-primary transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                        </svg>
                    </button>
                </div>
                <button className="text-base-content hover:text-primary transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                    </svg>
                </button>
            </div>

            {/* Details */}
            <div className="px-4 pb-6">
                <p className="font-bold text-sm mb-2">{post.likes?.length || 0} likes</p>
                <div className="space-y-1">
                    <p className="text-sm">
                        <span className="font-bold mr-2">{post.owner?.username}</span>
                        {post.description}
                    </p>
                    {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                            {post.tags.map((tag, i) => (
                                <span key={i} className="text-xs text-primary cursor-pointer hover:underline">#{tag}</span>
                            ))}
                        </div>
                    )}
                </div>
                <p className="text-xs text-base-content/50 mt-3 uppercase tracking-wide">
                    {formatDate(post.createdAt)}
                </p>
            </div>
        </div>
    );
}
