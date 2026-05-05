import { View, Text } from "react-native";

export function ScreenHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <View className="mb-6">
      <Text className="font-cinzel text-3xl text-text-primary">{title}</Text>
      {subtitle && (
        <Text className="mt-2 font-raleway text-sm leading-5 text-text-secondary">
          {subtitle}
        </Text>
      )}
    </View>
  );
}
