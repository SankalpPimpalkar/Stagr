import clsx from "clsx";

export function Card({ children, className, ...props }) {
    return (
        <div
            className={clsx(
                "card bg-base-100/40 backdrop-blur-md border border-base-content/10 shadow-xl overflow-hidden",
                className
            )}
            {...props}
        >
            <div className="card-body p-6">
                {children}
            </div>
        </div>
    );
}
