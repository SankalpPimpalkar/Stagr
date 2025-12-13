import clsx from 'clsx';

export function Button({
    children,
    variant = "primary", // primary, secondary, ghost, outline, danger
    size = "md", // sm, md, lg
    className,
    isLoading,
    ...props
}) {
    const baseClass = "btn no-animation transition-all duration-300 transform hover:scale-105 active:scale-95";

    // DaisyUI variants
    const variants = {
        primary: "btn-primary bg-gradient-to-r from-primary to-accent border-none text-white hover:shadow-lg hover:shadow-primary/50",
        secondary: "btn-secondary",
        ghost: "btn-ghost hover:bg-base-content/10",
        outline: "btn-outline border-base-content/20 hover:bg-base-content/10 hover:border-base-content/40 hover:text-base-content",
        danger: "btn-error text-white"
    };

    const sizes = {
        sm: "btn-sm text-xs",
        md: "btn-md",
        lg: "btn-lg text-lg"
    };

    return (
        <button
            className={clsx(
                baseClass,
                variants[variant],
                sizes[size],
                className,
                { "btn-disabled opacity-50": isLoading }
            )}
            disabled={isLoading}
            {...props}
        >
            {isLoading && <span className="loading loading-spinner"></span>}
            {children}
        </button>
    );
}
