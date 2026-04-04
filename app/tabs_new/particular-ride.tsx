import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";

// ============================================================================
// PILOTO FINANCEIRO — Corrida Particular
// Motorista define seus próprios valores; app calcula o preço ideal
// Camada 2: integração Google Maps para calcular rota + pedágios automaticamente
// ============================================================================

interface PriceTable {
  ratePerKm: number;
  ratePerMinute: number;
  multiplier: number;
  minimumFare: number;
}

const DEFAULT_TABLE: PriceTable = {
  ratePerKm: 1.80,
  ratePerMinute: 0.60,
  multiplier: 1.0,
  minimumFare: 25.00,
};

interface RouteInfo {
  distanceKm: number;
  durationMinutes: number;
  tollsTotal: number; // Camada 2 — Google Maps
}

function calcFare(route: RouteInfo, table: PriceTable): number {
  const base = route.distanceKm * table.ratePerKm + route.durationMinutes * table.ratePerMinute;
  const withMultiplier = base * table.multiplier;
  const withTolls = withMultiplier + route.tollsTotal;
  return Math.max(withTolls, table.minimumFare);
}

export default function ParticularRide() {
  const [table, setTable] = useState<PriceTable>(DEFAULT_TABLE);
  const [editingTable, setEditingTable] = useState(false);

  // Entrada manual da rota (Camada 2: substituir por Google Maps)
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [tolls, setTolls] = useState("0");
  const [result, setResult] = useState<number | null>(null);

  const handleCalc = () => {
    const d = parseFloat(distance.replace(",", "."));
    const t = parseFloat(duration.replace(",", "."));
    const toll = parseFloat(tolls.replace(",", ".") || "0");

    if (isNaN(d) || isNaN(t) || d <= 0 || t <= 0) {
      Alert.alert("Atenção", "Informe distância e tempo válidos.");
      return;
    }

    const fare = calcFare({ distanceKm: d, durationMinutes: t, tollsTotal: toll }, table);
    setResult(fare);
  };

  const updateTable = (field: keyof PriceTable, value: string) => {
    const num = parseFloat(value.replace(",", "."));
    if (!isNaN(num) && num > 0) {
      setTable((prev) => ({ ...prev, [field]: num }));
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🚗 Corrida Particular</Text>

      {/* Tabela de preços do motorista */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Minha tabela de preços</Text>
          <TouchableOpacity onPress={() => setEditingTable(!editingTable)}>
            <Text style={styles.editBtn}>{editingTable ? "Salvar" : "Editar"}</Text>
          </TouchableOpacity>
        </View>

        {editingTable ? (
          <View>
            {[
              { label: "R$ por km", field: "ratePerKm" as keyof PriceTable, value: table.ratePerKm },
              { label: "R$ por minuto", field: "ratePerMinute" as keyof PriceTable, value: table.ratePerMinute },
              { label: "Multiplicador", field: "multiplier" as keyof PriceTable, value: table.multiplier },
              { label: "Mínimo da corrida (R$)", field: "minimumFare" as keyof PriceTable, value: table.minimumFare },
            ].map(({ label, field, value }) => (
              <View key={field} style={styles.inputRow}>
                <Text style={styles.inputLabel}>{label}</Text>
                <TextInput
                  style={styles.input}
                  defaultValue={value.toString()}
                  keyboardType="decimal-pad"
                  onChangeText={(v) => updateTable(field, v)}
                />
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.tableDisplay}>
            <View style={styles.tableRow}>
              <Text style={styles.tableLabel}>R$/km</Text>
              <Text style={styles.tableValue}>R$ {table.ratePerKm.toFixed(2)}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableLabel}>R$/minuto</Text>
              <Text style={styles.tableValue}>R$ {table.ratePerMinute.toFixed(2)}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableLabel}>Multiplicador</Text>
              <Text style={styles.tableValue}>{table.multiplier}x</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableLabel}>Mínimo</Text>
              <Text style={styles.tableValue}>R$ {table.minimumFare.toFixed(2)}</Text>
            </View>
          </View>
        )}
      </View>

      {/* Calculadora de rota */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Calcular valor da corrida</Text>

        {/* TODO Camada 2: substituir por campo de endereço + Google Maps */}
        <Text style={styles.layer2Note}>
          📍 Camada 2: entrada por endereço com cálculo automático de rota e pedágios via Google Maps
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Distância estimada (km)"
          placeholderTextColor="#555"
          keyboardType="decimal-pad"
          value={distance}
          onChangeText={setDistance}
        />
        <TextInput
          style={styles.input}
          placeholder="Tempo estimado (minutos)"
          placeholderTextColor="#555"
          keyboardType="decimal-pad"
          value={duration}
          onChangeText={setDuration}
        />
        <TextInput
          style={styles.input}
          placeholder="Pedágios (R$) — opcional"
          placeholderTextColor="#555"
          keyboardType="decimal-pad"
          value={tolls}
          onChangeText={setTolls}
        />

        <TouchableOpacity style={styles.calcBtn} onPress={handleCalc}>
          <Text style={styles.calcBtnText}>Calcular valor</Text>
        </TouchableOpacity>
      </View>

      {/* Resultado */}
      {result !== null && (
        <View style={styles.resultCard}>
          <Text style={styles.resultLabel}>Valor sugerido</Text>
          <Text style={styles.resultValue}>R$ {result.toFixed(2)}</Text>

          <View style={styles.resultBreakdown}>
            <Text style={styles.breakdownTitle}>Composição:</Text>
            <Text style={styles.breakdownItem}>
              Distância: {distance}km × R${table.ratePerKm.toFixed(2)} = R${(parseFloat(distance || "0") * table.ratePerKm).toFixed(2)}
            </Text>
            <Text style={styles.breakdownItem}>
              Tempo: {duration}min × R${table.ratePerMinute.toFixed(2)} = R${(parseFloat(duration || "0") * table.ratePerMinute).toFixed(2)}
            </Text>
            {parseFloat(tolls || "0") > 0 && (
              <Text style={styles.breakdownItem}>Pedágios: R$ {parseFloat(tolls).toFixed(2)}</Text>
            )}
            {table.multiplier !== 1 && (
              <Text style={styles.breakdownItem}>Multiplicador: {table.multiplier}x</Text>
            )}
            {result === table.minimumFare && (
              <Text style={styles.minimumNote}>⚠️ Valor mínimo aplicado</Text>
            )}
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0a0f1a", padding: 16 },
  title: { color: "#fff", fontSize: 20, fontWeight: "bold", marginBottom: 16 },
  card: { backgroundColor: "#1a2235", borderRadius: 16, padding: 16, marginBottom: 16 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  cardTitle: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  editBtn: { color: "#1A8A2F", fontSize: 14, fontWeight: "bold" },
  tableDisplay: {},
  tableRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "#2a3550" },
  tableLabel: { color: "#888", fontSize: 14 },
  tableValue: { color: "#fff", fontSize: 14, fontWeight: "600" },
  inputRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 },
  inputLabel: { color: "#aaa", fontSize: 13, flex: 1 },
  input: {
    backgroundColor: "#0a0f1a",
    borderRadius: 10,
    padding: 12,
    color: "#fff",
    fontSize: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#2a3550",
    flex: 1,
  },
  layer2Note: { color: "#555", fontSize: 12, marginBottom: 12, fontStyle: "italic" },
  calcBtn: { backgroundColor: "#1A8A2F", borderRadius: 10, paddingVertical: 14, alignItems: "center", marginTop: 4 },
  calcBtnText: { color: "#fff", fontSize: 15, fontWeight: "bold" },
  resultCard: {
    backgroundColor: "#1a2235",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: "#1A8A2F",
  },
  resultLabel: { color: "#888", fontSize: 12, textTransform: "uppercase", marginBottom: 4 },
  resultValue: { color: "#1A8A2F", fontSize: 36, fontWeight: "bold", marginBottom: 16 },
  resultBreakdown: { borderTopWidth: 1, borderTopColor: "#2a3550", paddingTop: 12 },
  breakdownTitle: { color: "#888", fontSize: 12, marginBottom: 6 },
  breakdownItem: { color: "#aaa", fontSize: 13, marginBottom: 4 },
  minimumNote: { color: "#f59e0b", fontSize: 13, marginTop: 4 },
});
