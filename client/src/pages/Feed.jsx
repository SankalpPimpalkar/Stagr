import { useQuery, useQueryClient } from "@tanstack/react-query"
import { postAPI } from "../utils/api"
import { FeedItem } from "../components/feed/FeedItem" // Updated import
import { SetUsernameModal } from "../components/user/SetUsernameModal"
import { useCurrentUser } from "../hooks/user"

export default function Feed() {
    const queryClient = useQueryClient();

    const { data: postsData, isLoading: isPostsLoading } = useQuery({
        queryKey: ["posts"],
        queryFn: () => postAPI.getAllPosts(),
    })

    const { user: currentUser } = useCurrentUser();

    const posts = postsData?.posts || []
    const shouldShowUsernameModal = currentUser && !currentUser.username;

    if (isPostsLoading) return (
        <div className="flex justify-center mt-40">
            <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
    )

    return (
        <div className="w-full max-w-lg mx-auto pb-40 px-4 md:px-0 pt-10">
            {shouldShowUsernameModal && (
                <SetUsernameModal
                    isOpen={true}
                    onSuccess={() => {
                        queryClient.invalidateQueries(["currentUser"]);
                    }}
                />
            )}

            {
                posts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-40 opacity-50 space-y-4">
                        <div className="w-20 h-20 bg-base-200 rounded-full flex items-center justify-center animate-pulse">
                            <span className="text-4xl">✨</span>
                        </div>
                        <h2 className="text-3xl font-bold tracking-tight">The Feed is Quiet</h2>
                        <p className="font-serif italic">Be the filmmaker of your own story.</p>
                    </div>
                ) : (
                    <div className="space-y-16">
                        {posts.map(post => (
                            <FeedItem key={post._id} post={post} />
                        ))}
                    </div>
                )
            }
        </div>
    )
}
