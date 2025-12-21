import { useEffect, useRef } from "react";
import { FeedPost } from "./FeedPost";
import { createPortal } from "react-dom";

export function PostFeedOverlay({ posts, initialIndex, onClose }) {
    const overlayRef = useRef(null);
    const scrollRef = useRef(null);

    // Lock body scroll when overlay is open
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "unset";
        };
    }, []);

    // Scroll to the selected post on mount
    useEffect(() => {
        if (scrollRef.current && initialIndex !== undefined) {
            const postElements = scrollRef.current.children;
            if (postElements[initialIndex]) {
                postElements[initialIndex].scrollIntoView({ behavior: "auto", block: "center" });
            }
        }
    }, [initialIndex]);

    const handleBackdropClick = (e) => {
        if (e.target === overlayRef.current) {
            onClose();
        }
    };

    if (!posts) return null;

    return createPortal(
        <div
            ref={overlayRef}
            onClick={handleBackdropClick}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex justify-center overflow-y-auto animate-in fade-in duration-300"
        >
            <div className="relative w-full max-w-lg md:max-w-xl py-10 px-4 min-h-screen">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="fixed top-6 right-6 z-50 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Feed List */}
                <div ref={scrollRef} className="space-y-6">
                    {posts.map((post) => (
                        <FeedPost key={post._id} post={post} />
                    ))}
                </div>
            </div>
        </div>,
        document.body
    );
}
