import { useRef, useState } from "react";
import { FlatList, View, Text, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ScreenContainer } from "@/components/ui/ScreenContainer";
import { GlassCard } from "@/components/ui/GlassCard";
import { GradientButton } from "@/components/ui/GradientButton";
import { useAuthStore } from "@/store/authStore";
import type { RootStackParamList } from "@/navigation/types";

const { width } = Dimensions.get("window");

const slides = [
  {
    title: "Discover Your Path",
    body: "AI reads the unique lines on your palm, decoding traits encoded in your hands.",
  },
  {
    title: "Verified by Experts",
    body: "Every reading is reviewed by certified palmists before it reaches you.",
  },
  {
    title: "Your Cosmic Report",
    body: "A detailed PDF with personality, career, health, and relationship insights.",
  },
];

export function OnboardingScreen() {
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const setOnboarded = useAuthStore((s) => s.setOnboarded);
  const [index, setIndex] = useState(0);
  const ref = useRef<FlatList>(null);

  const next = () => {
    if (index < slides.length - 1) {
      ref.current?.scrollToIndex({ index: index + 1 });
    } else {
      setOnboarded(true);
      nav.reset({ index: 0, routes: [{ name: "Login" }] });
    }
  };

  return (
    <ScreenContainer scroll={false} padded={false}>
      <FlatList
        ref={ref}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) =>
          setIndex(Math.round(e.nativeEvent.contentOffset.x / width))
        }
        keyExtractor={(s) => s.title}
        renderItem={({ item }) => (
          <View style={{ width }} className="flex-1 items-center justify-center px-8">
            <GlassCard className="w-full">
              <Text className="font-cinzel text-3xl text-text-primary">{item.title}</Text>
              <Text className="mt-4 font-raleway text-base leading-6 text-text-secondary">
                {item.body}
              </Text>
            </GlassCard>
          </View>
        )}
      />
      <View className="px-8 pb-10">
        <View className="mb-6 flex-row justify-center">
          {slides.map((_, i) => (
            <View
              key={i}
              className={`mx-1 h-2 rounded-full ${i === index ? "w-6 bg-nebula-cyan" : "w-2 bg-glass-border"}`}
            />
          ))}
        </View>
        <GradientButton
          label={index === slides.length - 1 ? "Get Started" : "Next"}
          variant="aurora"
          onPress={next}
        />
      </View>
    </ScreenContainer>
  );
}
