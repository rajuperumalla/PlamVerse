import { useEffect, useRef, useState } from "react";
import { View, Text, TextInput, Alert } from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ScreenContainer } from "@/components/ui/ScreenContainer";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { GradientButton } from "@/components/ui/GradientButton";
import { useAuthStore } from "@/store/authStore";
import { sendOtp } from "@/services/firebase";
import type { RootStackParamList } from "@/navigation/types";

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function OtpScreen() {
  const nav = useNavigation<Nav>();
  const route = useRoute<RouteProp<RootStackParamList, "Otp">>();
  const phone = route.params?.phone;
  const setAuthed = useAuthStore((s) => s.setAuthed);
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [confirm, setConfirm] = useState<{ confirm: (c: string) => Promise<unknown> } | null>(null);
  const [loading, setLoading] = useState(false);
  const inputs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    sendOtp(phone)
      .then((c) => setConfirm(c as unknown as typeof confirm))
      .catch((e) => Alert.alert("OTP error", (e as Error).message));
  }, [phone]);

  const onChange = (i: number, v: string) => {
    const arr = [...digits];
    arr[i] = v.slice(-1);
    setDigits(arr);
    if (v && i < 5) inputs.current[i + 1]?.focus();
  };

  const verify = async () => {
    const code = digits.join("");
    if (code.length < 6) return;
    setLoading(true);
    try {
      const r = (await confirm?.confirm(code)) as { user: { uid: string } } | undefined;
      setAuthed(true, r?.user.uid, phone);
      nav.reset({ index: 0, routes: [{ name: "Profile" }] });
    } catch (e) {
      Alert.alert("Verification failed", (e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer>
      <View className="flex-1 justify-center">
        <ScreenHeader
          title="Enter OTP"
          subtitle={`We sent a 6-digit code to ${phone}.`}
        />
        <GlassCard>
          <View className="mb-6 flex-row justify-between">
            {digits.map((d, i) => (
              <TextInput
                key={i}
                ref={(r) => (inputs.current[i] = r)}
                value={d}
                onChangeText={(v) => onChange(i, v)}
                keyboardType="number-pad"
                maxLength={1}
                className="h-14 w-12 rounded-2xl border border-glass-border bg-glass text-center font-cinzel text-xl text-text-primary"
              />
            ))}
          </View>
          <GradientButton
            label="Verify"
            onPress={verify}
            loading={loading}
            disabled={digits.join("").length < 6}
          />
        </GlassCard>
        <Text className="mt-4 text-center font-raleway text-xs text-text-muted">
          Didn't get it? Resend in 30s
        </Text>
      </View>
    </ScreenContainer>
  );
}
