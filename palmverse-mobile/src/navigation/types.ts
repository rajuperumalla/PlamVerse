import type { ReadingCategory } from "@/types";

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Login: undefined;
  Otp: { phone: string };
  Profile: undefined;
  ReadingSelection: undefined;
  HandSelection: { category: ReadingCategory };
  Value: undefined;
  Payment: undefined;
  PhotoUpload: undefined;
  Status: undefined;
  Report: { reportId: string };
  Products: undefined;
  Cart: undefined;
  Chat: undefined;
  Tabs: undefined;
};
