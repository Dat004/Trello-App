import { create } from "zustand";
import { persist } from "zustand/middleware";

const useUIStore = create(
    persist(
        (set) => ({
            // Sidebar state
            isSidebarOpen: true,
            toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

            // Theme state
            theme: 'light',
            setTheme: (theme) => set(() => ({ theme })),
        }),
        {
            name: "ui-store",
            partialize: (state) => ({ theme: state.theme, isSidebarOpen: state.isSidebarOpen }),
        }
    )
);

export default useUIStore;
