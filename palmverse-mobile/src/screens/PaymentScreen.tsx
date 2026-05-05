import { useState } from "react";
import { View, Text, Pressable, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ScreenContainer } from "@/components/ui/ScreenContainer";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { StepProgress } from "@/components/ui/StepProgress";
import { GlassCard } from "@/components/ui/GlassCard";
import { GradientButton } from "@/components/ui/GradientButton";
import { useReadingStore } from "@/store/readingStore";
import { defaultProvider, payWithRazorpay, payWithStripe } from "@/services/payment";
import type { PaymentProvider } from "@/types";
import type { RootStackParamList } from "@/navigation/types";

type Nav = NativeStackNavigationProp<RootStackParamList>;

const PRICE_INR = 699;
const PRICE_USD = 9;

export function PaymentScreen() {
  const nav = useNavigation<Nav>();
  const category = useReadingStore((s) => s.category) ?? "general";
  const markPaid = useReadingStore((s) => s.markPaid);
  const [provider, setProvider] = useState<PaymentProvider>(defaultProvider);
  const [loading, setLoading] = useState(false);

  const pay = async () => {
    setLoading(true);
    try {
      const result =
        provider === "razorpay"
          ? await payWithRazorpay(PRICE_INR, category)
          : await payWithStripe(PRICE_USD, category);
      markPaid(result.paymentId);
      nav.reset({ index: 0, routes: [{ name: "PhotoUpload" }] });
    } catch (e) {
      Alert.alert("Payment failed", (e as Error).message ?? "Try again.");
    } finally {
      setLoading(false);
    }
  };

  const Option = ({ id, label, sub }: { id: PaymentProvider; label: string; sub: string }) => (
    <Pressable onPress={() => setProvider(id)} className="mb-3">
      <GlassCard className={provider === id ? "border-nebula-cyan" : ""}>
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="font-cinzel text-base text-text-primary">{label}</Text>
            <Text className="mt-1 font-raleway text-xs text-text-muted">{sub}</Text>
          </View>
          <View
            className={`h-5 w-5 rounded-full border ${provider === id ? "border-nebula-cyan bg-nebula-cyan" : "border-glass-border"}`}
          />
        </View>
      </GlassCard>
    </Pressable>
  );

  return (
    <ScreenContainer>
      <StepProgress step={5} label="Payment" />
      <ScreenHeader title="Complete payment" subtitle="Choose your payment method." />
      <Option id="razorpay" label="Razorpay (India)" sub="UPI, cards, net-banking" />
      <Option id="stripe" label="Stripe (Global)" sub="Cards, Apple Pay, Google Pay" />
      <GlassCard className="mt-2">
        <View className="flex-row justify-between">
          <Text className="font-raleway text-text-secondary">Amount</Text>
          <Text className="font-cinzel text-lg text-text-primary">
            {provider === "razorpay" ? `₹${PRICE_INR}` : `$${PRICE_USD}`}
          </Text>
        </View>
      </GlassCard>
      <View className="mt-6">
        <GradientButton
          label={`Pay ${provider === "razorpay" ? `₹${PRICE_INR}` : `$${PRICE_USD}`}`}
          variant="aurora"
          loading={loading}
          onPress={pay}
        />
        <Text className="mt-3 text-center font-raleway text-xs text-text-muted">
          🔒 256-bit encrypted • PCI-DSS compliant
        </Text>
      </View>
    </ScreenContainer>
  );
}
