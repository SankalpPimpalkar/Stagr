import clsx from "clsx";

export function Avatar({ src, alt, size = "md", className }) {
    const sizes = {
        sm: "w-8 h-8",
        md: "w-12 h-12",
        lg: "w-24 h-24",
        xl: "w-32 h-32"
    };

    return (
        <div className={clsx("avatar", className)}>
            <div className={clsx("rounded-full ring ring-primary ring-offset-base-100 ring-offset-2", sizes[size])}>
                <img src={src || `https://ui-avatars.com/api/?name=${alt || "User"}&background=random`} alt={alt} />
            </div>
        </div>
    );
}
