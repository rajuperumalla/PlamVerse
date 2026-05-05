// Firebase wrapper. Requires google-services.json (Android) and
// GoogleService-Info.plist (iOS) committed to native projects.
// TODO: place files at android/app/ and ios/PalmVerse/ then run `expo prebuild`.
import auth from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import Constants from "expo-constants";

GoogleSignin.configure({
  webClientId:
    (Constants.expoConfig?.extra as { googleWebClientId?: string })?.googleWebClientId ?? "",
});

export async function sendOtp(phoneE164: string) {
  return auth().signInWithPhoneNumber(phoneE164);
}

export async function googleSignIn() {
  await GoogleSignin.hasPlayServices();
  const userInfo = await GoogleSignin.signIn();
  const idToken = (userInfo as unknown as { idToken: string }).idToken;
  const credential = auth.GoogleAuthProvider.credential(idToken);
  return auth().signInWithCredential(credential);
}

export async function signOut() {
  await auth().signOut();
  await GoogleSignin.signOut().catch(() => {});
}
