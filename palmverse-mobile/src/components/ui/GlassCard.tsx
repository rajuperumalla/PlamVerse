import { View, ViewProps } from "react-native";
import { BlurView } from "expo-blur";

interface Props extends ViewProps {
  children: React.ReactNode;
  intensity?: number;
  className?: string;
}

export function GlassCard({ children, intensity = 30, className, ...rest }: Props) {
  return (
    <View
      className={`overflow-hidden rounded-3xl border border-glass-border ${className ?? ""}`}
      {...rest}
    >
      <BlurView intensity={intensity} tint="dark" style={{ padding: 20 }}>
        {children}
      </BlurView>
    </View>
  );
}
