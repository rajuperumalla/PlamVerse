import { View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { gradients } from "@/theme/colors";

export function StepProgress({
  step,
  total = 5,
  label,
}: {
  step: number;
  total?: number;
  label?: string;
}) {
  return (
    <View className="mb-6">
      <View className="mb-2 flex-row items-center justify-between">
        <Text className="font-raleway text-xs uppercase tracking-widest text-text-muted">
          Step {step} of {total}
        </Text>
        {label && (
          <Text className="font-raleway text-xs text-text-secondary">{label}</Text>
        )}
      </View>
      <View className="h-1.5 w-full overflow-hidden rounded-full bg-glass">
        <LinearGradient
          colors={gradients.aurora as unknown as string[]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ width: `${(step / total) * 100}%`, height: "100%" }}
        />
      </View>
    </View>
  );
}
