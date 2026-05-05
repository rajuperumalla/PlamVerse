import { useEffect, useState } from "react";
import { View, Text, ScrollView, Alert } from "react-native";
import * as Sharing from "expo-sharing";
import * as Print from "expo-print";
import { useRoute, useNavigation } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ScreenContainer } from "@/components/ui/ScreenContainer";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { GradientButton } from "@/components/ui/GradientButton";
import { Skeleton } from "@/components/ui/Skeleton";
import { getReportStatus } from "@/services/api";
import type { RootStackParamList } from "@/navigation/types";

type Nav = NativeStackNavigationProp<RootStackParamList>;

interface ReportData {
  sections: { title: string; body: string }[];
  pdfUrl?: string;
}

export function ReportScreen() {
  const nav = useNavigation<Nav>();
  const route = useRoute<RouteProp<RootStackParamList, "Report">>();
  const { reportId } = route.params;
  const [data, setData] = useState<ReportData | null>(null);

  useEffect(() => {
    getReportStatus(reportId)
      .then((r) => setData(r.report ?? r))
      .catch((e) => Alert.alert("Could not load", (e as Error).message));
  }, [reportId]);

  const share = async () => {
    if (!data?.pdfUrl) return Alert.alert("PDF not ready");
    if (await Sharing.isAvailableAsync()) Sharing.shareAsync(data.pdfUrl);
  };

  const printToPdf = async () => {
    if (!data) return;
    const html = `
      <html><body style="font-family:serif;padding:24px">
      ${data.sections
        .map((s) => `<h2>${s.title}</h2><p>${s.body}</p>`)
        .join("")}
      </body></html>`;
    const { uri } = await Print.printToFileAsync({ html });
    if (await Sharing.isAvailableAsync()) Sharing.shareAsync(uri);
  };

  if (!data) {
    return (
      <ScreenContainer>
        <ScreenHeader title="Your reading" />
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} style={{ height: 100, marginBottom: 16 }} />
        ))}
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <ScreenHeader title="Your reading" subtitle="Cosmic insights, expert-verified." />
      <ScrollView showsVerticalScrollIndicator={false}>
        {data.sections.map((s) => (
          <GlassCard key={s.title} className="mb-3">
            <Text className="font-cinzel text-lg text-text-primary">{s.title}</Text>
            <Text className="mt-2 font-raleway text-sm leading-6 text-text-secondary">
              {s.body}
            </Text>
          </GlassCard>
        ))}
      </ScrollView>
      <View className="mt-6 flex-row gap-3">
        <View className="flex-1">
          <GradientButton label="Share" variant="ghost" onPress={share} />
        </View>
        <View className="flex-1">
          <GradientButton label="Download PDF" variant="aurora" onPress={printToPdf} />
        </View>
      </View>
      <View className="mt-3">
        <GradientButton
          label="See Recommended Stones"
          variant="ghost"
          onPress={() => nav.navigate("Products")}
        />
      </View>
    </ScreenContainer>
  );
}
