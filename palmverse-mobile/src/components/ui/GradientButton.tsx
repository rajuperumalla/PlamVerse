import { Pressable, Text, ActivityIndicator, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { gradients } from "@/theme/colors";

interface Props {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: "primary" | "aurora" | "ghost";
  className?: string;
}

export function GradientButton({
  label,
  onPress,
  loading,
  disabled,
  variant = "primary",
  className,
}: Props) {
  const colors =
    variant === "aurora"
      ? (gradients.aurora as unknown as string[])
      : (gradients.primary as unknown as string[]);

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    onPress();
  };

  if (variant === "ghost") {
    return (
      <Pressable
        onPress={handlePress}
        disabled={disabled || loading}
        className={`rounded-2xl border border-glass-border bg-glass px-6 py-4 ${className ?? ""}`}
      >
        <Text className="text-center font-raleway-bold text-base text-text-primary">
          {label}
        </Text>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled || loading}
      style={{ opacity: disabled ? 0.5 : 1 }}
      className={className}
    >
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ borderRadius: 16, paddingVertical: 16, paddingHorizontal: 24 }}
      >
        <View className="flex-row items-center justify-center">
          {loading && <ActivityIndicator color="white" style={{ marginRight: 8 }} />}
          <Text className="font-raleway-bold text-base text-white">{label}</Text>
        </View>
      </LinearGradient>
    </Pressable>
  );
}
