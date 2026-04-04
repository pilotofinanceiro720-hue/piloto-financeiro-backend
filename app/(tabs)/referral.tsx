import { Text, View, ScrollView, TouchableOpacity, Share, ActivityIndicator } from "react-native";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

export default function ReferralScreen() {
  const colors = useColors();
  const [isLoading, setIsLoading] = useState(false);
  const referralCode = "DRV12345";
  const referralLink = `https://driverfinance.app/ref/${referralCode}`;

  const stats = {
    totalReferrals: 12,
    activeReferrals: 8,
    totalCommissions: 1250.5,
    pendingCommissions: 350.0,
    paidCommissions: 900.5,
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Ei! Estou usando Driver Finance para gerenciar minhas finanças como motorista. Ganhe R$ 10 de bônus com meu código: ${referralCode} ou clique aqui: ${referralLink}`,
        url: referralLink,
        title: "Convide um amigo para Driver Finance",
      });
    } catch (error) {
      console.error("Erro ao compartilhar:", error);
    }
  };

  const handleCopyCode = () => {
    // TODO: Copiar para clipboard
    console.log("Código copiado:", referralCode);
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-4 pt-4 pb-4">
          <Text className="text-2xl font-bold text-foreground">Programa de Referência</Text>
          <Text className="text-sm text-muted mt-1">Ganhe comissões indicando amigos</Text>
        </View>

        {/* Card Principal */}
        <View className="px-4 mb-6">
          <View className="bg-gradient-to-br from-primary to-primary/80 rounded-3xl p-6 shadow-lg">
            <Text className="text-white text-sm opacity-80 mb-2">Seu Código de Referência</Text>
            <Text className="text-white text-4xl font-bold mb-4">{referralCode}</Text>

            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={handleCopyCode}
                className="flex-1 bg-white/20 rounded-xl py-3 active:opacity-70"
              >
                <Text className="text-white text-center font-semibold">Copiar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleShare}
                className="flex-1 bg-white rounded-xl py-3 active:opacity-70"
              >
                <Text className="text-primary text-center font-semibold">Compartilhar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Estatísticas */}
        <View className="px-4 mb-6">
          <Text className="text-base font-bold text-foreground mb-3">Suas Estatísticas</Text>

          <View className="gap-3">
            {/* Total de Referências */}
            <View className="bg-surface rounded-2xl p-4 border border-border flex-row items-center justify-between">
              <View className="flex-row items-center gap-3 flex-1">
                <View className="w-12 h-12 rounded-full bg-primary/10 items-center justify-center">
                  <IconSymbol name="paperplane.fill" size={20} color={colors.primary} />
                </View>
                <View className="flex-1">
                  <Text className="text-xs text-muted">Total de Referências</Text>
                  <Text className="text-lg font-bold text-foreground mt-1">
                    {stats.totalReferrals}
                  </Text>
                </View>
              </View>
              <View className="bg-success/10 px-3 py-1 rounded-full">
                <Text className="text-xs font-bold text-success">
                  {Math.round((stats.activeReferrals / stats.totalReferrals) * 100)}% ativo
                </Text>
              </View>
            </View>

            {/* Comissões Totais */}
            <View className="bg-surface rounded-2xl p-4 border border-border flex-row items-center justify-between">
              <View className="flex-row items-center gap-3 flex-1">
                <View className="w-12 h-12 rounded-full bg-success/10 items-center justify-center">
                  <IconSymbol name="star.fill" size={20} color={colors.success} />
                </View>
                <View className="flex-1">
                  <Text className="text-xs text-muted">Comissões Totais</Text>
                  <Text className="text-lg font-bold text-foreground mt-1">
                    R$ {stats.totalCommissions.toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>

            {/* Comissões Pendentes */}
            <View className="bg-surface rounded-2xl p-4 border border-border flex-row items-center justify-between">
              <View className="flex-row items-center gap-3 flex-1">
                <View className="w-12 h-12 rounded-full bg-warning/10 items-center justify-center">
                  <IconSymbol name="paperplane.fill" size={20} color={colors.warning} />
                </View>
                <View className="flex-1">
                  <Text className="text-xs text-muted">Pendentes de Aprovação</Text>
                  <Text className="text-lg font-bold text-foreground mt-1">
                    R$ {stats.pendingCommissions.toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>

            {/* Comissões Pagas */}
            <View className="bg-surface rounded-2xl p-4 border border-border flex-row items-center justify-between">
              <View className="flex-row items-center gap-3 flex-1">
                <View className="w-12 h-12 rounded-full bg-success/10 items-center justify-center">
                  <IconSymbol name="star.fill" size={20} color={colors.success} />
                </View>
                <View className="flex-1">
                  <Text className="text-xs text-muted">Já Recebidas</Text>
                  <Text className="text-lg font-bold text-foreground mt-1">
                    R$ {stats.paidCommissions.toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Como Funciona */}
        <View className="px-4 mb-6">
          <Text className="text-base font-bold text-foreground mb-3">Como Funciona</Text>

          <View className="bg-surface rounded-2xl p-4 border border-border space-y-4">
            {[
              {
                number: "1",
                title: "Compartilhe seu código",
                description: "Envie seu código ou link para amigos motoristas",
              },
              {
                number: "2",
                title: "Amigo se inscreve",
                description: "Seu amigo se registra usando seu código",
              },
              {
                number: "3",
                title: "Amigo assina um plano",
                description: "Ele escolhe um plano de assinatura",
              },
              {
                number: "4",
                title: "Você recebe comissão",
                description: "Ganhe 20-30% do valor da assinatura",
              },
            ].map((step, idx) => (
              <View key={idx} className="flex-row gap-3">
                <View className="w-8 h-8 rounded-full bg-primary items-center justify-center flex-shrink-0">
                  <Text className="text-white text-sm font-bold">{step.number}</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-foreground">{step.title}</Text>
                  <Text className="text-xs text-muted mt-1">{step.description}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Tabela de Comissões */}
        <View className="px-4 mb-6">
          <Text className="text-base font-bold text-foreground mb-3">Comissão por Plano</Text>

          <View className="bg-surface rounded-2xl p-4 border border-border overflow-hidden">
            <View className="space-y-3">
              {[
                { plan: "Mensal", price: "R$ 29,90", commission: "20%", earnings: "R$ 5,98" },
                { plan: "Semestral", price: "R$ 149,90", commission: "25%", earnings: "R$ 37,48" },
                { plan: "Anual", price: "R$ 299,90", commission: "30%", earnings: "R$ 89,97" },
              ].map((item, idx) => (
                <View
                  key={idx}
                  className="flex-row items-center justify-between py-3 border-b border-border last:border-b-0"
                >
                  <View className="flex-1">
                    <Text className="text-sm font-semibold text-foreground">{item.plan}</Text>
                    <Text className="text-xs text-muted mt-1">{item.price}</Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-sm font-bold text-primary">{item.commission}</Text>
                    <Text className="text-xs text-success mt-1">{item.earnings}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Histórico de Referências */}
        <View className="px-4 mb-6">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-base font-bold text-foreground">Histórico Recente</Text>
            <TouchableOpacity>
              <Text className="text-sm text-primary font-semibold">Ver Tudo</Text>
            </TouchableOpacity>
          </View>

          <View className="bg-surface rounded-2xl p-4 border border-border">
            {[
              { name: "João Silva", plan: "Anual", commission: "R$ 89,97", date: "Hoje" },
              { name: "Maria Santos", plan: "Semestral", commission: "R$ 37,48", date: "Ontem" },
              { name: "Pedro Costa", plan: "Mensal", commission: "R$ 5,98", date: "2 dias atrás" },
            ].map((ref, idx) => (
              <View
                key={idx}
                className="flex-row items-center justify-between py-3 border-b border-border last:border-b-0"
              >
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-foreground">{ref.name}</Text>
                  <Text className="text-xs text-muted mt-1">{ref.plan}</Text>
                </View>
                <View className="items-end">
                  <Text className="text-sm font-bold text-success">{ref.commission}</Text>
                  <Text className="text-xs text-muted mt-1">{ref.date}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Botão de Ação */}
        <View className="px-4 pb-8">
          <TouchableOpacity
            onPress={handleShare}
            className="bg-primary rounded-full py-4 active:opacity-80"
          >
            <Text className="text-white text-center text-base font-bold">
              Convidar Amigos Agora
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
