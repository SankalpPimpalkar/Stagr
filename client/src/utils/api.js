import axios from "axios";

export const AXIOS = axios.create({
    baseURL: import.meta.env.VITE_SERVER_ENDPOINT || "http://localhost:3000/api", // Fallback for dev
    withCredentials: true
})

// Function to retrieve token - set by the app
let tokenProvider = null;

export const registerTokenProvider = (provider) => {
    tokenProvider = provider;
}

AXIOS.interceptors.request.use(async (config) => {
    if (tokenProvider) {
        const token = await tokenProvider();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export const userAPI = {
    updateBio: async (bio) => {
        const { data } = await AXIOS.patch("/users/bio", { bio })
        return data
    },
    updateUsername: async (username) => {
        const { data } = await AXIOS.patch("/users/username", { username })
        return data
    },
    checkUsernameAvailability: async (username) => {
        // Backend expects query param: /api/users/username?username=durgesh
        const { data } = await AXIOS.get(`/users/username`, { params: { username } })
        return data
    },
    getUserByUsername: async (username) => {
        // Backend searchUsers is at /api/users?search=...
        // We can simulate getByUsername by searching or asking backend dev for a specific route.
        // For now, let's use search and filter or just search.
        // If we strictly need by username, we might need to rely on the general search.
        const { data } = await AXIOS.get("/users", { params: { search: username } })
        // Assuming the backend returns a list, we pick the exact match if possible
        const user = data.users.find(u => u.username === username);
        return user || null;
    },
    getUsers: async (search = "") => {
        const { data } = await AXIOS.get("/users", { params: { search } })
        return data
    },
}

export const postAPI = {
    createPost: async (formData) => {
        const { data } = await AXIOS.post("/posts", formData, {
            headers: {
                // Axios sets Content-Type to multipart/form-data automatically for FormData
            }
        })
        return data
    },
    updatePost: async (postId, formData) => {
        const { data } = await AXIOS.put(`/posts/${postId}`, formData)
        return data
    },
    deletePost: async (postId) => {
        const { data } = await AXIOS.delete(`/posts/${postId}`)
        return data
    },
    getAllPosts: async (params = {}) => {
        // params can be { page, limit, tags, keyword, username }
        const { data } = await AXIOS.get("/posts", { params })
        return data
    },
    toggleLikePost: async (postId) => {
        const { data } = await AXIOS.post(`/posts/${postId}`)
        return data
    },
}

export const storyAPI = {
    createStory: async (formData) => {
        // formData: title, content, coverImage
        const { data } = await AXIOS.post("/stories", formData);
        return data;
    },

    updateStory: async (storyId, formData) => {
        const { data } = await AXIOS.patch(`/stories/${storyId}`, formData);
        return data;
    },

    deleteStory: async (storyId) => {
        const { data } = await AXIOS.delete(`/stories/${storyId}`);
        return data;
    },

    getAllStories: async (params = {}) => {
        // params: { page, limit, username }
        const { data } = await AXIOS.get("/stories", { params });
        return data;
    },

    toggleLikeStory: async (storyId) => {
        const { data } = await AXIOS.post(`/stories/${storyId}/like`);
        return data;
    },
};

export const tagAPI = {
    createTag: async ({ storyId, content }) => {
        const { data } = await AXIOS.post("/tags", {
            storyId,
            content
        });
        return data;
    },

    updateTag: async (tagId, content) => {
        const { data } = await AXIOS.patch(`/tags/${tagId}`, { content });
        return data;
    },

    deleteTag: async (tagId) => {
        const { data } = await AXIOS.delete(`/tags/${tagId}`);
        return data;
    },

    getTagsByStory: async (storyId) => {
        const { data } = await AXIOS.get(`/tags/story/${storyId}`);
        return data;
    },

    toggleLikeTag: async (tagId) => {
        const { data } = await AXIOS.post(`/tags/${tagId}/like`);
        return data;
    },
};
