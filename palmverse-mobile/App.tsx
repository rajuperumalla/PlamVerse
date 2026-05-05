import "./global.css";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { Cinzel_600SemiBold } from "@expo-google-fonts/cinzel";
import { Raleway_400Regular, Raleway_700Bold } from "@expo-google-fonts/raleway";
import { View, ActivityIndicator } from "react-native";
import { RootNavigator } from "@/navigation/RootNavigator";

export default function App() {
  const [loaded] = useFonts({
    Cinzel_600SemiBold,
    Raleway_400Regular,
    Raleway_700Bold,
  });

  if (!loaded) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#05021a" }}>
        <ActivityIndicator color="#a855f7" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <RootNavigator />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
