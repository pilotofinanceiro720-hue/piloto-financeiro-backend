import { ScrollView, Text, View } from "react-native";
import { ScreenContainer } from "@/components/screen-container";

export default function PlansScreen() {
  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 gap-4">
          <Text className="text-3xl font-bold text-foreground">Planos</Text>
          <Text className="text-base text-muted">Assinatura e upgrade em construção</Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
