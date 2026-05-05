import { Pressable, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ScreenContainer } from "@/components/ui/ScreenContainer";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { StepProgress } from "@/components/ui/StepProgress";
import { GlassCard } from "@/components/ui/GlassCard";
import { useReadingStore } from "@/store/readingStore";
import type { ReadingCategory } from "@/types";
import type { RootStackParamList } from "@/navigation/types";

type Nav = NativeStackNavigationProp<RootStackParamList>;

const options: { id: ReadingCategory; title: string; desc: string; price: string }[] = [
  { id: "general", title: "General Personality", desc: "Core traits, strengths, hidden patterns", price: "₹499" },
  { id: "career", title: "Career & Finance", desc: "Path, timing, opportunities", price: "₹699" },
  { id: "health", title: "Health & Wellness", desc: "Vitality, watch-outs, balance", price: "₹699" },
  { id: "marriage", title: "Marriage & Relationships", desc: "Love line, compatibility", price: "₹699" },
  { id: "comprehensive", title: "Comprehensive Analysis", desc: "All areas, deepest detail", price: "₹1499" },
];

export function ReadingSelectionScreen() {
  const nav = useNavigation<Nav>();
  const setCategory = useReadingStore((s) => s.setCategory);
  const selected = useReadingStore((s) => s.category);

  const choose = (c: ReadingCategory) => {
    setCategory(c);
    nav.navigate("HandSelection", { category: c });
  };

  return (
    <ScreenContainer>
      <StepProgress step={2} label="Reading type" />
      <ScreenHeader title="Choose your reading" subtitle="Pick the area you want clarity on." />
      {options.map((o) => (
        <Pressable key={o.id} onPress={() => choose(o.id)} className="mb-3">
          <GlassCard
            className={selected === o.id ? "border-nebula-cyan" : ""}
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-1 pr-4">
                <Text className="font-cinzel text-lg text-text-primary">{o.title}</Text>
                <Text className="mt-1 font-raleway text-sm text-text-secondary">{o.desc}</Text>
              </View>
              <Text className="font-cinzel text-base text-nebula-cyan">{o.price}</Text>
            </View>
          </GlassCard>
        </Pressable>
      ))}
    </ScreenContainer>
  );
}
