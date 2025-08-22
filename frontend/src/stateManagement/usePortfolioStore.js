// src/store/useAuthStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const usePortfolioStore = create(
    persist(
        (set) => ({
            fullImages: [],
            previewIndex: null,
            setFullImages: (images) => set({ fullImages: images }),
            setPreviewIndex: (index) => set({ previewIndex: index }),
        }),
        {
            name: 'portfolio-storage', // key in localStorage
            getStorage: () => localStorage,
        }
    )
);

export default usePortfolioStore;
