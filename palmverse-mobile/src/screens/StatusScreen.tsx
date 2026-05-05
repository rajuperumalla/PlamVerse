import { useEffect } from "react";
import { View, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ScreenContainer } from "@/components/ui/ScreenContainer";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { GradientButton } from "@/components/ui/GradientButton";
import { useReadingStore } from "@/store/readingStore";
import { getReportStatus } from "@/services/api";
import type { ReportStatus } from "@/types";
import type { RootStackParamList } from "@/navigation/types";

type Nav = NativeStackNavigationProp<RootStackParamList>;

const stages: { id: ReportStatus; label: string }[] = [
  { id: "submitted", label: "Submitted" },
  { id: "under_review", label: "Under Review" },
  { id: "approved", label: "Expert Approved" },
  { id: "ready", label: "Report Ready" },
];

export function StatusScreen() {
  const nav = useNavigation<Nav>();
  const { reportId, status, setStatus } = useReadingStore();

  useEffect(() => {
    if (!reportId) return;
    const t = setInterval(async () => {
      try {
        const r = await getReportStatus(reportId);
        if (r.status) setStatus(r.status);
      } catch {}
    }, 5000);
    return () => clearInterval(t);
  }, [reportId]);

  const currentIdx = stages.findIndex((s) => s.id === status);

  return (
    <ScreenContainer>
      <ScreenHeader
        title="Reading in progress"
        subtitle="We'll notify you when your report is ready."
      />
      <GlassCard>
        {stages.map((s, i) => (
          <View key={s.id} className="mb-4 flex-row items-center">
            <View
              className={`mr-4 h-8 w-8 items-center justify-center rounded-full ${
                i <= currentIdx ? "bg-nebula-cyan" : "border border-glass-border"
              }`}
            >
              <Text className="text-xs text-cosmos-900">{i <= currentIdx ? "✓" : i + 1}</Text>
            </View>
            <Text
              className={`font-raleway text-base ${
                i <= currentIdx ? "text-text-primary" : "text-text-muted"
              }`}
            >
              {s.label}
            </Text>
          </View>
        ))}
      </GlassCard>
      {status === "ready" && reportId && (
        <View className="mt-6">
          <GradientButton
            label="View Report"
            variant="aurora"
            onPress={() => nav.navigate("Report", { reportId })}
          />
        </View>
      )}
      <View className="mt-4">
        <GradientButton
          label="Chat with Editor"
          variant="ghost"
          onPress={() => nav.navigate("Chat")}
        />
      </View>
    </ScreenContainer>
  );
}
