import { ScrollView, Text, View } from "react-native";
import { ScreenContainer } from "@/components/screen-container";

export default function DashboardScreen() {
  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 gap-4">
          <Text className="text-3xl font-bold text-foreground">Dashboard</Text>
          <Text className="text-base text-muted">Tela inicial em construção</Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
