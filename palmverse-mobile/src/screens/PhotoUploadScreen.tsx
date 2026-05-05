import { useState } from "react";
import { View, Text, Pressable, Alert, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ScreenContainer } from "@/components/ui/ScreenContainer";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { GradientButton } from "@/components/ui/GradientButton";
import { useReadingStore } from "@/store/readingStore";
import { validatePalmImage } from "@/services/imageValidation";
import { uploadImage } from "@/services/upload";
import { submitReading } from "@/services/api";
import type { PalmImages } from "@/types";
import type { RootStackParamList } from "@/navigation/types";

type Nav = NativeStackNavigationProp<RootStackParamList>;

const slots: { key: keyof PalmImages; label: string; hint: string }[] = [
  { key: "frontPalm", label: "Front Palm", hint: "Open palm, fingers extended, good light" },
  { key: "sideView", label: "Side View", hint: "Side of palm, thumb facing camera" },
  { key: "thumbCloseup", label: "Thumb Close-up", hint: "Zoom on thumb pad" },
];

export function PhotoUploadScreen() {
  const nav = useNavigation<Nav>();
  const { images, setImage, profile, hand, paymentId, setReportId, setStatus } =
    useReadingStore();
  const [submitting, setSubmitting] = useState(false);

  const pick = async (key: keyof PalmImages) => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.85,
      allowsEditing: false,
    });
    if (result.canceled) return;
    const uri = result.assets[0].uri;
    const v = await validatePalmImage(uri);
    if (!v.ok) {
      Alert.alert("Retake required", v.reason ?? "Image quality is low.");
      return;
    }
    setImage(key, uri);
  };

  const ready = slots.every((s) => images[s.key]);

  const submit = async () => {
    if (!profile || !hand || !paymentId) {
      Alert.alert("Missing data", "Restart the flow.");
      return;
    }
    setSubmitting(true);
    try {
      const urls = await Promise.all(
        slots.map((s, i) => uploadImage(images[s.key]!, `${paymentId}-${i}.jpg`))
      );
      const { reportId } = await submitReading({
        orderId: paymentId,
        profile,
        hand,
        imageUrls: urls,
      });
      setReportId(reportId);
      setStatus("submitted");
      nav.reset({ index: 0, routes: [{ name: "Status" }] });
    } catch (e) {
      Alert.alert("Upload failed", (e as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScreenContainer>
      <ScreenHeader
        title="Capture your palm"
        subtitle="Use bright, even lighting. Hold steady."
      />
      {slots.map((s) => {
        const uri = images[s.key];
        return (
          <Pressable key={s.key} onPress={() => pick(s.key)} className="mb-3">
            <GlassCard className={uri ? "border-success" : ""}>
              <View className="flex-row items-center">
                {uri ? (
                  <Image
                    source={{ uri }}
                    style={{ width: 64, height: 64, borderRadius: 12 }}
                  />
                ) : (
                  <View className="h-16 w-16 items-center justify-center rounded-xl border border-dashed border-glass-border">
                    <Text className="text-text-muted">+</Text>
                  </View>
                )}
                <View className="ml-4 flex-1">
                  <Text className="font-cinzel text-base text-text-primary">{s.label}</Text>
                  <Text className="mt-1 font-raleway text-xs text-text-muted">{s.hint}</Text>
                </View>
                {uri && <Text className="text-success">✓</Text>}
              </View>
            </GlassCard>
          </Pressable>
        );
      })}
      <View className="mt-4">
        <GradientButton
          label="Submit for Review"
          variant="aurora"
          loading={submitting}
          disabled={!ready}
          onPress={submit}
        />
      </View>
    </ScreenContainer>
  );
}
