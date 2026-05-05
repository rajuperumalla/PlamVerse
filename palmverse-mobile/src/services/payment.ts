import Constants from "expo-constants";
import { Platform } from "react-native";
// Razorpay (India). On iOS, requires native module linked.
// On Android, autolinking via expo prebuild.
import RazorpayCheckout from "react-native-razorpay";
import { initStripe, presentPaymentSheet } from "@stripe/stripe-react-native";
import { createOrder } from "./api";

const extra = Constants.expoConfig?.extra as Record<string, string> | undefined;

export async function payWithRazorpay(amountInr: number, category: string) {
  const order = await createOrder({
    category,
    amount: amountInr * 100,
    currency: "INR",
  });
  const result = await RazorpayCheckout.open({
    key: extra?.razorpayKeyId ?? "",
    order_id: order.razorpayOrderId,
    name: "PalmVerse",
    description: `PalmVerse — ${category}`,
    currency: "INR",
    amount: amountInr * 100,
    theme: { color: "#7c3aed" },
  });
  return { orderId: order.orderId, paymentId: result.razorpay_payment_id };
}

export async function payWithStripe(amountUsd: number, category: string) {
  const order = await createOrder({
    category,
    amount: amountUsd * 100,
    currency: "USD",
  });
  await initStripe({ publishableKey: extra?.stripePublishableKey ?? "" });
  const { error } = await presentPaymentSheet();
  if (error) throw new Error(error.message);
  return { orderId: order.orderId, paymentId: order.clientSecret ?? "stripe-success" };
}

export const defaultProvider: "razorpay" | "stripe" =
  Platform.OS === "ios" ? "stripe" : "razorpay";
