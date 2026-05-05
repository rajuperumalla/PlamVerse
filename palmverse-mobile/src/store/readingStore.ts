import { create } from "zustand";
import type {
  Hand,
  PalmImages,
  ReadingCategory,
  ReportStatus,
  UserProfile,
} from "@/types";

interface ReadingState {
  profile?: UserProfile;
  category?: ReadingCategory;
  hand?: Hand;
  paid: boolean;
  paymentId?: string;
  images: PalmImages;
  reportId?: string;
  status: ReportStatus;
  setProfile: (p: UserProfile) => void;
  setCategory: (c: ReadingCategory) => void;
  setHand: (h: Hand) => void;
  markPaid: (paymentId: string) => void;
  setImage: (key: keyof PalmImages, uri: string) => void;
  setStatus: (s: ReportStatus) => void;
  setReportId: (id: string) => void;
  reset: () => void;
}

export const useReadingStore = create<ReadingState>((set) => ({
  paid: false,
  images: {},
  status: "pending_payment",
  setProfile: (profile) => set({ profile }),
  setCategory: (category) => set({ category }),
  setHand: (hand) => set({ hand }),
  markPaid: (paymentId) =>
    set({ paid: true, paymentId, status: "pending_upload" }),
  setImage: (key, uri) =>
    set((s) => ({ images: { ...s.images, [key]: uri } })),
  setStatus: (status) => set({ status }),
  setReportId: (reportId) => set({ reportId }),
  reset: () =>
    set({
      profile: undefined,
      category: undefined,
      hand: undefined,
      paid: false,
      paymentId: undefined,
      images: {},
      reportId: undefined,
      status: "pending_payment",
    }),
}));
