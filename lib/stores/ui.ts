import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
	sidebarOpen: boolean;
	theme: 'light' | 'dark';
	loading: Record<string, boolean>;
	toast: {
		id: string;
		message: string;
		type: 'success' | 'error' | 'info' | 'warning';
		duration?: number;
	} | null;
}

interface UIActions {
	toggleSidebar: () => void;
	setTheme: (theme: 'light' | 'dark') => void;
	setLoading: (key: string, loading: boolean) => void;
	showToast: (toast: Omit<UIState['toast'], 'id'>) => void;
	hideToast: () => void;
}

export const useUIStore = create<UIState & UIActions>()(
	persist(
		(set, get) => ({
			sidebarOpen: true,
			theme: 'light',
			loading: {},
			toast: null,

			toggleSidebar: () =>
				set((state) => ({ sidebarOpen: !state.sidebarOpen })),

			setTheme: (theme) => set({ theme }),

			setLoading: (key, loading) =>
				set((state) => ({
					loading: {
						...state.loading,
						[key]: loading,
					},
				})),

			showToast: (toast) =>
				set({
					toast: {
						...toast,
						id: Math.random().toString(36).substr(2, 9),
					},
				}),

			hideToast: () => set({ toast: null }),
		}),
		{
			name: 'ui-store',
			partialize: (state) => ({
				theme: state.theme,
				sidebarOpen: state.sidebarOpen,
			}),
		}
	)
);
