import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";

type Period = "today" | "month";

interface PlatformStats {
  platform: string;
  emoji: string;
  ratePerHour: number;
  ratePerKm: number;
  rides: number;
}

// TODO: substituir por trpc.platformComparator.get.useQuery({ period })
const mockData: Record<Period, PlatformStats[]> = {
  today: [
    { platform: "Uber", emoji: "🟡", ratePerHour: 32.4, ratePerKm: 1.42, rides: 8 },
    { platform: "99", emoji: "🔵", ratePerHour: 36.1, ratePerKm: 1.68, rides: 4 },
    { platform: "InDrive", emoji: "⚫", ratePerHour: 29.8, ratePerKm: 1.31, rides: 2 },
  ],
  month: [
    { platform: "Uber", emoji: "🟡", ratePerHour: 31.2, ratePerKm: 1.38, rides: 143 },
    { platform: "99", emoji: "🔵", ratePerHour: 36.1, ratePerKm: 1.68, rides: 89 },
    { platform: "InDrive", emoji: "⚫", ratePerHour: 29.8, ratePerKm: 1.31, rides: 21 },
  ],
};

function getInsight(stats: PlatformStats[]): string {
  if (stats.length < 2) return "";
  const sorted = [...stats].sort((a, b) => b.ratePerHour - a.ratePerHour);
  const best = sorted[0];
  const worst = sorted[sorted.length - 1];
  const diffHour = (best.ratePerHour - worst.ratePerHour).toFixed(2);
  const diffKm = (best.ratePerKm - worst.ratePerKm).toFixed(2);
  return `A ${best.platform} está rendendo R$${diffHour}/h e R$${diffKm}/km a mais que ${worst.platform}`;
}

export default function PlatformComparator() {
  const [period, setPeriod] = useState<Period>("today");
  const stats = mockData[period];
  const sorted = [...stats].sort((a, b) => b.ratePerHour - a.ratePerHour);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Suas Plataformas</Text>

      <View style={styles.toggle}>
        {(["today", "month"] as Period[]).map((p) => (
          <TouchableOpacity
            key={p}
            style={[styles.toggleBtn, period === p && styles.toggleActive]}
            onPress={() => setPeriod(p)}
          >
            <Text style={[styles.toggleText, period === p && styles.toggleTextActive]}>
              {p === "today" ? "Hoje" : "Este mês"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {sorted.map((s, i) => (
        <View key={s.platform} style={[styles.card, i === 0 && styles.cardBest]}>
          <View style={styles.cardHeader}>
            <Text style={styles.platformName}>{s.emoji} {s.platform}</Text>
            {i === 0 && <Text style={styles.badge}>Melhor</Text>}
          </View>
          <View style={styles.metrics}>
            <View style={styles.metric}>
              <Text style={styles.metricValue}>R$ {s.ratePerHour.toFixed(2)}/h</Text>
              <Text style={styles.metricLabel}>por hora</Text>
            </View>
            <View style={styles.metric}>
              <Text style={styles.metricValue}>R$ {s.ratePerKm.toFixed(2)}/km</Text>
              <Text style={styles.metricLabel}>por km</Text>
            </View>
            <View style={styles.metric}>
              <Text style={styles.metricValue}>{s.rides}</Text>
              <Text style={styles.metricLabel}>corridas</Text>
            </View>
          </View>
        </View>
      ))}

      <View style={styles.insight}>
        <Text style={styles.insightEmoji}>💡</Text>
        <Text style={styles.insightText}>{getInsight(sorted)}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0a0f1a", padding: 16 },
  title: { color: "#fff", fontSize: 20, fontWeight: "bold", marginBottom: 16 },
  toggle: { flexDirection: "row", backgroundColor: "#1a2235", borderRadius: 10, marginBottom: 16, padding: 4 },
  toggleBtn: { flex: 1, paddingVertical: 8, alignItems: "center", borderRadius: 8 },
  toggleActive: { backgroundColor: "#1A8A2F" },
  toggleText: { color: "#888", fontSize: 14, fontWeight: "600" },
  toggleTextActive: { color: "#fff" },
  card: { backgroundColor: "#1a2235", borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: "#2a3550" },
  cardBest: { borderColor: "#1A8A2F", borderWidth: 2 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  platformName: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  badge: { backgroundColor: "#1A8A2F", color: "#fff", fontSize: 11, fontWeight: "bold", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  metrics: { flexDirection: "row", justifyContent: "space-between" },
  metric: { alignItems: "center" },
  metricValue: { color: "#1A8A2F", fontSize: 16, fontWeight: "bold" },
  metricLabel: { color: "#888", fontSize: 11, marginTop: 2 },
  insight: { backgroundColor: "#1a2235", borderRadius: 12, padding: 16, marginBottom: 24, borderLeftWidth: 3, borderLeftColor: "#1A8A2F", flexDirection: "row", gap: 8 },
  insightEmoji: { fontSize: 18 },
  insightText: { color: "#ccc", fontSize: 14, lineHeight: 20, flex: 1 },
});
