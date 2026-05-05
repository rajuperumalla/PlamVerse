export type Hand = "left" | "right";

export type ReadingCategory =
  | "general"
  | "career"
  | "health"
  | "marriage"
  | "comprehensive";

export type ReportStatus =
  | "pending_payment"
  | "pending_upload"
  | "submitted"
  | "under_review"
  | "approved"
  | "ready"
  | "rejected";

export type PaymentProvider = "razorpay" | "stripe";

export interface UserProfile {
  fullName: string;
  dob: string;
  tobEnabled: boolean;
  tob?: string;
  placeOfBirth: {
    name: string;
    lat: number;
    lng: number;
  };
}

export interface PalmImages {
  frontPalm?: string;
  sideView?: string;
  thumbCloseup?: string;
}

export interface ImageValidationResult {
  ok: boolean;
  blur: number;
  brightness: number;
  palmDetected: boolean;
  reason?: string;
}

export interface ReportSummary {
  id: string;
  status: ReportStatus;
  category: ReadingCategory;
  createdAt: string;
  pdfUrl?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "editor" | "system";
  text: string;
  ts: number;
}

export interface Product {
  id: string;
  name: string;
  type: "ring" | "stone";
  price: number;
  imageUrl: string;
  description: string;
}
