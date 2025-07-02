// src/store/useAuthStore.js
import { create } from 'zustand';
import { logoutUser } from '../services/AuthServices';

const useAuthStore = create((set, get) => ({
    showLogin: false,
    showRegister: false,
    isAuthenticated: false,
    loading: true,

    setShowLogin: (value) => set({ showLogin: value }),
    setShowRegister: (value) => set({ showRegister: value }),
    setUser: (user) => set({ user, isAuthenticated: !!user, loading: false }),
    clearUser: () => set({ user: null, isAuthenticated: false }),


    logout: async () => {
        try {
            const data = await logoutUser();
            get().clearUser();
            return data.message;
        }
        catch (error) {
            console.error(error)
            throw error
        }
    },

    navigateToHome: () => {

    }
}));

export default useAuthStore;
