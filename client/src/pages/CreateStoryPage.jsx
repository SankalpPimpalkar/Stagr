import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { storyAPI } from "../utils/api";
import { useCurrentUser } from "../hooks/user";

export default function CreateStoryPage() {
    const navigate = useNavigate();
    const { user } = useCurrentUser();
    const queryClient = useQueryClient();
    const fileInputRef = useRef(null);

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState("");

    const createStoryMutation = useMutation({
        mutationFn: (formData) => storyAPI.createStory(formData),
        onSuccess: () => {
            queryClient.invalidateQueries(["stories"]);
            navigate("/stories");
        },
        onError: (err) => {
            setError(err.response?.data?.message || "Failed to create story");
        }
    });

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) processFile(file);
    };

    const processFile = (file) => {
        if (!file.type.startsWith("image/")) {
            setError("Only image files are allowed.");
            return;
        }
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
        setError("");
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) processFile(file);
    };

    const removeFile = () => {
        setSelectedFile(null);
        setPreviewUrl("");
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) {
            setError("Title and content are required.");
            return;
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("content", content);

        if (selectedFile) {
            formData.append("coverImage", selectedFile);
        } else {
            // If manual URL entry was supported, we'd handle it, but we replaced it. 
            // Ideally stories should have covers.
            // If validation requires it, we should block.
            // Assuming optional for now or user must upload.
        }

        createStoryMutation.mutate(formData);
    };

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-[60vh] flex-col gap-4">
                <h2 className="text-2xl font-bold">Sign in to write a story</h2>
                <Link to="/sign-in" className="btn btn-primary">Sign In</Link>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto pb-20 animate-in fade-in duration-500">
            <Link to="/stories" className="inline-flex items-center gap-2 text-sm opacity-60 hover:opacity-100 transition-opacity mb-8">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                Back to Stories
            </Link>

            <h1 className="text-3xl font-bold mb-8">Write a Story</h1>

            <form onSubmit={handleSubmit} className="space-y-8">
                {error && (
                    <div className="alert alert-error text-sm py-2 rounded-xl">
                        <span>{error}</span>
                    </div>
                )}

                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text font-bold">Cover Image</span>
                    </label>

                    <div
                        className={`relative group h-64 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center text-center p-6 transition-all duration-300 cursor-pointer overflow-hidden
                            ${isDragging ? "border-primary bg-primary/5 scale-[1.02]" : "border-base-content/10 hover:border-primary/50 hover:bg-base-200/50"}
                        `}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                            ref={fileInputRef}
                        />

                        {previewUrl ? (
                            <div className="relative w-full h-full">
                                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover rounded-xl" />
                                <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); removeFile(); }}
                                    className="absolute top-2 right-2 btn btn-sm btn-circle btn-error opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                >
                                    ✕
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-2 pointer-events-none">
                                <div className="w-16 h-16 rounded-full bg-base-200 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 opacity-50">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                    </svg>
                                </div>
                                <p className="font-bold text-lg">Drag cover image here</p>
                                <p className="text-sm opacity-50">or click to browse</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text font-bold">Title</span>
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter a captivating title..."
                        className="input input-bordered w-full text-lg font-bold"
                        required
                    />
                </div>

                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text font-bold">Content</span>
                    </label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Tell your story..."
                        className="textarea textarea-bordered h-96 w-full font-serif leading-relaxed text-lg p-6"
                        required
                    />
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        className="btn btn-primary rounded-full px-8"
                        disabled={createStoryMutation.isPending}
                    >
                        {createStoryMutation.isPending ? "Publishing..." : "Publish Story"}
                    </button>
                </div>
            </form>
        </div>
    );
}
