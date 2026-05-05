import { useEffect } from "react";
import { View, Text } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  Easing,
} from "react-native-reanimated";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { CosmicBackground } from "@/components/ui/CosmicBackground";
import { useAuthStore } from "@/store/authStore";
import type { RootStackParamList } from "@/navigation/types";

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function SplashScreen() {
  const nav = useNavigation<Nav>();
  const { authed, hasOnboarded } = useAuthStore();
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 900, easing: Easing.out(Easing.cubic) });
    scale.value = withSequence(
      withTiming(1.05, { duration: 700 }),
      withTiming(1, { duration: 300 })
    );
    const t = setTimeout(() => {
      const next = !hasOnboarded ? "Onboarding" : !authed ? "Login" : "Tabs";
      nav.reset({ index: 0, routes: [{ name: next }] });
    }, 1800);
    return () => clearTimeout(t);
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <CosmicBackground>
      <View className="flex-1 items-center justify-center">
        <Animated.View style={style} className="items-center">
          <Text className="font-cinzel text-5xl tracking-widest text-text-primary">
            PalmVerse
          </Text>
          <Text className="mt-3 font-raleway text-sm tracking-[6px] text-nebula-cyan">
            COSMIC INSIGHTS
          </Text>
        </Animated.View>
      </View>
    </CosmicBackground>
  );
}
