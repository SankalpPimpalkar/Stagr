import { useNavigate } from "react-router";
import { Avatar } from "./ui/Avatar";
import { Card } from "./ui/Card";
import { Button } from "./ui/Button";

export function UserCard({ user }) {
    const navigate = useNavigate();

    return (
        <Card className="flex items-center justify-between p-4 hover:bg-base-200/50 transition-colors">
            <div
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => navigate(`/profile/${user.username}`)}
            >
                <Avatar src={user.imageUrl} alt={user.username} size="md" />
                <div>
                    <h3 className="font-bold">{user.username}</h3>
                    <p className="text-sm opacity-70">{user.name || "User"}</p>
                </div>
            </div>

            <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/profile/${user.username}`)}
            >
                View
            </Button>
        </Card>
    );
}
