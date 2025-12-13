import { useState } from "react";
import { useNavigate } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postAPI } from "../utils/api";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card } from "../components/ui/Card";

export default function CreatePost() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [description, setDescription] = useState("");
    const [tags, setTags] = useState("");
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);
    const [error, setError] = useState("");

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
        if (files.length === 0) return;

        setSelectedFiles(prev => [...prev, ...files]);

        // Create previews
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPreviewUrls(prev => [...prev, ...newPreviews]);
    };

    const removeFile = (index) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
        setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (selectedFiles.length === 0) {
            setError("Please select at least one image.");
            return;
        }

        const formData = new FormData();
        formData.append("description", description);

        // Tags handling
        const tagsArray = tags.split(",").map(t => t.trim()).filter(Boolean);
        tagsArray.forEach(tag => formData.append("tags[]", tag)); // Backend might expect tags[] or just comma separated string depending on multer/body parser. 
        // Checking backend controller: 
        // const { description = "", tags = [] } = req.body;
        // BUT it uses `upload.array("images")`. Multer handles files.
        // Express body parser handles text fields.
        // Usually if passing array in FormData to express: append multiple times with same key "tags" or "tags[]".
        // Let's assume standard "tags" key multiple times works with most parsers or "tags[]".
        // Controller: `tags` comes from req.body.
        // If I append multiple "tags" keys, `req.body.tags` might be an array or single value.
        // Safe bet: JSON stringify it if simple formData logic fails, OR rely on backend parsing.
        // Re-reading backend controller: `req.body` tags defaults to [].
        // Let's append individually.
        tagsArray.forEach(tag => formData.append("tags", tag));

        selectedFiles.forEach(file => {
            formData.append("images", file);
        });

        createPostMutation.mutate(formData);
    };

    return (
        <div className="max-w-xl mx-auto py-8">
            <h1 className="text-3xl font-bold mb-8 text-center bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">Create New Post</h1>

            <Card>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="alert alert-error text-sm py-2">
                            <span>{error}</span>
                        </div>
                    )}

                    <Input
                        label="Description"
                        placeholder="What's on your mind?"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="py-3"
                    />

                    <Input
                        label="Tags (comma separated)"
                        placeholder="future, tech, design"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                    />

                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text font-medium opacity-70">Images</span>
                        </label>
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleFileChange}
                            className="file-input file-input-bordered file-input-primary w-full"
                        />
                    </div>

                    {/* Previews */}
                    {previewUrls.length > 0 && (
                        <div className="grid grid-cols-3 gap-2 mt-4">
                            {previewUrls.map((url, idx) => (
                                <div key={idx} className="relative group aspect-square">
                                    <img src={url} alt="Preview" className="w-full h-full object-cover rounded-lg border border-base-300" />
                                    <button
                                        type="button"
                                        onClick={() => removeFile(idx)}
                                        className="absolute top-1 right-1 btn btn-xs btn-circle btn-error opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="pt-4">
                        <Button
                            type="submit"
                            className="w-full"
                            isLoading={createPostMutation.isPending}
                        >
                            Post
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
