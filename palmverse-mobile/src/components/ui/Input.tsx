import { TextInput, TextInputProps, View, Text } from "react-native";
import { forwardRef } from "react";

interface Props extends TextInputProps {
  label?: string;
  error?: string;
}

export const Input = forwardRef<TextInput, Props>(({ label, error, ...rest }, ref) => {
  return (
    <View className="mb-4">
      {label && (
        <Text className="mb-2 font-raleway text-xs uppercase tracking-widest text-text-secondary">
          {label}
        </Text>
      )}
      <TextInput
        ref={ref}
        placeholderTextColor="#8b87a8"
        className="rounded-2xl border border-glass-border bg-glass px-4 py-4 font-raleway text-base text-text-primary"
        {...rest}
      />
      {error && (
        <Text className="mt-1 font-raleway text-xs text-danger">{error}</Text>
      )}
    </View>
  );
});
Input.displayName = "Input";
