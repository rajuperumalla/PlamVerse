import { create } from "zustand";

interface AuthState {
  authed: boolean;
  hasOnboarded: boolean;
  phone?: string;
  uid?: string;
  setAuthed: (v: boolean, uid?: string, phone?: string) => void;
  setOnboarded: (v: boolean) => void;
  signOut: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  authed: false,
  hasOnboarded: false,
  setAuthed: (authed, uid, phone) => set({ authed, uid, phone }),
  setOnboarded: (hasOnboarded) => set({ hasOnboarded }),
  signOut: () => set({ authed: false, uid: undefined, phone: undefined }),
}));
