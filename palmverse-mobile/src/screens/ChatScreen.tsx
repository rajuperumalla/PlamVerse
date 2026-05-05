import { useState } from "react";
import { View, Text, FlatList, TextInput, Pressable, KeyboardAvoidingView, Platform } from "react-native";
import { ScreenContainer } from "@/components/ui/ScreenContainer";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { useChatStore } from "@/store/chatStore";

export function ChatScreen() {
  const { messages, add } = useChatStore();
  const [text, setText] = useState("");

  const send = () => {
    if (!text.trim()) return;
    add({ role: "user", text });
    setText("");
    setTimeout(
      () =>
        add({
          role: "editor",
          text: "Got it. Our editor will reply within a few hours.",
        }),
      900
    );
  };

  return (
    <ScreenContainer scroll={false}>
      <ScreenHeader title="Chat with Editor" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <FlatList
          data={messages}
          keyExtractor={(m) => m.id}
          contentContainerStyle={{ paddingBottom: 16 }}
          renderItem={({ item }) => {
            const me = item.role === "user";
            const sys = item.role === "system";
            return (
              <View
                className={`mb-2 max-w-[80%] rounded-2xl px-4 py-3 ${
                  sys
                    ? "self-center bg-glass"
                    : me
                      ? "self-end bg-nebula-violet"
                      : "self-start bg-glass border border-glass-border"
                }`}
              >
                <Text
                  className={`font-raleway text-sm ${me ? "text-white" : "text-text-primary"}`}
                >
                  {item.text}
                </Text>
              </View>
            );
          }}
        />
        <View className="flex-row items-center rounded-2xl border border-glass-border bg-glass px-3 py-2">
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Type a message"
            placeholderTextColor="#8b87a8"
            className="flex-1 font-raleway text-base text-text-primary"
          />
          <Pressable
            onPress={send}
            className="ml-2 rounded-full bg-nebula-cyan px-4 py-2"
          >
            <Text className="font-raleway-bold text-xs text-cosmos-900">Send</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}
