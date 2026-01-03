import { Link } from "react-router";
import { Avatar } from "../ui/Avatar";

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
    });
};

export function StoryCard({ story }) {
    if (!story) return null;

    return (
        <div className="group relative border border-base-content/10 rounded-3xl w-full mb-8 animate-in fade-in duration-700 hover:border-base-content/20 transition-colors bg-base-100">
            <Link to={`/stories/${story._id}`} className="block">
                {/* Cover Image */}
                <div className="relative w-full aspect-2/1 bg-base-200 rounded-t-3xl overflow-hidden">
                    {story.coverImage ? (
                        <img
                            src={story.coverImage}
                            alt={story.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-neutral/5">
                            <span className="text-4xl">📝</span>
                        </div>
                    )}
                    <div className="absolute top-4 right-4 bg-base-100/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-base-content/10">
                        Story
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    <h2 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                        {story.title}
                    </h2>

                    <p className="text-base-content/70 font-serif leading-relaxed line-clamp-3 mb-6">
                        {story.content}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center justify-between pt-4 border-t border-base-content/5">
                        <div className="flex items-center gap-3">
                            <Avatar
                                src={story.owner?.imageUrl}
                                alt={story.owner?.username}
                                size="sm"
                            />
                            <div className="flex flex-col text-xs">
                                <span className="font-bold">{story.owner?.username}</span>
                                <span className="opacity-60">{formatDate(story.createdAt)}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 text-xs font-medium opacity-60">
                            <span className="flex items-center gap-1">
                                {story.likes?.length || 0} Likes
                            </span>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
}
