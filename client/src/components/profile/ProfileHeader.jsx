import { Avatar } from "../ui/Avatar";
import { Button } from "../ui/Button";

// Helper to generate a consistent gradient based on username
const getGradient = (username) => {
    const gradients = [
        "from-pink-500 via-red-500 to-yellow-500",
        "from-blue-400 via-indigo-500 to-purple-500",
        "from-green-400 via-teal-500 to-emerald-500",
        "from-orange-400 via-amber-500 to-yellow-500",
        "from-rose-400 via-fuchsia-500 to-indigo-500",
        "from-cyan-400 via-sky-500 to-blue-500",
    ];
    const index = username ? username.charCodeAt(0) % gradients.length : 0;
    return `bg-linear-to-r ${gradients[index]}`;
};

export function ProfileHeader({
    user,
    isOwnProfile,
    onEditProfile,
    postCount,
    followersCount = 0,
    followingCount = 0,
    isFollowing = false,
    onFollow,
    onUnfollow,
    isFollowLoading = false
}) {
    if (!user) return null;

    const bannerGradient = getGradient(user.username);

    return (
        <div className="w-full mb-12 animate-in fade-in duration-500">
            {/* The Canopy: Banner */}
            <div className={`w-full h-48 md:h-64 ${bannerGradient} rounded-3xl shadow-lg relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black/10"></div>
                {/* Decorative circles */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                <div className="absolute bottom-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
            </div>

            {/* Profile Content Wrapper - Overlap Offset */}
            <div className="px-4 md:px-10 -mt-20 relative z-10">
                <div className="flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8">

                    {/* Avatar Group */}
                    <div className="shrink-0 relative group">
                        <div className="p-1.5 bg-base-100 rounded-full shadow-xl">
                            <Avatar
                                src={user.imageUrl}
                                alt={user.username}
                                size="xl"
                                className="w-44 h-44 md:w-44 md:h-44 object-cover"
                            />
                        </div>
                        {isOwnProfile && (
                            <button
                                onClick={onEditProfile}
                                className="absolute bottom-2 right-2 bg-base-100 p-2 rounded-full shadow-lg border border-base-200 text-base-content/70 hover:text-primary transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                    <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
                                    <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
                                </svg>
                            </button>
                        )}
                    </div>

                    {/* Actions & Names */}
                    <div className="flex-1 w-full md:pb-4 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                        <div className="space-y-1">
                            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-base-content font-serif">
                                {user.name}
                            </h1>
                            <p className="text-base md:text-lg font-medium text-base-content/60 font-sans">
                                @{user.username}
                            </p>
                        </div>

                        {/* Follow Button */}
                        {!isOwnProfile && (
                            <Button
                                variant={isFollowing ? "outline" : "primary"}
                                onClick={isFollowing ? onUnfollow : onFollow}
                                isLoading={isFollowLoading}
                                className="min-w-[120px]"
                            >
                                {isFollowing ? "Unfollow" : "Follow"}
                            </Button>
                        )}
                    </div>
                </div>

                {/* Bio & Stats Section */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Bio Column */}
                    <div className="md:col-span-2 w-60">
                        {user.bio ? (
                            <p className="text-lg md:text-xl leading-relaxed text-base-content/90 font-serif whitespace-pre-wrap border-l-4 border-primary/20 pl-4">
                                {user.bio}
                            </p>
                        ) : (
                            <p className="text-base-content/40 italic">Write something about yourself...</p>
                        )}
                    </div>

                    {/* Stats Column */}
                    <div className="flex items-center gap-8 md:justify-end h-full">
                        <div className="flex flex-col items-center md:items-end group cursor-pointer">
                            <span className="text-2xl md:text-3xl font-black font-sans group-hover:text-primary transition-colors">
                                {postCount}
                            </span>
                            <span className="text-xs uppercase tracking-widest text-base-content/50 font-semibold">Posts</span>
                        </div>
                        <div className="flex flex-col items-center md:items-end group cursor-pointer opacity-60 hover:opacity-100 transition-opacity">
                            <span className="text-2xl md:text-3xl font-black font-sans">
                                {followersCount}
                            </span>
                            <span className="text-xs uppercase tracking-widest text-base-content/50 font-semibold">Followers</span>
                        </div>
                        <div className="flex flex-col items-center md:items-end group cursor-pointer opacity-60 hover:opacity-100 transition-opacity">
                            <span className="text-2xl md:text-3xl font-black font-sans">
                                {followingCount}
                            </span>
                            <span className="text-xs uppercase tracking-widest text-base-content/50 font-semibold">Following</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
