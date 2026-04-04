import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Share, Alert } from "react-native";

// ============================================================================
// PILOTO FINANCEIRO — Compartilhar Conquista
// Gera card com link rastreável go.pilotofinanceiro.com.br/app
// ============================================================================

interface ConquistaProps {
  type: "meta_diaria" | "recorde_dia" | "meta_mensal" | "corridas_100" | "score_100";
  value?: number;
  driverName: string;
  referralCode?: string;
}

function getConquistaContent(props: ConquistaProps): { emoji: string; title: string; body: string } {
  const { type, value, driverName } = props;

  switch (type) {
    case "meta_diaria":
      return {
        emoji: "🎯",
        title: "Meta do dia batida!",
        body: `${driverName} bateu a meta do dia${value ? ` — R$ ${value.toFixed(2)}` : ""} no Piloto Financeiro!`,
      };
    case "recorde_dia":
      return {
        emoji: "🔥",
        title: "Novo recorde!",
        body: `${driverName} bateu um novo recorde${value ? `: R$ ${value.toFixed(2)} em um único dia` : ""}!`,
      };
    case "meta_mensal":
      return {
        emoji: "💰",
        title: "Meta do mês atingida!",
        body: `${driverName} atingiu a meta mensal${value ? ` de R$ ${value.toFixed(2)}` : ""}!`,
      };
    case "corridas_100":
      return {
        emoji: "🚗",
        title: "100 corridas!",
        body: `${driverName} completou 100 corridas este mês no Piloto Financeiro!`,
      };
    case "score_100":
      return {
        emoji: "⭐",
        title: "Score perfeito!",
        body: `${driverName} atingiu score de eficiência 100/100!`,
      };
    default:
      return { emoji: "🏆", title: "Conquista desbloqueada!", body: `${driverName} conquistou mais um objetivo!` };
  }
}

function buildShareLink(referralCode?: string): string {
  const base = "https://go.pilotofinanceiro.com.br/app";
  if (referralCode) return `${base}?ref=${referralCode}&src=share`;
  return `${base}?src=share`;
}

export default function ShareConquista({ type, value, driverName, referralCode }: ConquistaProps) {
  const { emoji, title, body } = getConquistaContent({ type, value, driverName, referralCode });
  const shareLink = buildShareLink(referralCode);

  const handleShare = async () => {
    try {
      const message = `${emoji} ${title}\n\n${body}\n\nGerencie suas corridas com o Piloto Financeiro:\n${shareLink}`;

      await Share.share({
        message,
        title: `${emoji} ${title} — Piloto Financeiro`,
      });
    } catch (err) {
      Alert.alert("Erro", "Não foi possível compartilhar. Tente novamente.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Card visual da conquista */}
      <View style={styles.card}>
        <Text style={styles.emoji}>{emoji}</Text>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.body}>{body}</Text>
        <View style={styles.divider} />
        <Text style={styles.appName}>Piloto Financeiro</Text>
        <Text style={styles.slogan}>Gestão inteligente que transforma sua rotina.</Text>
      </View>

      {/* Link de download */}
      <View style={styles.linkCard}>
        <Text style={styles.linkLabel}>Link de download</Text>
        <Text style={styles.link}>{shareLink}</Text>
        {referralCode && (
          <Text style={styles.referralNote}>
            ✅ Seu código de indicação está incluído — você ganha comissão se alguém assinar!
          </Text>
        )}
      </View>

      {/* Botão compartilhar */}
      <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
        <Text style={styles.shareBtnText}>📤 Compartilhar conquista</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0a0f1a", padding: 20 },
  card: {
    backgroundColor: "#1a2235",
    borderRadius: 20,
    padding: 28,
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 2,
    borderColor: "#1A8A2F",
  },
  emoji: { fontSize: 52, marginBottom: 12 },
  title: { color: "#fff", fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 10 },
  body: { color: "#ccc", fontSize: 16, textAlign: "center", lineHeight: 24 },
  divider: { height: 1, backgroundColor: "#2a3550", width: "100%", marginVertical: 16 },
  appName: { color: "#1A8A2F", fontSize: 16, fontWeight: "bold", marginBottom: 4 },
  slogan: { color: "#666", fontSize: 12, textAlign: "center" },
  linkCard: {
    backgroundColor: "#1a2235",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  linkLabel: { color: "#888", fontSize: 12, marginBottom: 6 },
  link: { color: "#1A8A2F", fontSize: 14, fontWeight: "bold", marginBottom: 8 },
  referralNote: { color: "#aaa", fontSize: 12, lineHeight: 18 },
  shareBtn: {
    backgroundColor: "#1A8A2F",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
  },
  shareBtnText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
