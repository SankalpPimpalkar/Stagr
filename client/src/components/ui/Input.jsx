import clsx from "clsx";

export function Input({ label, type = "text", error, className, ...props }) {
    return (
        <div className="form-control w-full">
            {label && (
                <label className="label">
                    <span className="label-text font-medium opacity-70">{label}</span>
                </label>
            )}
            <input
                type={type}
                className={clsx(
                    "input input-bordered w-full bg-base-200/50 focus:bg-base-100 transition-colors focus:border-primary/50 focus:ring-2 focus:ring-primary/20",
                    { "input-error": error },
                    className
                )}
                {...props}
            />
            {error && (
                <label className="label">
                    <span className="label-text-alt text-error">{error}</span>
                </label>
            )}
        </div>
    );
}
