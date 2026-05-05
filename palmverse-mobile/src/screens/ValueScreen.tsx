import { View, Text } from "react-native";
import { BlurView } from "expo-blur";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ScreenContainer } from "@/components/ui/ScreenContainer";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { StepProgress } from "@/components/ui/StepProgress";
import { GlassCard } from "@/components/ui/GlassCard";
import { GradientButton } from "@/components/ui/GradientButton";
import type { RootStackParamList } from "@/navigation/types";

type Nav = NativeStackNavigationProp<RootStackParamList>;

const features = [
  "AI + Expert verified palm reading",
  "Detailed PDF report (15+ pages)",
  "Personalised gem & ring recommendations",
  "Editor chat for follow-up questions",
  "Delivery within 24 hours",
];

export function ValueScreen() {
  const nav = useNavigation<Nav>();

  return (
    <ScreenContainer>
      <StepProgress step={4} label="Preview" />
      <ScreenHeader
        title="Unlock your reading"
        subtitle="Here's exactly what you'll receive."
      />
      <View className="mb-5 overflow-hidden rounded-3xl border border-glass-border">
        <View className="h-56 bg-cosmos-600 p-4">
          <Text className="font-cinzel text-base text-text-primary">Sample report</Text>
          <Text className="mt-2 font-raleway text-xs text-text-muted">
            Heart line • Head line • Life line • Fate line • Sun line...
          </Text>
          <Text className="mt-4 font-raleway text-sm text-text-secondary">
            Your dominant Mercury mount suggests strong communication and adaptability.
            The deep curve of your heart line indicates...
          </Text>
        </View>
        <BlurView
          intensity={50}
          tint="dark"
          style={{ position: "absolute", inset: 0 } as never}
        >
          <View className="flex-1 items-center justify-center">
            <Text className="font-cinzel text-lg uppercase tracking-widest text-text-primary">
              🔒 Locked
            </Text>
          </View>
        </BlurView>
      </View>
      <GlassCard>
        {features.map((f) => (
          <View key={f} className="mb-2 flex-row items-start">
            <Text className="mr-2 text-nebula-cyan">✦</Text>
            <Text className="flex-1 font-raleway text-sm text-text-secondary">{f}</Text>
          </View>
        ))}
      </GlassCard>
      <View className="mt-6">
        <GradientButton
          label="Unlock Your Reading"
          variant="aurora"
          onPress={() => nav.navigate("Payment")}
        />
        <Text className="mt-3 text-center font-raleway text-xs text-text-muted">
          Secure payment • 100% money-back if not delivered
        </Text>
      </View>
    </ScreenContainer>
  );
}
