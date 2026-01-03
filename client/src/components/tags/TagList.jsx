import { TagCard } from "./TagCard";

export function TagList({ tags, isLoading, emptyMessage = "No tags yet." }) {
    if (isLoading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-3 py-4">
                        <div className="w-8 h-8 rounded-full bg-base-300 animate-pulse" />
                        <div className="flex-1 space-y-2">
                            <div className="h-4 w-1/4 bg-base-300 rounded animate-pulse" />
                            <div className="h-4 w-3/4 bg-base-300 rounded animate-pulse" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (!tags || tags.length === 0) {
        return (
            <div className="py-8 text-center opacity-50 text-sm">
                {emptyMessage}
            </div>
        );
    }

    return (
        <div className="flex flex-col">
            {/* {tags.map((tag) => (
                <TagCard key={tag._id} tag={tag} />
            ))} */}
        </div>
    );
}
