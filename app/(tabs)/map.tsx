import { Text, View, TouchableOpacity, ScrollView } from "react-native";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

type FilterType = "all" | "demand" | "events" | "fuel" | "charging";

export default function MapScreen() {
  const colors = useColors();
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  // Mock data - será substituído por dados reais
  const demandAreas = [
    { id: 1, name: "Centro", level: "high", distance: "2.3 km" },
    { id: 2, name: "Zona Sul", level: "medium", distance: "5.1 km" },
    { id: 3, name: "Aeroporto", level: "high", distance: "12.8 km" },
  ];

  const events = [
    { id: 1, name: "Show no Estádio", time: "20:00", distance: "3.5 km" },
    { id: 2, name: "Festival de Música", time: "19:00", distance: "8.2 km" },
  ];

  const fuelStations = [
    { id: 1, name: "Posto Shell", price: "R$ 5,89", distance: "800m" },
    { id: 2, name: "Posto Ipiranga", price: "R$ 5,92", distance: "1.2 km" },
  ];

  const filters = [
    { id: "all", label: "Todos", icon: "map" },
    { id: "demand", label: "Demanda", icon: "chart.bar.fill" },
    { id: "events", label: "Eventos", icon: "star.fill" },
    { id: "fuel", label: "Combustível", icon: "car" },
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case "high":
        return "text-success";
      case "medium":
        return "text-warning";
      default:
        return "text-muted";
    }
  };

  const getLevelText = (level: string) => {
    switch (level) {
      case "high":
        return "Alta";
      case "medium":
        return "Média";
      default:
        return "Baixa";
    }
  };

  return (
    <ScreenContainer className="bg-background">
      <View className="flex-1">
        {/* Header */}
        <View className="px-4 pt-4 pb-3">
          <Text className="text-2xl font-bold text-foreground">Mapa e Demanda</Text>
          <Text className="text-sm text-muted mt-1">Encontre as melhores oportunidades</Text>
        </View>

        {/* Filtros */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="px-4 mb-4"
          contentContainerStyle={{ gap: 8 }}
        >
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.id}
              onPress={() => setActiveFilter(filter.id as FilterType)}
              className={`flex-row items-center gap-2 px-4 py-2 rounded-full border ${
                activeFilter === filter.id
                  ? "bg-primary border-primary"
                  : "bg-surface border-border"
              }`}
            >
              <IconSymbol
                name={filter.icon as any}
                size={18}
                color={activeFilter === filter.id ? colors.background : colors.foreground}
              />
              <Text
                className={`text-sm font-medium ${
                  activeFilter === filter.id ? "text-white" : "text-foreground"
                }`}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Placeholder do Mapa */}
        <View className="mx-4 mb-4 bg-surface rounded-2xl border border-border overflow-hidden" style={{ height: 300 }}>
          <View className="flex-1 items-center justify-center">
            <IconSymbol name="map" size={64} color={colors.muted} />
            <Text className="text-muted text-sm mt-3">Mapa será integrado em breve</Text>
            <Text className="text-muted text-xs mt-1">Expo Maps + Google Maps API</Text>
          </View>
        </View>

        {/* Lista de Locais */}
        <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
          {/* Áreas de Demanda */}
          {(activeFilter === "all" || activeFilter === "demand") && (
            <View className="mb-4">
              <Text className="text-base font-bold text-foreground mb-3">Áreas de Alta Demanda</Text>
              {demandAreas.map((area) => (
                <TouchableOpacity
                  key={area.id}
                  className="bg-surface rounded-2xl p-4 mb-2 border border-border active:opacity-70"
                >
                  <View className="flex-row items-center justify-between">
                    <View className="flex-1">
                      <Text className="text-base font-semibold text-foreground">{area.name}</Text>
                      <View className="flex-row items-center gap-2 mt-1">
                        <Text className={`text-sm font-medium ${getLevelColor(area.level)}`}>
                          {getLevelText(area.level)} demanda
                        </Text>
                        <Text className="text-muted text-xs">• {area.distance}</Text>
                      </View>
                    </View>
                    <IconSymbol name="chevron.right" size={20} color={colors.muted} />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Eventos */}
          {(activeFilter === "all" || activeFilter === "events") && (
            <View className="mb-4">
              <Text className="text-base font-bold text-foreground mb-3">Eventos Próximos</Text>
              {events.map((event) => (
                <TouchableOpacity
                  key={event.id}
                  className="bg-surface rounded-2xl p-4 mb-2 border border-border active:opacity-70"
                >
                  <View className="flex-row items-center justify-between">
                    <View className="flex-1">
                      <Text className="text-base font-semibold text-foreground">{event.name}</Text>
                      <View className="flex-row items-center gap-2 mt-1">
                        <Text className="text-sm text-warning font-medium">{event.time}</Text>
                        <Text className="text-muted text-xs">• {event.distance}</Text>
                      </View>
                    </View>
                    <IconSymbol name="star.fill" size={20} color={colors.warning} />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Postos de Combustível */}
          {(activeFilter === "all" || activeFilter === "fuel") && (
            <View className="mb-6">
              <Text className="text-base font-bold text-foreground mb-3">Postos de Combustível</Text>
              {fuelStations.map((station) => (
                <TouchableOpacity
                  key={station.id}
                  className="bg-surface rounded-2xl p-4 mb-2 border border-border active:opacity-70"
                >
                  <View className="flex-row items-center justify-between">
                    <View className="flex-1">
                      <Text className="text-base font-semibold text-foreground">{station.name}</Text>
                      <View className="flex-row items-center gap-2 mt-1">
                        <Text className="text-sm text-primary font-medium">{station.price}/L</Text>
                        <Text className="text-muted text-xs">• {station.distance}</Text>
                      </View>
                    </View>
                    <IconSymbol name="car" size={20} color={colors.primary} />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    </ScreenContainer>
  );
}
