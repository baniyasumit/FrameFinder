// src/store/useAuthStore.js
import { create } from 'zustand';
import { logoutUser } from '../services/AuthServices';

const useAuthStore = create((set, get) => ({
    isAuthenticated: false,
    loading: true,
    hasSentOtp: false,

    setHasSentOtp: (value) => set({ hasSentOtp: value }),
    setUser: (user) => set({ user, isAuthenticated: !!user, loading: false }),
    updateUser: (fields) => set((state) => ({ user: { ...state.user, ...fields, }, })),
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
