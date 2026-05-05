import { useState } from "react";
import { View, Text, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ScreenContainer } from "@/components/ui/ScreenContainer";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { Input } from "@/components/ui/Input";
import { GradientButton } from "@/components/ui/GradientButton";
import { GlassCard } from "@/components/ui/GlassCard";
import { useAuthStore } from "@/store/authStore";
import { googleSignIn } from "@/services/firebase";
import type { RootStackParamList } from "@/navigation/types";

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function LoginScreen() {
  const nav = useNavigation<Nav>();
  const setAuthed = useAuthStore((s) => s.setAuthed);
  const [phone, setPhone] = useState("+91");
  const [loading, setLoading] = useState(false);

  const continueWithPhone = () => {
    if (phone.replace(/\D/g, "").length < 10)
      return Alert.alert("Invalid number", "Enter a valid mobile number.");
    nav.navigate("Otp", { phone });
  };

  const continueWithGoogle = async () => {
    setLoading(true);
    try {
      const cred = await googleSignIn();
      setAuthed(true, cred.user.uid);
      nav.reset({ index: 0, routes: [{ name: "Profile" }] });
    } catch (e) {
      Alert.alert("Sign-in failed", (e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer>
      <View className="flex-1 justify-center">
        <ScreenHeader title="Welcome" subtitle="Sign in to begin your reading." />
        <GlassCard>
          <Input
            label="Mobile number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholder="+91 98765 43210"
          />
          <GradientButton label="Continue with OTP" onPress={continueWithPhone} />
          <View className="my-5 flex-row items-center">
            <View className="h-px flex-1 bg-glass-border" />
            <Text className="mx-3 font-raleway text-xs text-text-muted">OR</Text>
            <View className="h-px flex-1 bg-glass-border" />
          </View>
          <GradientButton
            label="Continue with Google"
            variant="ghost"
            onPress={continueWithGoogle}
            loading={loading}
          />
        </GlassCard>
        <Text className="mt-6 text-center font-raleway text-xs text-text-muted">
          By continuing you agree to our Terms & Privacy.
        </Text>
      </View>
    </ScreenContainer>
  );
}
