import { useQuery } from "@tanstack/react-query"
import { postAPI } from "../utils/api"
import { PostCard } from "../components/PostCard"

export default function Feed() {

    const { data: postsData, isLoading } = useQuery({
        queryKey: ["posts"],
        queryFn: () => postAPI.getAllPosts(),
    })
    const posts = postsData?.posts || []
    console.log(posts)

    if (isLoading) return (
        <div className="flex justify-center mt-20">
            <span className="loading loading-bars loading-lg text-primary"></span>
        </div>
    )

    return (
        <div className="w-full max-w-xl mx-auto pb-20">
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
