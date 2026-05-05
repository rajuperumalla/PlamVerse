import { View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { gradients } from "@/theme/colors";

export function CosmicBackground({ children }: { children: React.ReactNode }) {
  return (
    <LinearGradient
      colors={gradients.cosmic as unknown as string[]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <View className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-nebula-pink/20 blur-3xl" />
      <View className="absolute top-40 -right-20 h-80 w-80 rounded-full bg-nebula-blue/20 blur-3xl" />
      <View className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-nebula-purple/25 blur-3xl" />
      {children}
    </LinearGradient>
  );
}
