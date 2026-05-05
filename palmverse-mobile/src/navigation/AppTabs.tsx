import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text, View } from "react-native";
import { BlurView } from "expo-blur";
import { HomeScreen } from "@/screens/HomeScreen";
import { ReadingsScreen } from "@/screens/ReadingsScreen";
import { ProductsScreen } from "@/screens/ProductsScreen";
import { ChatScreen } from "@/screens/ChatScreen";
import { ProfileTabScreen } from "@/screens/ProfileTabScreen";

const Tab = createBottomTabNavigator();

const icon = (label: string, focused: boolean) => (
  <Text
    style={{
      color: focused ? "#22d3ee" : "#8b87a8",
      fontSize: 11,
      letterSpacing: 1,
    }}
  >
    {label.toUpperCase()}
  </Text>
);

export function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          backgroundColor: "transparent",
          borderTopWidth: 0,
          elevation: 0,
          height: 72,
        },
        tabBarBackground: () => (
          <BlurView
            tint="dark"
            intensity={40}
            style={{ flex: 1, borderTopWidth: 1, borderColor: "rgba(255,255,255,0.1)" }}
          />
        ),
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarIcon: ({ focused }) => <View>{icon("Home", focused)}</View> }}
      />
      <Tab.Screen
        name="Readings"
        component={ReadingsScreen}
        options={{ tabBarIcon: ({ focused }) => <View>{icon("Readings", focused)}</View> }}
      />
      <Tab.Screen
        name="Shop"
        component={ProductsScreen}
        options={{ tabBarIcon: ({ focused }) => <View>{icon("Shop", focused)}</View> }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{ tabBarIcon: ({ focused }) => <View>{icon("Chat", focused)}</View> }}
      />
      <Tab.Screen
        name="Me"
        component={ProfileTabScreen}
        options={{ tabBarIcon: ({ focused }) => <View>{icon("Me", focused)}</View> }}
      />
    </Tab.Navigator>
  );
}
