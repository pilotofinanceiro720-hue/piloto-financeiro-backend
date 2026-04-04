import { Text, View, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

interface DemandArea {
  id: number;
  name: string;
  demandLevel: "low" | "medium" | "high";
  eventType?: string;
  distance?: number;
}

interface FuelStation {
  id: number;
  name: string;
  fuelPrice?: number;
  hasElectricCharging: boolean;
  distance?: number;
}

export default function MapViewScreen() {
  const colors = useColors();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<"demand" | "fuel">("demand");
  const [currentLocation, setCurrentLocation] = useState({ lat: -23.5505, lng: -46.6333 }); // São Paulo

  const [demandAreas] = useState<DemandArea[]>([
    {
      id: 1,
      name: "Centro - Pico de Demanda",
      demandLevel: "high",
      eventType: "Rush Hour",
      distance: 2.5,
    },
    {
      id: 2,
      name: "Aeroporto",
      demandLevel: "medium",
      eventType: "Aeroporto",
      distance: 15.3,
    },
    {
      id: 3,
      name: "Estação de Trem",
      demandLevel: "medium",
      eventType: "Transporte",
      distance: 3.8,
    },
  ]);

  const [fuelStations] = useState<FuelStation[]>([
    {
      id: 1,
      name: "Posto Shell",
      fuelPrice: 5.89,
      hasElectricCharging: true,
      distance: 1.2,
    },
    {
      id: 2,
      name: "Posto Ipiranga",
      fuelPrice: 5.79,
      hasElectricCharging: false,
      distance: 2.1,
    },
    {
      id: 3,
      name: "Posto BR",
      fuelPrice: 5.99,
      hasElectricCharging: true,
      distance: 4.5,
    },
  ]);

  useEffect(() => {
    // Simular carregamento de mapa
    setTimeout(() => setIsLoading(false), 1500);
  }, []);

  const getDemandColor = (level: string) => {
    switch (level) {
      case "high":
        return colors.error;
      case "medium":
        return colors.warning;
      case "low":
        return colors.success;
      default:
        return colors.muted;
    }
  };

  const getDemandLabel = (level: string) => {
    switch (level) {
      case "high":
        return "Alta Demanda";
      case "medium":
        return "Demanda Média";
      case "low":
        return "Baixa Demanda";
      default:
        return "Desconhecida";
    }
  };

  return (
    <ScreenContainer className="bg-background">
      {/* Mapa */}
      <View className="h-64 bg-gray-200 relative mb-4">
        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color={colors.primary} />
            <Text className="text-muted text-sm mt-2">Carregando mapa...</Text>
          </View>
        ) : (
          <View className="flex-1 bg-gradient-to-br from-blue-50 to-blue-100 items-center justify-center">
            <Text className="text-muted text-sm">Mapa interativo</Text>
            <Text className="text-muted text-xs mt-1">São Paulo, SP</Text>
          </View>
        )}

        {/* Botão de Localização */}
        <TouchableOpacity className="absolute bottom-4 right-4 bg-white rounded-full p-3 shadow-lg">
          <IconSymbol name="map" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Filtros */}
      <View className="px-4 mb-4 flex-row gap-2">
        <TouchableOpacity
          onPress={() => setSelectedFilter("demand")}
          className={`flex-1 rounded-full py-2 ${
            selectedFilter === "demand"
              ? "bg-primary"
              : "bg-surface border border-border"
          }`}
        >
          <Text
            className={`text-center text-sm font-semibold ${
              selectedFilter === "demand" ? "text-white" : "text-foreground"
            }`}
          >
            Demanda
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setSelectedFilter("fuel")}
          className={`flex-1 rounded-full py-2 ${
            selectedFilter === "fuel"
              ? "bg-primary"
              : "bg-surface border border-border"
          }`}
        >
          <Text
            className={`text-center text-sm font-semibold ${
              selectedFilter === "fuel" ? "text-white" : "text-foreground"
            }`}
          >
            Combustível
          </Text>
        </TouchableOpacity>
      </View>

      {/* Lista */}
      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {selectedFilter === "demand" ? (
          <View className="gap-3 pb-6">
            <Text className="text-base font-bold text-foreground mb-2">
              Áreas de Demanda Próximas
            </Text>
            {demandAreas.map((area) => (
              <TouchableOpacity
                key={area.id}
                className="bg-surface rounded-2xl p-4 border border-border active:opacity-70"
              >
                <View className="flex-row items-start justify-between mb-2">
                  <View className="flex-1">
                    <Text className="text-base font-bold text-foreground">
                      {area.name}
                    </Text>
                    <View className="flex-row items-center gap-2 mt-1">
                      <View
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: getDemandColor(area.demandLevel) }}
                      />
                      <Text className="text-xs text-muted">
                        {getDemandLabel(area.demandLevel)}
                      </Text>
                    </View>
                  </View>
                  <View className="bg-primary/10 px-3 py-1 rounded-full">
                    <Text className="text-xs font-bold text-primary">
                      {area.distance?.toFixed(1)} km
                    </Text>
                  </View>
                </View>
                {area.eventType && (
                  <Text className="text-xs text-muted mt-2">
                    📍 {area.eventType}
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View className="gap-3 pb-6">
            <Text className="text-base font-bold text-foreground mb-2">
              Postos de Combustível Próximos
            </Text>
            {fuelStations.map((station) => (
              <TouchableOpacity
                key={station.id}
                className="bg-surface rounded-2xl p-4 border border-border active:opacity-70"
              >
                <View className="flex-row items-start justify-between mb-2">
                  <View className="flex-1">
                    <Text className="text-base font-bold text-foreground">
                      {station.name}
                    </Text>
                    <View className="flex-row items-center gap-2 mt-2">
                      {station.hasElectricCharging && (
                        <View className="bg-success/10 px-2 py-1 rounded">
                          <Text className="text-xs font-semibold text-success">
                            ⚡ Carregamento
                          </Text>
                        </View>
                      )}
                      <View className="bg-primary/10 px-2 py-1 rounded">
                        <Text className="text-xs font-bold text-primary">
                          {station.distance?.toFixed(1)} km
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
                {station.fuelPrice && (
                  <View className="flex-row items-center justify-between pt-2 border-t border-border">
                    <Text className="text-xs text-muted">Preço do Combustível</Text>
                    <Text className="text-sm font-bold text-foreground">
                      R$ {station.fuelPrice.toFixed(2)}/l
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Botão de Ação */}
      <View className="px-4 pb-4">
        <TouchableOpacity className="bg-primary rounded-full py-4 active:opacity-80">
          <Text className="text-white text-center text-base font-bold">
            {selectedFilter === "demand"
              ? "Ir para Área de Demanda"
              : "Ir para Posto de Combustível"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
}
