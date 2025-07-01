// src/store/useAuthStore.js
import { create } from 'zustand';
import { logoutUser } from '../services/AuthServices';

const useAuthStore = create((set, get) => ({
    showLogin: false,
    showRegister: false,
    isAuthenticated: false,

    setShowLogin: (value) => set({ showLogin: value }),
    setShowRegister: (value) => set({ showRegister: value }),
    setUser: (user) => set({ user, isAuthenticated: !!user }),
    clearUser: () => set({ user: null, isAuthenticated: false }),


    logout: async () => {
        try {
            const data = await logoutUser();
            if (data) {
                console.log("Hellllooo")
            }
            get().clearUser();
        }
        catch (error) {

        }
    }
}));

export default useAuthStore;
