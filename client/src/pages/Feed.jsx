import { useQuery, useQueryClient } from "@tanstack/react-query"
import { postAPI, userAPI } from "../utils/api"
import { PostCard } from "../components/PostCard"
import { SetUsernameModal } from "../components/user/SetUsernameModal"

export default function Feed() {
    const queryClient = useQueryClient();

    const { data: postsData, isLoading: isPostsLoading } = useQuery({
        queryKey: ["posts"],
        queryFn: () => postAPI.getAllPosts(),
    })

    const { data: userData } = useQuery({
        queryKey: ["currentUser"],
        queryFn: () => userAPI.getCurrentUser(),
        retry: false
    })
    const posts = postsData?.posts || []
    const currentUser = userData?.user;
    const shouldShowUsernameModal = currentUser && !currentUser.username;
    console.log(currentUser, shouldShowUsernameModal, "userData")

    if (isPostsLoading) return (
        <div className="flex justify-center mt-20">
            <span className="loading loading-bars loading-lg text-primary"></span>
        </div>
    )

    return (
        <div className="w-full max-w-xl mx-auto pb-20">
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
                    <div className="text-center py-20 opacity-50">
                        <h2 className="text-2xl font-bold mb-2">No posts yet</h2>
                        <p>Be the first to create one!</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {posts.map(post => (
                            <PostCard key={post._id} post={post} />
                        ))}
                    </div>
                )
            }
        </div>
    )
}
