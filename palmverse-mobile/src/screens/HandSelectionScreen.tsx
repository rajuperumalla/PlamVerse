import { Pressable, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ScreenContainer } from "@/components/ui/ScreenContainer";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { StepProgress } from "@/components/ui/StepProgress";
import { GlassCard } from "@/components/ui/GlassCard";
import { GradientButton } from "@/components/ui/GradientButton";
import { useReadingStore } from "@/store/readingStore";
import type { Hand } from "@/types";
import type { RootStackParamList } from "@/navigation/types";

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function HandSelectionScreen() {
  const nav = useNavigation<Nav>();
  const hand = useReadingStore((s) => s.hand);
  const setHand = useReadingStore((s) => s.setHand);

  const Card = ({ side }: { side: Hand }) => (
    <Pressable onPress={() => setHand(side)} className="flex-1">
      <GlassCard className={hand === side ? "border-nebula-cyan" : ""}>
        <View className="items-center py-8">
          <Text className="text-6xl">{side === "left" ? "✋" : "🖐"}</Text>
          <Text className="mt-4 font-cinzel text-lg uppercase text-text-primary">{side}</Text>
        </View>
      </GlassCard>
    </Pressable>
  );

  return (
    <ScreenContainer>
      <StepProgress step={3} label="Dominant hand" />
      <ScreenHeader
        title="Your dominant hand"
        subtitle="The hand you write with reflects your active life path."
      />
      <View className="flex-row gap-4">
        <Card side="left" />
        <Card side="right" />
      </View>
      <View className="mt-8">
        <GradientButton
          label="Continue"
          variant="aurora"
          disabled={!hand}
          onPress={() => nav.navigate("Value")}
        />
      </View>
    </ScreenContainer>
  );
}
