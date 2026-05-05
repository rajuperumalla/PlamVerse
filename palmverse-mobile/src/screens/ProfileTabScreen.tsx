import { Text, View } from "react-native";
import { ScreenContainer } from "@/components/ui/ScreenContainer";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { GradientButton } from "@/components/ui/GradientButton";
import { useAuthStore } from "@/store/authStore";
import { signOut } from "@/services/firebase";

export function ProfileTabScreen() {
  const { phone, signOut: clear } = useAuthStore();
  const handleSignOut = async () => {
    await signOut().catch(() => {});
    clear();
  };
  return (
    <ScreenContainer>
      <ScreenHeader title="Account" />
      <GlassCard>
        <Text className="font-cinzel text-base text-text-primary">{phone ?? "Signed in"}</Text>
        <View className="mt-4">
          <GradientButton label="Sign out" variant="ghost" onPress={handleSignOut} />
        </View>
      </GlassCard>
    </ScreenContainer>
  );
}
