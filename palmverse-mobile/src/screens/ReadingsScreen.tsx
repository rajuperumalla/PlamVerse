import { Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ScreenContainer } from "@/components/ui/ScreenContainer";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { GradientButton } from "@/components/ui/GradientButton";
import { useReadingStore } from "@/store/readingStore";
import type { RootStackParamList } from "@/navigation/types";

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function ReadingsScreen() {
  const nav = useNavigation<Nav>();
  const { reportId, status } = useReadingStore();
  return (
    <ScreenContainer>
      <ScreenHeader title="Your readings" />
      {reportId ? (
        <GlassCard>
          <Text className="font-cinzel text-base text-text-primary">Reading #{reportId.slice(-6)}</Text>
          <Text className="mt-1 font-raleway text-xs text-text-muted">Status: {status}</Text>
          <View className="mt-4">
            <GradientButton
              label={status === "ready" ? "View Report" : "Track Status"}
              variant="aurora"
              onPress={() =>
                status === "ready"
                  ? nav.navigate("Report", { reportId })
                  : nav.navigate("Status")
              }
            />
          </View>
        </GlassCard>
      ) : (
        <Text className="mt-8 text-center font-raleway text-text-muted">
          No readings yet. Start one from Home.
        </Text>
      )}
    </ScreenContainer>
  );
}
