import { useQuery } from "@tanstack/react-query"
import { postAPI } from "../utils/api"

export default function Feed() {

    const { data: postsData, isLoading } = useQuery({
        queryKey: ["posts"],
        queryFn: postAPI.getAllPosts
    })
    const posts = postsData?.posts || []

    if (isLoading) return <span className="loading-bars loading-xl" />

    return (
        <div className="w-full h-screen flex items-center justify-center">
            {
                posts?.length === 0 ? (
                    <p className="text-base-200 font-semibold text-sm">
                        There are no posts yet
                    </p>
                ) : (
                    <ul>
                        {
                            posts?.map(post => (
                                <li key={post._id}>
                                    {post.description}
                                </li>
                            ))
                        }
                    </ul>
                )
            }
        </div>
    )
}
