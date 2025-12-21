import { Avatar } from "../ui/Avatar";
import { Button } from "../ui/Button";

export function ProfileHeader({ user, isOwnProfile, onEditProfile, postCount }) {
    if (!user) return null;

    return (
        <div className="w-full mb-10">
            {/* Desktop / Tablet Layout */}
            <div className="hidden md:flex gap-12 items-start px-4">
                <div className="shrink-0">
                    <Avatar
                        src={user.imageUrl}
                        alt={user.username}
                        size="xl"
                        className="w-40 h-40 ring-4 ring-base-100 ring-offset-4 ring-offset-base-200/50"
                    />
                </div>

                <div className="flex-1 pt-2 space-y-5">
                    <div className="flex items-center gap-6">
                        <h1 className="text-2xl font-bold tracking-tight">{user.username}</h1>
                        {isOwnProfile && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={onEditProfile}
                                className="hover:bg-base-200 border-base-content/20 font-medium"
                            >
                                Edit Profile
                            </Button>
                        )}
                    </div>

                    <div className="flex items-center gap-10 text-base">
                        <div className="flex gap-1.5">
                            <span className="font-bold">{postCount}</span>
                            <span className="opacity-70">posts</span>
                        </div>
                        {/* Placeholders for future data */}
                        <div className="flex gap-1.5 opacity-50 cursor-not-allowed" title="Coming soon">
                            <span className="font-bold">0</span>
                            <span>followers</span>
                        </div>
                        <div className="flex gap-1.5 opacity-50 cursor-not-allowed" title="Coming soon">
                            <span className="font-bold">0</span>
                            <span>following</span>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <h2 className="font-bold text-lg leading-tight">{user.name}</h2>
                        <p className="whitespace-pre-wrap text-base-content/90 leading-relaxed max-w-md">
                            {user.bio || "No bio yet."}
                        </p>
                    </div>
                </div>
            </div>

            {/* Mobile Layout */}
            <div className="md:hidden flex flex-col gap-6 px-4">
                <div className="flex items-center gap-6">
                    <Avatar
                        src={user.imageUrl}
                        alt={user.username}
                        className="w-24 h-24 ring-2 ring-base-100 ring-offset-2 ring-offset-base-200/20"
                    />
                    <div className="flex-1 space-y-3">
                        <h1 className="text-xl font-bold truncate">{user.username}</h1>
                        {isOwnProfile && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={onEditProfile}
                                className="w-full justify-center"
                            >
                                Edit Profile
                            </Button>
                        )}
                    </div>
                </div>

                <div className="space-y-2">
                    <h2 className="font-bold text-base">{user.name}</h2>
                    <p className="whitespace-pre-wrap text-sm text-base-content/80">
                        {user.bio || "No bio yet."}
                    </p>
                </div>

                <div className="flex justify-around py-3 border-y border-base-content/5">
                    <div className="flex flex-col items-center">
                        <span className="font-bold text-lg">{postCount}</span>
                        <span className="text-xs opacity-60">posts</span>
                    </div>
                    {/* Placeholders */}
                    <div className="flex flex-col items-center opacity-50">
                        <span className="font-bold text-lg">0</span>
                        <span className="text-xs opacity-60">followers</span>
                    </div>
                    <div className="flex flex-col items-center opacity-50">
                        <span className="font-bold text-lg">0</span>
                        <span className="text-xs opacity-60">following</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
