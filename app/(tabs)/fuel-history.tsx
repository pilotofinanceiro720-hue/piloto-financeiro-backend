import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
} from "react-native";

// ============================================================================
// PILOTO FINANCEIRO — Histórico de Preço do Combustível
// Motorista registra ao abastecer; app calcula custo/km automaticamente
// ============================================================================

interface Refuel {
  id: string;
  date: string;
  pricePerLiter: number;
  liters: number;
  total: number;
  fuelType: string;
}

// TODO: substituir por trpc.fuel.list.useQuery() e trpc.fuel.add.useMutation()
const mockRefuels: Refuel[] = [
  { id: "1", date: "12/03/2026", pricePerLiter: 6.19, liters: 40, total: 247.60, fuelType: "Gasolina" },
  { id: "2", date: "28/02/2026", pricePerLiter: 6.08, liters: 38, total: 231.04, fuelType: "Gasolina" },
  { id: "3", date: "14/02/2026", pricePerLiter: 5.97, liters: 41, total: 244.77, fuelType: "Gasolina" },
];

// Consumo médio em km/litro (vem do perfil do veículo do motorista)
const AVG_CONSUMPTION_KM_PER_LITER = 11.5;

export default function FuelHistory() {
  const [refuels, setRefuels] = useState<Refuel[]>(mockRefuels);
  const [showForm, setShowForm] = useState(false);
  const [price, setPrice] = useState("");
  const [liters, setLiters] = useState("");
  const [fuelType, setFuelType] = useState("Gasolina");

  const latestPrice = refuels[0]?.pricePerLiter ?? 0;
  const costPerKm = latestPrice > 0
    ? (latestPrice / AVG_CONSUMPTION_KM_PER_LITER).toFixed(2)
    : "—";

  const handleAdd = () => {
    const p = parseFloat(price.replace(",", "."));
    const l = parseFloat(liters.replace(",", "."));
    if (isNaN(p) || isNaN(l) || p <= 0 || l <= 0) {
      Alert.alert("Atenção", "Informe valores válidos para preço e litros.");
      return;
    }
    const newRefuel: Refuel = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString("pt-BR"),
      pricePerLiter: p,
      liters: l,
      total: parseFloat((p * l).toFixed(2)),
      fuelType,
    };
    setRefuels([newRefuel, ...refuels]);
    setPrice("");
    setLiters("");
    setShowForm(false);
    // TODO: trpc.fuel.add.mutate(newRefuel)
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>⛽ Combustível</Text>

      {/* Custo atual por km */}
      <View style={styles.costCard}>
        <Text style={styles.costLabel}>Custo/km atual</Text>
        <Text style={styles.costValue}>R$ {costPerKm}/km</Text>
        <Text style={styles.costSub}>
          Baseado no último abastecimento (R$ {latestPrice.toFixed(2)}/L)
          e consumo do seu veículo ({AVG_CONSUMPTION_KM_PER_LITER} km/L)
        </Text>
      </View>

      {/* Botão adicionar */}
      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => setShowForm(!showForm)}
      >
        <Text style={styles.addBtnText}>
          {showForm ? "Cancelar" : "+ Registrar abastecimento"}
        </Text>
      </TouchableOpacity>

      {/* Formulário */}
      {showForm && (
        <View style={styles.form}>
          <Text style={styles.formTitle}>Novo abastecimento</Text>

          {/* Tipo de combustível */}
          <View style={styles.fuelTypeRow}>
            {["Gasolina", "Etanol", "Flex", "Elétrico"].map((type) => (
              <TouchableOpacity
                key={type}
                style={[styles.fuelTypeBtn, fuelType === type && styles.fuelTypeBtnActive]}
                onPress={() => setFuelType(type)}
              >
                <Text style={[styles.fuelTypeBtnText, fuelType === type && styles.fuelTypeBtnTextActive]}>
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            style={styles.input}
            placeholder="Preço por litro (R$)"
            placeholderTextColor="#555"
            keyboardType="decimal-pad"
            value={price}
            onChangeText={setPrice}
          />
          <TextInput
            style={styles.input}
            placeholder="Litros abastecidos"
            placeholderTextColor="#555"
            keyboardType="decimal-pad"
            value={liters}
            onChangeText={setLiters}
          />

          {price && liters && (
            <Text style={styles.totalPreview}>
              Total: R$ {(parseFloat(price.replace(",", ".") || "0") * parseFloat(liters.replace(",", ".") || "0")).toFixed(2)}
            </Text>
          )}

          <TouchableOpacity style={styles.saveBtn} onPress={handleAdd}>
            <Text style={styles.saveBtnText}>Salvar</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Histórico */}
      <Text style={styles.historyTitle}>Histórico</Text>
      {refuels.map((r, i) => (
        <View key={r.id} style={[styles.refuelCard, i === 0 && styles.refuelCardLatest]}>
          <View style={styles.refuelRow}>
            <Text style={styles.refuelDate}>{r.date}</Text>
            <Text style={styles.refuelType}>{r.fuelType}</Text>
          </View>
          <View style={styles.refuelRow}>
            <Text style={styles.refuelPrice}>R$ {r.pricePerLiter.toFixed(2)}/L</Text>
            <Text style={styles.refuelLiters}>{r.liters}L</Text>
            <Text style={styles.refuelTotal}>R$ {r.total.toFixed(2)}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0a0f1a", padding: 16 },
  title: { color: "#fff", fontSize: 20, fontWeight: "bold", marginBottom: 16 },
  costCard: {
    backgroundColor: "#1a2235",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#1A8A2F",
  },
  costLabel: { color: "#888", fontSize: 12, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 },
  costValue: { color: "#1A8A2F", fontSize: 28, fontWeight: "bold", marginBottom: 6 },
  costSub: { color: "#666", fontSize: 12, lineHeight: 18 },
  addBtn: {
    backgroundColor: "#1A8A2F",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 16,
  },
  addBtnText: { color: "#fff", fontSize: 15, fontWeight: "bold" },
  form: { backgroundColor: "#1a2235", borderRadius: 16, padding: 16, marginBottom: 16 },
  formTitle: { color: "#fff", fontSize: 16, fontWeight: "bold", marginBottom: 12 },
  fuelTypeRow: { flexDirection: "row", gap: 8, marginBottom: 12, flexWrap: "wrap" },
  fuelTypeBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: "#2a3550" },
  fuelTypeBtnActive: { backgroundColor: "#1A8A2F", borderColor: "#1A8A2F" },
  fuelTypeBtnText: { color: "#888", fontSize: 13 },
  fuelTypeBtnTextActive: { color: "#fff" },
  input: {
    backgroundColor: "#0a0f1a",
    borderRadius: 10,
    padding: 14,
    color: "#fff",
    fontSize: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#2a3550",
  },
  totalPreview: { color: "#1A8A2F", fontSize: 16, fontWeight: "bold", textAlign: "center", marginBottom: 12 },
  saveBtn: { backgroundColor: "#1A8A2F", borderRadius: 10, paddingVertical: 12, alignItems: "center" },
  saveBtnText: { color: "#fff", fontSize: 15, fontWeight: "bold" },
  historyTitle: { color: "#888", fontSize: 13, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 },
  refuelCard: {
    backgroundColor: "#1a2235",
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#2a3550",
  },
  refuelCardLatest: { borderColor: "#1A8A2F" },
  refuelRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 4 },
  refuelDate: { color: "#aaa", fontSize: 13 },
  refuelType: { color: "#666", fontSize: 12 },
  refuelPrice: { color: "#fff", fontSize: 15, fontWeight: "bold" },
  refuelLiters: { color: "#888", fontSize: 14 },
  refuelTotal: { color: "#1A8A2F", fontSize: 15, fontWeight: "bold" },
});
