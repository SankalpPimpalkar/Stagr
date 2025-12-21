import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postAPI } from "../utils/api";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { FeedItem } from "../components/feed/FeedItem";
import { useCurrentUser } from "../hooks/user";

export default function CreatePost() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { user: currentUser } = useCurrentUser();
    const fileInputRef = useRef(null);

    const [description, setDescription] = useState("");
    const [tags, setTags] = useState("");
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);
    const [error, setError] = useState("");
    const [isDragging, setIsDragging] = useState(false);

    const createPostMutation = useMutation({
        mutationFn: (formData) => postAPI.createPost(formData),
        onSuccess: () => {
            queryClient.invalidateQueries(["posts"]);
            navigate("/");
        },
        onError: (err) => {
            setError(err.response?.data?.message || "Failed to create post");
        }
    });

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        processFiles(files);
    };

    const processFiles = (files) => {
        if (files.length === 0) return;

        const validFiles = files.filter(file => file.type.startsWith("image/"));
        if (validFiles.length < files.length) {
            setError("Some files were skipped. Only images are allowed.");
        }

        setSelectedFiles(prev => [...prev, ...validFiles]);

        // Create previews
        const newPreviews = validFiles.map(file => URL.createObjectURL(file));
        setPreviewUrls(prev => [...prev, ...newPreviews]);

        if (validFiles.length > 0) setError("");
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
        processFiles(Array.from(e.dataTransfer.files));
    };

    const removeFile = (index) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
        setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (selectedFiles.length === 0) {
            setError("Please select at least one visual for your story.");
            return;
        }

        const formData = new FormData();
        formData.append("description", description);

        // Tags handling
        const tagsArray = tags.split(",").map(t => t.trim()).filter(Boolean);
        tagsArray.forEach(tag => formData.append("tags", tag));

        selectedFiles.forEach(file => {
            formData.append("images", file);
        });

        createPostMutation.mutate(formData);
    };

    // Mock post object for preview
    const previewPost = {
        _id: "preview",
        description: description || "Your caption will appear here...",
        images: previewUrls.length > 0 ? previewUrls : [],
        tags: tags.split(",").map(t => t.trim()).filter(Boolean),
        owner: currentUser || { username: "You", imageUrl: "" },
        likes: [],
        createdAt: new Date().toISOString(),
        location: "Stagr Studio"
    };

    return (
        <div className="max-w-6xl mx-auto py-6 px-4 pb-20 md:py-8 h-full md:min-h-[80vh] flex flex-col items-center justify-center">
            <div className="w-full text-center mb-8 md:mb-10">
                <h1 className="text-3xl md:text-5xl font-bold bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
                    Studio
                </h1>
                <p className="opacity-60 text-sm md:text-base">Craft your next masterpiece.</p>
            </div>

            <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20 items-start">
                {/* Creation Tools */}
                <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-left-4 duration-700">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="alert alert-error text-sm py-2 rounded-xl">
                                <span>{error}</span>
                            </div>
                        )}

                        {/* Drag and Drop Visual Uploader */}
                        <div
                            className={`relative group h-52 md:h-64 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center text-center p-6 transition-all duration-300 cursor-pointer overflow-hidden
                                ${isDragging ? "border-primary bg-primary/5 scale-[1.02]" : "border-base-content/10 hover:border-primary/50 hover:bg-base-200/50"}
                            `}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                                ref={fileInputRef}
                            />

                            {previewUrls.length > 0 ? (
                                <div className="grid grid-cols-3 gap-2 w-full h-full p-2 overflow-y-auto no-scrollbar">
                                    {previewUrls.map((url, idx) => (
                                        <div key={idx} className="relative aspect-square">
                                            <img src={url} alt="Preview" className="w-full h-full object-cover rounded-xl" />
                                            <button
                                                type="button"
                                                onClick={(e) => { e.stopPropagation(); removeFile(idx); }}
                                                className="absolute top-1 right-1 btn btn-xs btn-circle btn-error opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                    <div className="flex items-center justify-center border-2 border-dashed border-base-content/10 rounded-xl aspect-square hover:bg-base-content/5 transition-colors">
                                        <span className="text-2xl opacity-50">+</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-2 pointer-events-none">
                                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-base-200 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 md:w-8 md:h-8 opacity-50">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                        </svg>
                                    </div>
                                    <p className="font-bold text-base md:text-lg">Drag visuals here</p>
                                    <p className="text-xs md:text-sm opacity-50">or click to browse</p>
                                </div>
                            )}
                        </div>

                        <div className="space-y-4">
                            <textarea
                                placeholder="What's the story?"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full bg-transparent text-lg md:text-xl font-serif border-b border-base-content/10 focus:border-primary focus:outline-none py-4 px-2 min-h-[100px] resize-none transition-colors"
                            />

                            <Input
                                placeholder="Tags (comma separated)..."
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                                className="bg-transparent border-none border-b border-base-content/10 rounded-none px-2 focus:ring-0 focus:border-primary"
                            />
                        </div>

                        <div className="pt-4 md:pt-8 content-center">
                            <Button
                                type="submit"
                                className="w-full md:w-auto md:px-12 rounded-full py-4 text-lg font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                                size="lg"
                                isLoading={createPostMutation.isPending}
                            >
                                Publish
                            </Button>
                        </div>
                    </form>
                </div>

                {/* Live Preview */}
                <div className="sticky top-24 animate-in fade-in slide-in-from-right-4 duration-700 hidden lg:block">
                    <div className="relative">
                        <div className="absolute -inset-4 bg-linear-to-r from-primary to-secondary opacity-10 blur-3xl rounded-full"></div>
                        <div className="relative pointer-events-none select-none filter drop-shadow-2xl">
                            <div className="bg-base-100/50 backdrop-blur-sm rounded-[2.5rem] p-6 border border-white/10">
                                <h3 className="text-xs font-bold uppercase tracking-widest opacity-40 mb-6 text-center">Live Preview</h3>
                                <FeedItem post={previewPost} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Preview (Simplified) */}
                <div className="lg:hidden mt-8 border-t border-base-content/5 pt-8">
                    <h3 className="text-sm font-bold opacity-50 mb-4 uppercase tracking-widest">Story Preview</h3>
                    <div className="pointer-events-none opacity-80 scale-95 origin-top-left">
                        <FeedItem post={previewPost} />
                    </div>
                </div>
            </div>
        </div>
    );
}
