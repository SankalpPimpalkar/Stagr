import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { storyAPI } from "../utils/api";
import { StoryDetail } from "../components/stories/StoryDetail";

export default function StoryDetailPage() {
    const { id } = useParams();

    const { data: story, isLoading, error } = useQuery({
        queryKey: ["story", id],
        queryFn: () => storyAPI.getStoryById(id),
        enabled: !!id,
    });
    console.log(id, story?.story, 'story detail page');
    if (isLoading) {
        return (
            <div className="w-full max-w-3xl mx-auto space-y-8 pt-10">
                <div className="h-12 w-3/4 bg-base-200 rounded-lg animate-pulse" />
                <div className="h-96 w-full bg-base-200 rounded-3xl animate-pulse" />
                <div className="space-y-4">
                    <div className="h-4 w-full bg-base-200 rounded animate-pulse" />
                    <div className="h-4 w-full bg-base-200 rounded animate-pulse" />
                    <div className="h-4 w-2/3 bg-base-200 rounded animate-pulse" />
                </div>
            </div>
        );
    }

    if (error || !story) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold mb-2">Story not found</h2>
                <p className="opacity-60">The story you're looking for doesn't exist.</p>
            </div>
        );
    }

    return <StoryDetail story={story} />;
}
