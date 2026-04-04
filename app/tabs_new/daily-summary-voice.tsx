import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Platform,
} from "react-native";
import * as Speech from "expo-speech";

// ============================================================================
// PILOTO FINANCEIRO — Resumo Diário com Voz
// Toca automaticamente ao encerrar o dia (configurável nas preferências)
// ============================================================================

interface DailySummaryProps {
  summary: string; // Texto gerado pelo Gemini
  autoSpeak?: boolean; // true = toca automaticamente
  onClose?: () => void;
}

export default function DailySummaryScreen({
  summary,
  autoSpeak = true,
  onClose,
}: DailySummaryProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(autoSpeak);
  const hasAutoPlayed = useRef(false);

  // Toca automaticamente na primeira renderização se autoSpeak=true
  useEffect(() => {
    if (autoSpeak && !hasAutoPlayed.current && summary) {
      hasAutoPlayed.current = true;
      handleSpeak();
    }
    return () => {
      Speech.stop();
    };
  }, [summary, autoSpeak]);

  const handleSpeak = () => {
    if (isSpeaking) {
      Speech.stop();
      setIsSpeaking(false);
      return;
    }

    if (!summary) return;

    setIsSpeaking(true);
    Speech.speak(summary, {
      language: "pt-BR",
      pitch: 1.0,
      rate: Platform.OS === "android" ? 0.9 : 0.85,
      onDone: () => setIsSpeaking(false),
      onStopped: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>🏁 Resumo do seu dia</Text>

      {/* Card do resumo */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryText}>{summary || "Carregando resumo..."}</Text>
      </View>

      {/* Controle de voz */}
      <View style={styles.voiceCard}>
        <TouchableOpacity
          style={[styles.speakBtn, isSpeaking && styles.speakBtnActive]}
          onPress={handleSpeak}
          disabled={!summary}
        >
          <Text style={styles.speakBtnIcon}>{isSpeaking ? "⏸️" : "🔊"}</Text>
          <Text style={styles.speakBtnText}>
            {isSpeaking ? "Pausar leitura" : "Ouvir resumo"}
          </Text>
        </TouchableOpacity>

        <View style={styles.voiceToggleRow}>
          <Text style={styles.voiceToggleLabel}>Leitura automática ao encerrar o dia</Text>
          <Switch
            value={voiceEnabled}
            onValueChange={(val) => {
              setVoiceEnabled(val);
              // TODO: salvar preferência via trpc.user.updatePreferences
            }}
            trackColor={{ false: "#2a3550", true: "#1A8A2F" }}
            thumbColor="#fff"
          />
        </View>
        <Text style={styles.voiceHint}>
          Altere nas configurações → Preferências → Resumo com voz
        </Text>
      </View>

      {/* Botão fechar */}
      {onClose && (
        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
          <Text style={styles.closeBtnText}>Fechar e salvar dia</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0a0f1a" },
  content: { padding: 20, paddingBottom: 40 },
  title: { color: "#fff", fontSize: 22, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  summaryCard: {
    backgroundColor: "#1a2235",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#1A8A2F",
  },
  summaryText: { color: "#ddd", fontSize: 16, lineHeight: 26 },
  voiceCard: { backgroundColor: "#1a2235", borderRadius: 16, padding: 20, marginBottom: 20 },
  speakBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1A8A2F",
    borderRadius: 12,
    paddingVertical: 14,
    gap: 10,
    marginBottom: 16,
  },
  speakBtnActive: { backgroundColor: "#0d6e24" },
  speakBtnIcon: { fontSize: 20 },
  speakBtnText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  voiceToggleRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 },
  voiceToggleLabel: { color: "#ccc", fontSize: 14, flex: 1, marginRight: 12 },
  voiceHint: { color: "#666", fontSize: 12 },
  closeBtn: {
    backgroundColor: "#2a3550",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  closeBtnText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
