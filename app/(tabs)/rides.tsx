import { Text, View, TouchableOpacity, ScrollView, TextInput } from "react-native";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

type TabType = "history" | "new";

export default function RidesScreen() {
  const colors = useColors();
  const [activeTab, setActiveTab] = useState<TabType>("history");
  
  // Form state para nova corrida
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [pricePerKm, setPricePerKm] = useState("2.50");
  const [pricePerMinute, setPricePerMinute] = useState("0.50");
  const [multiplier, setMultiplier] = useState("1.0");
  const [includeTolls, setIncludeTolls] = useState(false);

  // Mock data - histórico de corridas
  const ridesHistory = [
    {
      id: 1,
      origin: "Centro",
      destination: "Zona Sul",
      distance: 8.5,
      duration: 25,
      netProfit: 28.50,
      date: "Hoje, 15:30",
      status: "completed",
    },
    {
      id: 2,
      origin: "Aeroporto",
      destination: "Centro",
      distance: 15.2,
      duration: 35,
      netProfit: 45.80,
      date: "Hoje, 12:15",
      status: "completed",
    },
    {
      id: 3,
      origin: "Zona Norte",
      destination: "Shopping",
      distance: 6.3,
      duration: 18,
      netProfit: 19.20,
      date: "Ontem, 18:45",
      status: "completed",
    },
  ];

  const handleStartRide = () => {
    // TODO: Implementar lógica de início de corrida
    console.log("Iniciando corrida", { origin, destination, pricePerKm, pricePerMinute, multiplier, includeTolls });
  };

  return (
    <ScreenContainer className="bg-background">
      <View className="flex-1">
        {/* Header */}
        <View className="px-4 pt-4 pb-3">
          <Text className="text-2xl font-bold text-foreground">Corridas</Text>
          <Text className="text-sm text-muted mt-1">Gerencie suas corridas e histórico</Text>
        </View>

        {/* Tabs */}
        <View className="flex-row px-4 mb-4 gap-2">
          <TouchableOpacity
            onPress={() => setActiveTab("history")}
            className={`flex-1 py-3 rounded-full ${
              activeTab === "history" ? "bg-primary" : "bg-surface border border-border"
            }`}
          >
            <Text
              className={`text-center text-sm font-semibold ${
                activeTab === "history" ? "text-white" : "text-foreground"
              }`}
            >
              Histórico
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab("new")}
            className={`flex-1 py-3 rounded-full ${
              activeTab === "new" ? "bg-primary" : "bg-surface border border-border"
            }`}
          >
            <Text
              className={`text-center text-sm font-semibold ${
                activeTab === "new" ? "text-white" : "text-foreground"
              }`}
            >
              Nova Corrida
            </Text>
          </TouchableOpacity>
        </View>

        {/* Conteúdo */}
        <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
          {activeTab === "history" ? (
            // Histórico de Corridas
            <View className="pb-6">
              {ridesHistory.map((ride) => (
                <TouchableOpacity
                  key={ride.id}
                  className="bg-surface rounded-2xl p-4 mb-3 border border-border active:opacity-70"
                >
                  <View className="flex-row items-start justify-between mb-3">
                    <View className="flex-1">
                      <Text className="text-base font-bold text-foreground">{ride.origin}</Text>
                      <View className="flex-row items-center gap-1 my-1">
                        <IconSymbol name="chevron.right" size={12} color={colors.muted} />
                      </View>
                      <Text className="text-base font-bold text-foreground">{ride.destination}</Text>
                    </View>
                    <View className="items-end">
                      <Text className="text-lg font-bold text-success">
                        +R$ {ride.netProfit.toFixed(2)}
                      </Text>
                      <Text className="text-xs text-muted mt-0.5">{ride.date}</Text>
                    </View>
                  </View>
                  <View className="flex-row items-center gap-4 pt-3 border-t border-border">
                    <View className="flex-row items-center gap-1">
                      <IconSymbol name="map" size={14} color={colors.muted} />
                      <Text className="text-xs text-muted">{ride.distance} km</Text>
                    </View>
                    <View className="flex-row items-center gap-1">
                      <IconSymbol name="calendar" size={14} color={colors.muted} />
                      <Text className="text-xs text-muted">{ride.duration} min</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            // Formulário Nova Corrida
            <View className="pb-6">
              {/* Origem */}
              <View className="mb-4">
                <Text className="text-sm font-medium text-foreground mb-2">Origem</Text>
                <TextInput
                  className="bg-surface border border-border rounded-xl px-4 py-3 text-foreground"
                  placeholder="Digite o local de origem"
                  placeholderTextColor={colors.muted}
                  value={origin}
                  onChangeText={setOrigin}
                />
              </View>

              {/* Destino */}
              <View className="mb-4">
                <Text className="text-sm font-medium text-foreground mb-2">Destino</Text>
                <TextInput
                  className="bg-surface border border-border rounded-xl px-4 py-3 text-foreground"
                  placeholder="Digite o local de destino"
                  placeholderTextColor={colors.muted}
                  value={destination}
                  onChangeText={setDestination}
                />
              </View>

              {/* Tarifas */}
              <View className="bg-surface rounded-2xl p-4 mb-4 border border-border">
                <Text className="text-base font-bold text-foreground mb-3">Tarifas</Text>
                
                <View className="flex-row gap-3 mb-3">
                  <View className="flex-1">
                    <Text className="text-xs text-muted mb-2">Valor por km</Text>
                    <TextInput
                      className="bg-background border border-border rounded-xl px-3 py-2 text-foreground"
                      placeholder="2.50"
                      placeholderTextColor={colors.muted}
                      value={pricePerKm}
                      onChangeText={setPricePerKm}
                      keyboardType="decimal-pad"
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-xs text-muted mb-2">Valor por min</Text>
                    <TextInput
                      className="bg-background border border-border rounded-xl px-3 py-2 text-foreground"
                      placeholder="0.50"
                      placeholderTextColor={colors.muted}
                      value={pricePerMinute}
                      onChangeText={setPricePerMinute}
                      keyboardType="decimal-pad"
                    />
                  </View>
                </View>

                <View className="flex-row gap-3">
                  <View className="flex-1">
                    <Text className="text-xs text-muted mb-2">Multiplicador</Text>
                    <TextInput
                      className="bg-background border border-border rounded-xl px-3 py-2 text-foreground"
                      placeholder="1.0"
                      placeholderTextColor={colors.muted}
                      value={multiplier}
                      onChangeText={setMultiplier}
                      keyboardType="decimal-pad"
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-xs text-muted mb-2">Pedágios</Text>
                    <TouchableOpacity
                      onPress={() => setIncludeTolls(!includeTolls)}
                      className={`rounded-xl px-3 py-2 border ${
                        includeTolls ? "bg-primary border-primary" : "bg-background border-border"
                      }`}
                    >
                      <Text
                        className={`text-center text-sm font-medium ${
                          includeTolls ? "text-white" : "text-foreground"
                        }`}
                      >
                        {includeTolls ? "Incluir" : "Não incluir"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* Estimativa */}
              <View className="bg-primary/10 rounded-2xl p-4 mb-4 border border-primary/20">
                <Text className="text-sm font-medium text-primary mb-2">Estimativa</Text>
                <Text className="text-xs text-muted">
                  Preencha origem e destino para ver a estimativa de custo e lucro
                </Text>
              </View>

              {/* Botão Iniciar */}
              <TouchableOpacity
                onPress={handleStartRide}
                className="bg-primary rounded-full py-4 shadow-md active:opacity-80"
                disabled={!origin || !destination}
              >
                <Text className="text-white text-center text-lg font-bold">Iniciar Corrida</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </View>
    </ScreenContainer>
  );
}
