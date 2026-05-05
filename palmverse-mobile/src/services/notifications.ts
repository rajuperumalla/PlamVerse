import messaging from "@react-native-firebase/messaging";
import { Platform } from "react-native";
import * as Notifications from "expo-notifications";

export async function registerForPush() {
  if (Platform.OS === "ios") {
    const auth = await messaging().requestPermission();
    if (auth !== messaging.AuthorizationStatus.AUTHORIZED) return null;
  }
  await Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
  return messaging().getToken();
}

export function onForegroundMessage(cb: (n: { title?: string; body?: string }) => void) {
  return messaging().onMessage(async (m) => {
    cb({ title: m.notification?.title, body: m.notification?.body });
  });
}
