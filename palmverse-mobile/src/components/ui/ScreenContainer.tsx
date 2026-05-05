import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CosmicBackground } from "./CosmicBackground";

export function ScreenContainer({
  children,
  scroll = true,
  padded = true,
}: {
  children: React.ReactNode;
  scroll?: boolean;
  padded?: boolean;
}) {
  const Inner = scroll ? ScrollView : View;
  return (
    <CosmicBackground>
      <SafeAreaView className="flex-1">
        <Inner
          {...(scroll
            ? { contentContainerStyle: { flexGrow: 1, paddingBottom: 32 } }
            : { style: { flex: 1 } })}
          className={padded ? "px-6 pt-4" : ""}
        >
          {children}
        </Inner>
      </SafeAreaView>
    </CosmicBackground>
  );
}
