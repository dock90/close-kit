import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
	currentUser: {
		id: string;
		email: string;
		firstName?: string;
		lastName?: string;
		organizationId: string;
		role: 'admin' | 'member';
	} | null;
	organization: {
		id: string;
		name: string;
		slug: string;
	} | null;
}

interface UserActions {
	setUser: (user: UserState['currentUser']) => void;
	setOrganization: (organization: UserState['organization']) => void;
	clearUser: () => void;
}

export const useUserStore = create<UserState & UserActions>()(
	persist(
		(set) => ({
			currentUser: null,
			organization: null,

			setUser: (user) => set({ currentUser: user }),

			setOrganization: (organization) => set({ organization }),

			clearUser: () => set({ currentUser: null, organization: null }),
		}),
		{
			name: 'user-store',
		}
	)
);
