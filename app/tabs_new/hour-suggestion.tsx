import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";

// ============================================================================
// PILOTO FINANCEIRO — Sugestão de Horário Ideal para Sair
// Combina histórico pessoal + eventos da cidade
// ============================================================================

interface HourSuggestionProps {
  dayOfWeek: string;
  primaryWindow: string;
  secondaryWindow: string;
  reason: string;
  eventHighlight?: string;
  driverProfile: "fixo" | "nomade";
  mainRegion?: string;
}

export default function HourSuggestion({
  dayOfWeek,
  primaryWindow,
  secondaryWindow,
  reason,
  eventHighlight,
  driverProfile,
  mainRegion,
}: HourSuggestionProps) {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>📅 Seu dia de hoje — {dayOfWeek}</Text>

      {/* Perfil */}
      <View style={styles.profileBadge}>
        <Text style={styles.profileText}>
          {driverProfile === "fixo"
            ? `📍 Motorista fixo — ${mainRegion}`
            : "🗺️ Motorista nômade — múltiplas regiões"}
        </Text>
      </View>

      {/* Janela principal */}
      <View style={styles.card}>
        <Text style={styles.cardLabel}>Melhor janela para hoje</Text>
        <Text style={styles.cardValue}>{primaryWindow}</Text>
        <Text style={styles.cardReason}>{reason}</Text>
      </View>

      {/* Janela secundária */}
      <View style={[styles.card, styles.cardSecondary]}>
        <Text style={styles.cardLabel}>Segunda janela</Text>
        <Text style={styles.cardValue}>{secondaryWindow}</Text>
      </View>

      {/* Evento em destaque */}
      {eventHighlight && (
        <View style={styles.eventCard}>
          <Text style={styles.eventLabel}>🎯 Evento em destaque</Text>
          <Text style={styles.eventText}>{eventHighlight}</Text>
          <Text style={styles.eventHint}>
            Esteja na região 1-2h antes do início para aproveitar a demanda.
          </Text>
        </View>
      )}

      {/* Aviso */}
      <View style={styles.disclaimer}>
        <Text style={styles.disclaimerText}>
          ⚠️ Sugestões baseadas no seu histórico pessoal e eventos cadastrados.
          Demanda real pode variar. O app não garante ganhos.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0a0f1a", padding: 16 },
  title: { color: "#fff", fontSize: 20, fontWeight: "bold", marginBottom: 12 },
  profileBadge: {
    backgroundColor: "#1a2235",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 16,
    alignSelf: "flex-start",
  },
  profileText: { color: "#aaa", fontSize: 13 },
  card: {
    backgroundColor: "#1a2235",
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#1A8A2F",
  },
  cardSecondary: { borderLeftColor: "#2a4a8a" },
  cardLabel: { color: "#888", fontSize: 12, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 },
  cardValue: { color: "#1A8A2F", fontSize: 24, fontWeight: "bold", marginBottom: 6 },
  cardReason: { color: "#aaa", fontSize: 13 },
  eventCard: {
    backgroundColor: "#1a2235",
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#f59e0b",
  },
  eventLabel: { color: "#f59e0b", fontSize: 13, fontWeight: "bold", marginBottom: 8 },
  eventText: { color: "#fff", fontSize: 15, marginBottom: 8 },
  eventHint: { color: "#888", fontSize: 13 },
  disclaimer: { backgroundColor: "#111827", borderRadius: 12, padding: 14, marginBottom: 24 },
  disclaimerText: { color: "#666", fontSize: 12, lineHeight: 18 },
});
