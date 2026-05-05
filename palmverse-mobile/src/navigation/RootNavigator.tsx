import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuthStore } from "@/store/authStore";
import type { RootStackParamList } from "./types";

import { SplashScreen } from "@/screens/SplashScreen";
import { OnboardingScreen } from "@/screens/OnboardingScreen";
import { LoginScreen } from "@/screens/auth/LoginScreen";
import { OtpScreen } from "@/screens/auth/OtpScreen";
import { ProfileScreen } from "@/screens/ProfileScreen";
import { ReadingSelectionScreen } from "@/screens/ReadingSelectionScreen";
import { HandSelectionScreen } from "@/screens/HandSelectionScreen";
import { ValueScreen } from "@/screens/ValueScreen";
import { PaymentScreen } from "@/screens/PaymentScreen";
import { PhotoUploadScreen } from "@/screens/PhotoUploadScreen";
import { StatusScreen } from "@/screens/StatusScreen";
import { ReportScreen } from "@/screens/ReportScreen";
import { ProductsScreen } from "@/screens/ProductsScreen";
import { CartScreen } from "@/screens/CartScreen";
import { ChatScreen } from "@/screens/ChatScreen";
import { AppTabs } from "./AppTabs";

const Stack = createNativeStackNavigator<RootStackParamList>();

const Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: "#05021a",
    card: "#0a0420",
    primary: "#a855f7",
    text: "#f5f3ff",
    border: "transparent",
  },
};

export function RootNavigator() {
  const authed = useAuthStore((s) => s.authed);
  const hasOnboarded = useAuthStore((s) => s.hasOnboarded);

  return (
    <NavigationContainer theme={Theme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "transparent" },
          animation: "fade",
        }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        {!hasOnboarded && (
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        )}
        {!authed && (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Otp" component={OtpScreen} />
          </>
        )}
        <Stack.Screen name="Tabs" component={AppTabs} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="ReadingSelection" component={ReadingSelectionScreen} />
        <Stack.Screen name="HandSelection" component={HandSelectionScreen} />
        <Stack.Screen name="Value" component={ValueScreen} />
        <Stack.Screen name="Payment" component={PaymentScreen} />
        <Stack.Screen name="PhotoUpload" component={PhotoUploadScreen} />
        <Stack.Screen name="Status" component={StatusScreen} />
        <Stack.Screen name="Report" component={ReportScreen} />
        <Stack.Screen name="Products" component={ProductsScreen} />
        <Stack.Screen name="Cart" component={CartScreen} />
        <Stack.Screen name="Chat" component={ChatScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
