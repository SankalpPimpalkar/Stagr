import axios from "axios";

export const AXIOS = axios.create({
    baseURL: import.meta.env.VITE_SERVER_ENDPOINT,
    withCredentials: true
})

export const userAPI = {
    updateBio: async () => { },
    getUseByUsername: async (username) => { },
    getUsers: async (username) => { },
}

export const postAPI = {
    createPost: async () => { },
    updatePost: async (postId) => { },
    deletePost: async (postId) => { },
    getAllPosts: async () => { },
    getSuggestedPosts: async () => { },
    toggleLikePost: async (postId) => { },
}