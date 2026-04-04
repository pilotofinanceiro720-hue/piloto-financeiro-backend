import { Text, View, TouchableOpacity, ScrollView, TextInput } from "react-native";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

export default function MyVehicleScreen() {
  const colors = useColors();
  const [isEditing, setIsEditing] = useState(false);

  // Mock data - será substituído por dados reais
  const [vehicle, setVehicle] = useState({
    brand: "Toyota",
    model: "Corolla",
    year: 2019,
    licensePlate: "ABC-1234",
    mileage: 156800,
    fuelConsumption: 10.5, // km/l
    wearCoefficient: 1.0,
    maintenanceCostPerKm: 0.35,
  });

  const monthlyMaintenanceCost = 2500; // R$ estimado
  const estimatedMonthlyFuelCost = 1850; // R$ estimado
  const totalMonthlyVehicleCost = monthlyMaintenanceCost + estimatedMonthlyFuelCost;

  const handleSaveVehicle = () => {
    setIsEditing(false);
    // TODO: Salvar dados do veículo no backend
    console.log("Veículo atualizado", vehicle);
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-4 pt-4 pb-4">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-2xl font-bold text-foreground">Meu Veículo</Text>
              <Text className="text-sm text-muted mt-1">{vehicle.brand} {vehicle.model}</Text>
            </View>
            <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
              <View className="bg-primary/10 rounded-full p-3">
                <IconSymbol name="gear" size={20} color={colors.primary} />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Card do Veículo */}
        <View className="mx-4 mb-4 bg-gradient-to-br from-primary to-primary/80 rounded-3xl p-6 shadow-lg">
          <View className="flex-row items-center justify-between mb-4">
            <View>
              <Text className="text-white/80 text-sm font-medium">Veículo Registrado</Text>
              <Text className="text-white text-3xl font-bold mt-1">
                {vehicle.brand} {vehicle.model}
              </Text>
            </View>
            <IconSymbol name="car" size={48} color="#ffffff" />
          </View>
          <View className="bg-white/10 rounded-2xl p-3">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-white/70 text-xs">Ano</Text>
                <Text className="text-white text-lg font-bold">{vehicle.year}</Text>
              </View>
              <View className="w-px h-8 bg-white/20" />
              <View>
                <Text className="text-white/70 text-xs">Placa</Text>
                <Text className="text-white text-lg font-bold">{vehicle.licensePlate}</Text>
              </View>
              <View className="w-px h-8 bg-white/20" />
              <View>
                <Text className="text-white/70 text-xs">Quilometragem</Text>
                <Text className="text-white text-lg font-bold">{vehicle.mileage.toLocaleString()}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Informações do Veículo */}
        {isEditing ? (
          <View className="px-4 mb-4 bg-surface rounded-2xl p-4 border border-border space-y-3">
            <View>
              <Text className="text-sm font-medium text-foreground mb-2">Marca</Text>
              <TextInput
                className="bg-background border border-border rounded-xl px-4 py-3 text-foreground"
                value={vehicle.brand}
                onChangeText={(text) => setVehicle({ ...vehicle, brand: text })}
              />
            </View>
            <View>
              <Text className="text-sm font-medium text-foreground mb-2">Modelo</Text>
              <TextInput
                className="bg-background border border-border rounded-xl px-4 py-3 text-foreground"
                value={vehicle.model}
                onChangeText={(text) => setVehicle({ ...vehicle, model: text })}
              />
            </View>
            <View className="flex-row gap-3">
              <View className="flex-1">
                <Text className="text-sm font-medium text-foreground mb-2">Ano</Text>
                <TextInput
                  className="bg-background border border-border rounded-xl px-4 py-3 text-foreground"
                  value={vehicle.year.toString()}
                  onChangeText={(text) => setVehicle({ ...vehicle, year: parseInt(text) })}
                  keyboardType="numeric"
                />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-medium text-foreground mb-2">Placa</Text>
                <TextInput
                  className="bg-background border border-border rounded-xl px-4 py-3 text-foreground"
                  value={vehicle.licensePlate}
                  onChangeText={(text) => setVehicle({ ...vehicle, licensePlate: text })}
                />
              </View>
            </View>
            <View>
              <Text className="text-sm font-medium text-foreground mb-2">Quilometragem</Text>
              <TextInput
                className="bg-background border border-border rounded-xl px-4 py-3 text-foreground"
                value={vehicle.mileage.toString()}
                onChangeText={(text) => setVehicle({ ...vehicle, mileage: parseInt(text) })}
                keyboardType="numeric"
              />
            </View>
            <View>
              <Text className="text-sm font-medium text-foreground mb-2">Consumo (km/l)</Text>
              <TextInput
                className="bg-background border border-border rounded-xl px-4 py-3 text-foreground"
                value={vehicle.fuelConsumption.toString()}
                onChangeText={(text) => setVehicle({ ...vehicle, fuelConsumption: parseFloat(text) })}
                keyboardType="decimal-pad"
              />
            </View>
            <View>
              <Text className="text-sm font-medium text-foreground mb-2">Custo de Manutenção (R$/km)</Text>
              <TextInput
                className="bg-background border border-border rounded-xl px-4 py-3 text-foreground"
                value={vehicle.maintenanceCostPerKm.toString()}
                onChangeText={(text) => setVehicle({ ...vehicle, maintenanceCostPerKm: parseFloat(text) })}
                keyboardType="decimal-pad"
              />
            </View>
            <TouchableOpacity
              onPress={handleSaveVehicle}
              className="bg-primary rounded-full py-3 mt-2"
            >
              <Text className="text-white text-center text-base font-bold">Salvar Alterações</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="px-4 mb-4">
            <Text className="text-base font-bold text-foreground mb-3">Especificações</Text>
            <View className="bg-surface rounded-2xl p-4 border border-border space-y-3">
              <View className="flex-row items-center justify-between pb-3 border-b border-border">
                <View className="flex-row items-center gap-2">
                  <IconSymbol name="car" size={18} color={colors.primary} />
                  <Text className="text-sm text-foreground">Consumo de Combustível</Text>
                </View>
                <Text className="text-base font-bold text-foreground">{vehicle.fuelConsumption} km/l</Text>
              </View>
              <View className="flex-row items-center justify-between pb-3 border-b border-border">
                <View className="flex-row items-center gap-2">
                  <IconSymbol name="gear" size={18} color={colors.primary} />
                  <Text className="text-sm text-foreground">Coeficiente de Desgaste</Text>
                </View>
                <Text className="text-base font-bold text-foreground">{vehicle.wearCoefficient.toFixed(2)}x</Text>
              </View>
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                  <IconSymbol name="chart.bar.fill" size={18} color={colors.primary} />
                  <Text className="text-sm text-foreground">Custo de Manutenção</Text>
                </View>
                <Text className="text-base font-bold text-foreground">R$ {vehicle.maintenanceCostPerKm.toFixed(2)}/km</Text>
              </View>
            </View>
          </View>
        )}

        {/* Custos Mensais */}
        <View className="px-4 mb-4">
          <Text className="text-base font-bold text-foreground mb-3">Custos Mensais Estimados</Text>
          <View className="bg-surface rounded-2xl p-4 border border-border space-y-3">
            <View className="flex-row items-center justify-between pb-3 border-b border-border">
              <View className="flex-row items-center gap-2">
                <IconSymbol name="car" size={18} color={colors.error} />
                <Text className="text-sm text-foreground">Manutenção</Text>
              </View>
              <Text className="text-base font-bold text-error">R$ {monthlyMaintenanceCost.toFixed(2)}</Text>
            </View>
            <View className="flex-row items-center justify-between pb-3 border-b border-border">
              <View className="flex-row items-center gap-2">
                <IconSymbol name="chart.bar.fill" size={18} color={colors.warning} />
                <Text className="text-sm text-foreground">Combustível</Text>
              </View>
              <Text className="text-base font-bold text-warning">R$ {estimatedMonthlyFuelCost.toFixed(2)}</Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="text-sm font-semibold text-foreground">Total Mensal</Text>
              <Text className="text-lg font-bold text-error">R$ {totalMonthlyVehicleCost.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Alertas de Manutenção */}
        <View className="px-4 mb-6">
          <Text className="text-base font-bold text-foreground mb-3">Alertas de Manutenção</Text>
          <View className="gap-2">
            <View className="bg-warning/10 border border-warning/20 rounded-2xl p-4 flex-row items-start gap-3">
              <IconSymbol name="paperplane.fill" size={18} color={colors.warning} />
              <View className="flex-1">
                <Text className="text-sm font-semibold text-warning">Revisão em breve</Text>
                <Text className="text-xs text-muted mt-1">Próxima revisão em 5.000 km</Text>
              </View>
            </View>
            <View className="bg-primary/10 border border-primary/20 rounded-2xl p-4 flex-row items-start gap-3">
              <IconSymbol name="star.fill" size={18} color={colors.primary} />
              <View className="flex-1">
                <Text className="text-sm font-semibold text-primary">Troca de óleo</Text>
                <Text className="text-xs text-muted mt-1">Próxima troca em 2.500 km</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
