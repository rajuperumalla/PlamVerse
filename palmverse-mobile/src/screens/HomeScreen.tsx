import { Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ScreenContainer } from "@/components/ui/ScreenContainer";
import { GlassCard } from "@/components/ui/GlassCard";
import { GradientButton } from "@/components/ui/GradientButton";
import type { RootStackParamList } from "@/navigation/types";

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function HomeScreen() {
  const nav = useNavigation<Nav>();
  return (
    <ScreenContainer>
      <Text className="font-cinzel text-4xl text-text-primary">PalmVerse</Text>
      <Text className="mt-2 font-raleway text-sm text-text-secondary">
        Cosmic insights from your palm.
      </Text>
      <GlassCard className="mt-6">
        <Text className="font-cinzel text-lg text-text-primary">Start a new reading</Text>
        <Text className="mt-2 font-raleway text-sm text-text-secondary">
          Get a personalised AI + expert palm reading in 24 hours.
        </Text>
        <View className="mt-4">
          <GradientButton
            label="Begin"
            variant="aurora"
            onPress={() => nav.navigate("Profile")}
          />
        </View>
      </GlassCard>
    </ScreenContainer>
  );
}
