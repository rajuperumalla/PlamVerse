import { Image, Pressable, Text, View, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ScreenContainer } from "@/components/ui/ScreenContainer";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { GradientButton } from "@/components/ui/GradientButton";
import { useCartStore } from "@/store/cartStore";
import type { Product } from "@/types";
import type { RootStackParamList } from "@/navigation/types";

type Nav = NativeStackNavigationProp<RootStackParamList>;

const sample: Product[] = [
  {
    id: "p1",
    name: "Amethyst Ring",
    type: "ring",
    price: 1499,
    imageUrl: "https://placehold.co/200x200/7c3aed/ffffff?text=Amethyst",
    description: "Calms Saturn, sharpens intuition.",
  },
  {
    id: "p2",
    name: "Pearl Stone",
    type: "stone",
    price: 899,
    imageUrl: "https://placehold.co/200x200/22d3ee/ffffff?text=Pearl",
    description: "Strengthens Moon, eases emotions.",
  },
  {
    id: "p3",
    name: "Ruby Ring",
    type: "ring",
    price: 2499,
    imageUrl: "https://placehold.co/200x200/ff4dd2/ffffff?text=Ruby",
    description: "Energises Sun, builds confidence.",
  },
];

export function ProductsScreen() {
  const nav = useNavigation<Nav>();
  const add = useCartStore((s) => s.add);
  const items = useCartStore((s) => s.items);

  return (
    <ScreenContainer scroll={false}>
      <ScreenHeader title="Recommended for you" subtitle="Energise the planets in your chart." />
      <FlatList
        data={sample}
        keyExtractor={(p) => p.id}
        contentContainerStyle={{ paddingBottom: 120 }}
        renderItem={({ item }) => (
          <GlassCard className="mb-3">
            <View className="flex-row">
              <Image
                source={{ uri: item.imageUrl }}
                style={{ width: 80, height: 80, borderRadius: 12 }}
              />
              <View className="ml-4 flex-1">
                <Text className="font-cinzel text-lg text-text-primary">{item.name}</Text>
                <Text className="mt-1 font-raleway text-xs text-text-muted">
                  {item.description}
                </Text>
                <View className="mt-2 flex-row items-center justify-between">
                  <Text className="font-cinzel text-base text-nebula-cyan">₹{item.price}</Text>
                  <Pressable
                    onPress={() => add(item)}
                    className="rounded-full border border-nebula-cyan px-4 py-1.5"
                  >
                    <Text className="font-raleway text-xs text-nebula-cyan">Add</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </GlassCard>
        )}
      />
      {items.length > 0 && (
        <View className="absolute bottom-6 left-6 right-6">
          <GradientButton
            label={`View Cart (${items.length})`}
            variant="aurora"
            onPress={() => nav.navigate("Cart")}
          />
        </View>
      )}
    </ScreenContainer>
  );
}
