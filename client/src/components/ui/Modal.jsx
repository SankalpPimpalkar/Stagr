import { useEffect, useRef } from "react";
import clsx from "clsx";
import { createPortal } from "react-dom";

export function Modal({ isOpen, onClose, title, children, className }) {
    const dialogRef = useRef(null);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        if (isOpen) {
            dialog.showModal();
        } else {
            dialog.close();
        }
    }, [isOpen]);

    const handleBackdropClick = (e) => {
        if (e.target === dialogRef.current) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return createPortal(
        <dialog
            ref={dialogRef}
            className="modal modal-bottom sm:modal-middle backdrop-blur-sm"
            onClick={handleBackdropClick}
        >
            <div className={clsx("modal-box bg-base-100/90 border border-white/10 shadow-2xl", className)}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg">{title}</h3>
                    <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost">✕</button>
                </div>
                {children}
            </div>
            <form method="dialog" className="modal-backdrop">
                <button onClick={onClose}>close</button>
            </form>
        </dialog>,
        document.body
    );
}
