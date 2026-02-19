import { create } from "zustand";

const useUIStore = create((set) => ({
    // Sidebar state
    isSidebarOpen: true,
    toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

    // Theme state
    theme: 'light',
    setTheme: (theme) => set(() => ({ theme })),
}));

export default useUIStore;
