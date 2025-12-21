import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { userAPI } from "../../utils/api";
import { Modal } from "../ui/Modal";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";

export function SetUsernameModal({ isOpen, onSuccess }) {
    const [username, setUsername] = useState("");
    const [isAvailable, setIsAvailable] = useState(null); // null, true, false
    const [checking, setChecking] = useState(false);
    const [error, setError] = useState("");

    // Debounce check
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (username.length >= 3) {
                setChecking(true);
                try {
                    const { isAvailable } = await userAPI.checkUsernameAvailability(username);
                    setIsAvailable(isAvailable);
                    setError(isAvailable ? "" : "Username is already taken");
                } catch (err) {
                    console.error(err);
                    setError("Error checking availability");
                } finally {
                    setChecking(false);
                }
            } else {
                setIsAvailable(null);
                if (username.length > 0) setError("Username must be at least 3 characters");
                else setError("");
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [username]);

    const updateUsernameMutation = useMutation({
        mutationFn: (newUsername) => userAPI.updateUsername(newUsername),
        onSuccess: () => {
            if (onSuccess) onSuccess();
        },
        onError: (err) => {
            setError(err.response?.data?.message || "Failed to update username");
        }
    });

    const handleSubmit = () => {
        if (isAvailable) {
            updateUsernameMutation.mutate(username);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={() => { }} // Non-cancellable
            title="Set Your Username"
        >
            <div className="space-y-6 mt-4">
                <p className="text-base-content/70">
                    Welcome to Stagr! Please choose a unique username to get started.
                    This will be your unique identity on the platform.
                </p>

                <div className="relative">
                    <Input
                        label="Choose Username"
                        value={username}
                        onChange={(e) => {
                            const val = e.target.value.toLowerCase().replace(/[^a-z0-9_.]/g, '');
                            setUsername(val);
                        }}
                        placeholder="e.g. durgesh.prasad"
                        error={error}
                        autoFocus
                    />

                    {/* Status Indicator Positioned relative to the input field which is approx 3rem height + label */}
                    <div className="absolute z-10 right-3 top-8 flex items-center bg-base-100 pl-2">
                        {checking && (
                            <span className="loading loading-spinner loading-xs text-primary"></span>
                        )}

                        {!checking && isAvailable === true && username.length >= 3 && (
                            <div className="flex items-center gap-1 text-success text-sm font-medium animate-in fade-in">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Available
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-end gap-2 mt-2">
                    <Button
                        variant="primary"
                        onClick={handleSubmit}
                        isLoading={updateUsernameMutation.isPending}
                        disabled={!isAvailable || checking || updateUsernameMutation.isPending}
                    >
                        {updateUsernameMutation.isPending ? "Setting Username..." : "Continue"}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
