import { useState } from "react";
import { Avatar } from "../ui/Avatar";
import { ImageCarousel } from "../ui/ImageCarousel";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postAPI } from "../../utils/api";
import { useCurrentUser } from "../../hooks/user";

// Helper to format date
const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
    });
};

export function FeedItem({ post }) {
    const { user } = useCurrentUser();
    const queryClient = useQueryClient();
    const [showHeart, setShowHeart] = useState(false);

    const isLiked = post.likes?.includes(user?._id);

    const likeMutation = useMutation({
        mutationFn: () => postAPI.toggleLikePost(post._id),
        onSuccess: () => {
            queryClient.invalidateQueries(["posts"]);
        }
    });

    const handleDoubleTap = (e) => {
        e.stopPropagation(); // Prevent navigation or other clicks
        if (!isLiked) {
            likeMutation.mutate();
        }
        setShowHeart(true);
        setTimeout(() => setShowHeart(false), 1000);
    };

    return (
        <div className="group relative border border-base-content/10 rounded-3xl w-full mb-12 animate-in fade-in duration-700">
            {/* Context Header - Floating above */}
            <div className="flex items-center justify-between px-2 py-2 mb-6">
                <div className="flex items-center gap-3">
                    <Avatar
                        src={post.owner?.imageUrl}
                        alt={post.owner?.username}
                        size="md"
                        className="ring-2 ring-base-100 ring-offset-2 ring-offset-base-100 shadow-md"
                    />
                    <div className="flex flex-col">
                        <span className="font-bold text-base leading-none tracking-tight">{post.owner?.username}</span>
                        {post.location && <span className="text-xs opacity-60 font-serif italic">{post.location}</span>}
                    </div>
                </div>
                <div className="text-xs font-bold tracking-widest opacity-40 uppercase border border-base-content/20 px-2 py-0.5 rounded-full">
                    {formatDate(post.createdAt)}
                </div>
            </div>

            {/* Main Cinematic Stage */}
            <div
                className="relative w-full aspect-6/6 bg-base-200 rounded-3xl overflow-hidden shadow-lg transition-transform duration-500 hover:scale-[1.01]"
                onDoubleClick={handleDoubleTap}
            >
                {/* Media */}
                {post.images && post.images.length > 0 ? (
                    <ImageCarousel images={post.images} altPrefix={`Visual by ${post.owner?.username}`} />
                ) : (
                    <div className="w-full h-full flex items-center justify-center p-10 bg-linear-to-tr from-base-200 via-base-300 to-base-100">
                        <p className="text-2xl md:text-3xl font-serif italic text-base-content/70 text-center leading-relaxed max-w-md">
                            "{post.description}"
                        </p>
                    </div>
                )}

                {/* Double Tap Heart Animation */}
                <div className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300 ${showHeart ? "opacity-100" : "opacity-0"}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-32 h-32 text-white drop-shadow-2xl transition-transform duration-500 ${showHeart ? "scale-110" : "scale-50"}`}>
                        <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                    </svg>
                </div>
            </div>

            {/* Action Bar - Static Pill Below Image */}
            <div className="flex justify-center -mt-6 relative z-10 mb-4">
                <div className="bg-base-100/80 backdrop-blur-xl border border-base-content/10 rounded-full shadow-lg flex items-center justify-around px-8 py-2 gap-8">
                    <button
                        onClick={() => likeMutation.mutate()}
                        className={`group transition-all active:scale-95 ${isLiked ? "text-red-500" : "text-base-content hover:text-primary"}`}
                    >
                        {isLiked ? (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                                <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 group-hover:scale-110 transition-transform">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                            </svg>
                        )}
                    </button>

                    <div className="h-6 w-px bg-base-content/10"></div>

                    <button className="text-base-content hover:text-primary transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3.75h9m-9 3.75h9m-9 3.75h9" />
                        </svg>
                    </button>

                    <div className="h-6 w-px bg-base-content/10"></div>

                    <button className="text-base-content hover:text-primary transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Typography / Caption */}
            <div className="px-4 py-4">
                <div className="flex items-baseline gap-2 mb-2">
                    <span className="font-bold text-sm">{post.likes?.length || 0} likes</span>
                </div>
                {post.description && (
                    <p className="text-base md:text-lg leading-relaxed text-base-content/80 font-serif">
                        <span className="font-sans font-bold text-base-content mr-2">{post.owner?.username}</span>
                        {post.description}
                    </p>
                )}
                {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3 opacity-60">
                        {post.tags.map((tag, i) => (
                            <span key={i} className="text-xs uppercase tracking-widest">#{tag}</span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
