import * as FileSystem from "expo-file-system";
import type { ImageValidationResult } from "@/types";

// Lightweight client-side checks. Heavy ML validation runs server-side.
export async function validatePalmImage(uri: string): Promise<ImageValidationResult> {
  const info = await FileSystem.getInfoAsync(uri).catch(() => null);
  if (!info?.exists || !info.size) {
    return {
      ok: false,
      blur: 1,
      brightness: 0,
      palmDetected: false,
      reason: "File missing",
    };
  }
  if (info.size < 50_000) {
    return {
      ok: false,
      blur: 1,
      brightness: 0,
      palmDetected: false,
      reason: "Image too small/low-res — retake closer",
    };
  }
  if (info.size > 12_000_000) {
    return {
      ok: false,
      blur: 0,
      brightness: 0.5,
      palmDetected: false,
      reason: "Image too large — try again",
    };
  }
  // TODO: hand-detection model (TFLite or hosted endpoint)
  return { ok: true, blur: 0.1, brightness: 0.7, palmDetected: true };
}
