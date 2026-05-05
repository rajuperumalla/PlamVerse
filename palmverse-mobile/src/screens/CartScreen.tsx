import { View, Text, FlatList, Pressable, Alert } from "react-native";
import { ScreenContainer } from "@/components/ui/ScreenContainer";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { GradientButton } from "@/components/ui/GradientButton";
import { useCartStore } from "@/store/cartStore";
import { payWithRazorpay } from "@/services/payment";

export function CartScreen() {
  const { items, remove, total, clear } = useCartStore();
  const sum = total();

  const checkout = async () => {
    try {
      await payWithRazorpay(sum, "products");
      clear();
      Alert.alert("Order placed", "We'll ship within 3-5 days.");
    } catch (e) {
      Alert.alert("Payment failed", (e as Error).message);
    }
  };

  return (
    <ScreenContainer scroll={false}>
      <ScreenHeader title="Your cart" />
      <FlatList
        data={items}
        keyExtractor={(i) => i.product.id}
        ListEmptyComponent={
          <Text className="mt-12 text-center font-raleway text-text-muted">
            Cart is empty
          </Text>
        }
        renderItem={({ item }) => (
          <GlassCard className="mb-3">
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="font-cinzel text-base text-text-primary">
                  {item.product.name}
                </Text>
                <Text className="font-raleway text-xs text-text-muted">
                  Qty {item.qty} • ₹{item.product.price}
                </Text>
              </View>
              <Pressable onPress={() => remove(item.product.id)}>
                <Text className="font-raleway text-xs text-danger">Remove</Text>
              </Pressable>
            </View>
          </GlassCard>
        )}
      />
      {items.length > 0 && (
        <View className="mt-4">
          <View className="mb-4 flex-row justify-between">
            <Text className="font-raleway text-base text-text-secondary">Total</Text>
            <Text className="font-cinzel text-xl text-text-primary">₹{sum}</Text>
          </View>
          <GradientButton label="Checkout" variant="aurora" onPress={checkout} />
        </View>
      )}
    </ScreenContainer>
  );
}
