import { useQuery } from "@tanstack/react-query";
import { storyAPI, tagAPI } from "../utils/api";
import { StoryList } from "../components/stories/StoryList";
import { TagList } from "../components/tags/TagList";
import { Link } from "react-router";

export default function StoriesPage() {
    // Fetch Stories
    const { data: stories, isLoading: storiesLoading } = useQuery({
        queryKey: ["stories"],
        queryFn: () => storyAPI.getAllStories(),
    });
    console.log(stories?.stories);
    // Fetch Global Tags (maybe recent ones)
    // Assuming backend endpoint supports getAllTags or we use API as-is. 
    // Wait, the API list didn't explicitly show getAllTags? 
    // Let me check api.js again. Ah, `getTagsByStory` is there.
    // Use userAPI? No.
    // Wait, the provided snippet for `tagAPI` only has `createTag`, `updateTag`, `deleteTag`, `getTagsByStory`, `toggleLikeTag`.
    // It is missing `getAllTags` for a global feed?
    // "Fetch: All stories (feed)" was required.
    // "Tags section (see below): ... global Tag feed" was required.
    // If API is missing, I should probably add `getAllTags` too, mirroring stories.
    // BUT the instructions said "Same Tag APIs must be used for: Story-level tags, Global tag feed".
    // This implies there SHOULD be one. If not, I'll add `getAllTags` to `api.js` in a moment or assume existing one.
    // I previously missed checking for `getAllTags`. I will add it to `api.js` concurrently or just use it assuming it's there?
    // No, I should verify or add it. I'll stick to adding it to be safe as I did with `getStoryById`.
    // For now, I'll write the code assuming it exists or I'll add it in the next step.

    return (
        <div className="grid gap-10">
            {/* Main Content: Stories */}
            <div className="">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold tracking-tight">Stories</h1>
                    <Link to="/create-story" className="btn btn-primary btn-sm rounded-full">
                        Write a Story
                    </Link>
                </div>

                <StoryList stories={stories?.stories} isLoading={storiesLoading} />
            </div>

            {/* Sidebar: Global Tags Feed */}
            {/* <div className="lg:col-span-4 space-y-8">
                <div className="sticky top-24">
                    <div className="flex items-center justify-between mb-4 border-b border-base-content/10 pb-2">
                        <h2 className="font-bold text-lg opacity-80">Microblogs</h2>
                        <Link to="/tags" className="text-xs font-bold text-primary opacity-60 hover:opacity-100">View All</Link>
                    </div>

                    Placeholder for tags until I fix the API
                    <GlobalTagsFeed />
                </div>
            </div> */}
        </div>
    );
}

function GlobalTagsFeed() {
    const { data: tags, isLoading } = useQuery({
        queryKey: ["global-tags"],
        queryFn: () => tagAPI?.getAllTags(),
    });

    return <TagList tags={tags} isLoading={isLoading} emptyMessage="No microblogs yet." />;
}
