import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
  apiKey?: string;
}

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  language: 'en' | 'ta';
  theme: 'dark' | 'light';
  
  // Actions
  login: (email: string, name?: string) => void;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  setLanguage: (lang: 'en' | 'ta') => void;
  setTheme: (theme: 'dark' | 'light') => void;
  generateApiKey: () => string;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: {
        id: 'demo-user',
        name: 'Alex Mercer',
        email: 'alex@formforge.ai',
        role: 'Enterprise Creator',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
        apiKey: 'ff_live_58c2a4c1f9b8c2901a5d',
      },
      isAuthenticated: true, // Default to true so onboarding dashboard works immediately!
      language: 'en',
      theme: 'dark',

      login: (email, name = 'SaaS Architect') => {
        set({
          user: {
            id: `usr-${Math.random().toString(36).substr(2, 9)}`,
            name,
            email,
            role: 'Product Owner',
            avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
            apiKey: `ff_live_${Math.random().toString(36).substr(2, 10)}${Math.random().toString(36).substr(2, 10)}`,
          },
          isAuthenticated: true,
        });
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      updateProfile: (updates) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...updates } });
        }
      },

      setLanguage: (language) => set({ language }),
      setTheme: (theme) => set({ theme }),

      generateApiKey: () => {
        const newKey = `ff_live_${Math.random().toString(36).substr(2, 10)}${Math.random().toString(36).substr(2, 10)}`;
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, apiKey: newKey } });
        }
        return newKey;
      },
    }),
    {
      name: 'formforge-auth-storage',
    }
  )
);
