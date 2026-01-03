import { StoryCard } from "./StoryCard";

export function StoryList({ stories, isLoading }) {
    if (isLoading) {
        return (
            <div className="space-y-8">
                {[1, 2].map((i) => (
                    <div key={i} className="w-full h-96 bg-base-200 rounded-3xl animate-pulse" />
                ))}
            </div>
        );
    }

    if (!stories || stories.length === 0) {
        return (
            <div className="text-center py-20 opacity-60">
                <p className="text-xl font-serif italic">No stories yet.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            {stories?.map((story) => (
                <StoryCard key={story._id} story={story} />
            ))}
        </div>
    );
}
