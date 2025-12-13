import axios from "axios";

export const AXIOS = axios.create({
    baseURL: import.meta.env.VITE_SERVER_ENDPOINT,
    withCredentials: true
})

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
        const { data } = AXIOS.get(`/users/username/${encodeURIComponent(username)}`)
        return data
    },
    getUserByUsername: async (username) => {
        const { data } = await AXIOS.get(`/users/${encodeURIComponent(username)}`)
        return data
    },
    getUsers: async (search = "") => {
        const { data } = await AXIOS.get("/users", { params: { search } })
        return data
    },
}

export const postAPI = {
    createPost: async (formData) => {
        const { data } = await AXIOS.post("/posts", formData)
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
    getAllPosts: async () => {
        const { data } = await AXIOS.get("/posts")
        return data
    },
    toggleLikePost: async (postId) => {
        const { data } = await AXIOS.patch(`/posts/${postId}`)
        return data
    },
}