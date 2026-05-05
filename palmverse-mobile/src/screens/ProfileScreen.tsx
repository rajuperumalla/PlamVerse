import { useState } from "react";
import { View, Text, Pressable, Alert, FlatList } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ScreenContainer } from "@/components/ui/ScreenContainer";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { Input } from "@/components/ui/Input";
import { GradientButton } from "@/components/ui/GradientButton";
import { StepProgress } from "@/components/ui/StepProgress";
import { useReadingStore } from "@/store/readingStore";
import { autocompletePlaces, getPlaceLatLng, type PlaceSuggestion } from "@/services/places";
import type { RootStackParamList } from "@/navigation/types";

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function ProfileScreen() {
  const nav = useNavigation<Nav>();
  const setProfile = useReadingStore((s) => s.setProfile);
  const [name, setName] = useState("");
  const [dob, setDob] = useState<Date | null>(null);
  const [tobEnabled, setTobEnabled] = useState(false);
  const [tob, setTob] = useState<Date | null>(null);
  const [showDob, setShowDob] = useState(false);
  const [showTob, setShowTob] = useState(false);
  const [placeQuery, setPlaceQuery] = useState("");
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [place, setPlace] = useState<{ name: string; lat: number; lng: number } | null>(null);

  const onPlaceQueryChange = async (q: string) => {
    setPlaceQuery(q);
    setPlace(null);
    setSuggestions(await autocompletePlaces(q).catch(() => []));
  };

  const pickPlace = async (s: PlaceSuggestion) => {
    setPlaceQuery(s.description);
    setSuggestions([]);
    try {
      const r = await getPlaceLatLng(s.placeId);
      setPlace({ name: s.description, lat: r.lat, lng: r.lng });
    } catch {
      Alert.alert("Could not fetch coordinates");
    }
  };

  const next = () => {
    if (!name || !dob || !place)
      return Alert.alert("Missing info", "Fill name, DOB, and birthplace.");
    setProfile({
      fullName: name,
      dob: dob.toISOString(),
      tobEnabled,
      tob: tob?.toISOString(),
      placeOfBirth: place,
    });
    nav.navigate("ReadingSelection");
  };

  return (
    <ScreenContainer>
      <StepProgress step={1} label="Your details" />
      <ScreenHeader title="Tell us about you" subtitle="Birth details improve accuracy." />
      <GlassCard>
        <Input label="Full name" value={name} onChangeText={setName} placeholder="Jane Doe" />
        <Pressable onPress={() => setShowDob(true)} className="mb-4">
          <Text className="mb-2 font-raleway text-xs uppercase tracking-widest text-text-secondary">
            Date of birth
          </Text>
          <View className="rounded-2xl border border-glass-border bg-glass px-4 py-4">
            <Text className="font-raleway text-base text-text-primary">
              {dob ? dob.toLocaleDateString() : "Tap to select"}
            </Text>
          </View>
        </Pressable>
        {showDob && (
          <DateTimePicker
            value={dob ?? new Date(2000, 0, 1)}
            mode="date"
            maximumDate={new Date()}
            onChange={(_, d) => {
              setShowDob(false);
              if (d) setDob(d);
            }}
          />
        )}
        <Pressable
          onPress={() => setTobEnabled((v) => !v)}
          className="mb-4 flex-row items-center justify-between rounded-2xl border border-glass-border bg-glass px-4 py-4"
        >
          <Text className="font-raleway text-base text-text-primary">Add time of birth</Text>
          <View className={`h-6 w-11 rounded-full ${tobEnabled ? "bg-nebula-violet" : "bg-glass-border"}`}>
            <View
              className={`h-6 w-6 rounded-full bg-white ${tobEnabled ? "ml-5" : ""}`}
            />
          </View>
        </Pressable>
        {tobEnabled && (
          <Pressable onPress={() => setShowTob(true)} className="mb-4">
            <View className="rounded-2xl border border-glass-border bg-glass px-4 py-4">
              <Text className="font-raleway text-base text-text-primary">
                {tob ? tob.toLocaleTimeString() : "Tap to select time"}
              </Text>
            </View>
          </Pressable>
        )}
        {showTob && (
          <DateTimePicker
            value={tob ?? new Date()}
            mode="time"
            onChange={(_, d) => {
              setShowTob(false);
              if (d) setTob(d);
            }}
          />
        )}
        <Input
          label="Place of birth"
          value={placeQuery}
          onChangeText={onPlaceQueryChange}
          placeholder="City, Country"
        />
        {suggestions.length > 0 && (
          <View className="mb-4 max-h-48 rounded-2xl border border-glass-border bg-cosmos-700">
            <FlatList
              data={suggestions}
              keyExtractor={(s) => s.placeId}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => pickPlace(item)}
                  className="border-b border-glass-border px-4 py-3"
                >
                  <Text className="font-raleway text-sm text-text-primary">
                    {item.description}
                  </Text>
                </Pressable>
              )}
            />
          </View>
        )}
        {place && (
          <Text className="mb-2 font-raleway text-xs text-nebula-cyan">
            ✓ {place.lat.toFixed(2)}, {place.lng.toFixed(2)}
          </Text>
        )}
      </GlassCard>
      <View className="mt-6">
        <GradientButton label="Continue" variant="aurora" onPress={next} />
      </View>
    </ScreenContainer>
  );
}
