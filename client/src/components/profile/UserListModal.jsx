import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Avatar } from "../ui/Avatar";
import { useNavigate } from 'react-router-dom';

export function UserListModal({
    isOpen,
    onClose,
    title,
    followersData,
    followingData,
    isLoading = false
}) {
    const modalRef = useRef(null);
    const navigate = useNavigate();
    const [users, setUsers] = useState()
    console.log(followersData, 'followersDataa')
    console.log(followingData, 'followingDataa')
    useEffect(() => {
        if (title === 'Following') {
            setUsers(followingData ?? []);
        } else {
            setUsers(followersData ?? []);
        }
    }, [title, followersData, followingData]);
    console.log(users, 'usersss', title)
    // Close on escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    // Handle outside click
    const handleBackdropClick = (e) => {
        if (modalRef.current && !modalRef.current.contains(e.target)) {
            onClose();
        }
    };

    const handleUserClick = (username) => {
        navigate(`/u/${username}`);
        onClose();
    };

    if (!isOpen) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
            onClick={handleBackdropClick}
        >
            <div
                ref={modalRef}
                className="bg-base-100 w-full max-w-md max-h-[80vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
            >
                {/* Header */}
                <div className="p-5 border-b border-base-content/10 flex justify-between items-center bg-base-100/50 backdrop-blur-xl sticky top-0 z-10">
                    <h3 className="text-xl font-bold text-base-content font-serif">{title}</h3>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-base-200 rounded-full transition-colors text-base-content/60 hover:text-base-content"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* List Content */}
                <div className="overflow-y-auto p-2 scrollbar-hide">
                    {isLoading ? (
                        <div className="flex justify-center items-center py-12">
                            <span className="loading loading-spinner loading-md text-primary"></span>
                        </div>
                    ) : users?.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center px-4">
                            <div className="w-16 h-16 bg-base-200 rounded-full flex items-center justify-center mb-4 text-3xl opacity-50">
                                👥
                            </div>
                            <p className="font-semibold text-lg text-base-content/70">No users found</p>
                            <p className="text-sm text-base-content/50">There is no one here yet.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-1">
                            {users?.map((userItem) => {
                                // Data structure adaptation based on request
                                // userItem might be the direct user object or nested inside 'follower'/'following'
                                const followerUser = title === 'Followers' ? userItem.follower : userItem.following;
                                console.log(followerUser, 'userflooow')
                                // Handle case where 'following' is just an ID (if not populated) - though logic should ensure populated
                                if (typeof followerUser === 'string') return null;

                                return (
                                    <div
                                        key={followerUser._id || Math.random()}
                                        onClick={() => handleUserClick(followerUser.username)}
                                        className="flex items-center gap-4 p-3 hover:bg-base-200/50 rounded-2xl cursor-pointer transition-colors group"
                                    >
                                        <Avatar
                                            src={followerUser.imageUrl}
                                            alt={followerUser.username}
                                            size="md"
                                            className="ring-2 ring-base-100 group-hover:ring-primary/20 transition-all"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-base-content truncate">
                                                {followerUser.name}
                                            </h4>
                                            <p className="text-sm text-base-content/60 truncate">
                                                @{followerUser.username}
                                            </p>
                                        </div>
                                        <button className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-primary">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                            </svg>
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
}
