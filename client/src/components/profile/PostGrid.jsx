import { useNavigate } from "react-router";

export function PostGrid({ posts, onPostClick }) {
    if (!posts || posts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-32 opacity-60 animate-in fade-in zoom-in duration-700">
                <div className="w-24 h-24 bg-base-200 rounded-full flex items-center justify-center mb-6 shadow-inner">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-10 h-10 opacity-50">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                </div>
                <h3 className="text-2xl font-bold tracking-tight">The Gallery is Empty</h3>
                <p className="text-base-content/60 mt-2">When you share moments, they will appear here.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-3 gap-1 md:gap-6 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {posts.map((post, index) => (
                <PostGridItem
                    key={post._id}
                    post={post}
                    onClick={() => onPostClick && onPostClick(index)}
                />
            ))}
        </div>
    );
}

function PostGridItem({ post, onClick }) {
    const hasImage = post.images && post.images.length > 0;

    return (
        <div
            className="aspect-square relative group cursor-pointer bg-base-200 overflow-hidden rounded-md md:rounded-3xl shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ease-[cubic-bezier(0.25,0.8,0.25,1)]"
            onClick={onClick}
        >
            {hasImage ? (
                <img
                    src={post.images[0]}
                    alt="Post thumbnail"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center p-6 bg-linear-to-br from-base-200 to-base-300 group-hover:from-primary/10 group-hover:to-secondary/10 transition-colors duration-500">
                    <p className="text-xs md:text-base line-clamp-4 text-center font-medium opacity-60 group-hover:opacity-100 transition-opacity font-serif italic leading-relaxed">
                        {post.description}
                    </p>
                </div>
            )}

            {/* Premium Hover Overlay */}
            <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-6 text-white font-bold">
                <div className="flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 drop-shadow-lg">
                        <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                    </svg>
                    <span className="text-xl drop-shadow-md">{post.likes?.length || 0}</span>
                </div>
            </div>

            {hasImage && post.images.length > 1 && (
                <div className="absolute top-3 right-3">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white drop-shadow-md opacity-80">
                        <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" />
                    </svg>
                </div>
            )}
        </div>
    );
}
