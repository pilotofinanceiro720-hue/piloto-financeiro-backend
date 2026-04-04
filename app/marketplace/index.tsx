/**
 * MARKETPLACE + COMISSÕES
 * Parceiros, afiliados, ganhos por referência
 * TODO: Integrar com backend para criar links únicos
 * TODO: Implementar webhook para rastrear conversões
 */

import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import * as Clipboard from "expo-clipboard";

interface Partner {
  id: string;
  name: string;
  description: string;
  commission: number;
  icon: string;
  link: string;
  totalEarnings: number;
  totalReferrals: number;
}

const MOCK_PARTNERS: Partner[] = [
  {
    id: "1",
    name: "Seguro Veicular",
    description: "Proteção completa para seu veículo",
    commission: 15,
    icon: "🚗",
    link: "https://piloto.com/ref/seguro-123",
    totalEarnings: 450,
    totalReferrals: 30,
  },
  {
    id: "2",
    name: "Combustível Premium",
    description: "Desconto em postos parceiros",
    commission: 8,
    icon: "⛽",
    link: "https://piloto.com/ref/combustivel-123",
    totalEarnings: 240,
    totalReferrals: 30,
  },
  {
    id: "3",
    name: "Manutenção Automotiva",
    description: "Serviços com desconto exclusivo",
    commission: 12,
    icon: "🔧",
    link: "https://piloto.com/ref/manutencao-123",
    totalEarnings: 360,
    totalReferrals: 30,
  },
  {
    id: "4",
    name: "Empréstimo Rápido",
    description: "Crédito com taxa reduzida",
    commission: 20,
    icon: "💰",
    link: "https://piloto.com/ref/emprestimo-123",
    totalEarnings: 600,
    totalReferrals: 30,
  },
];

export default function MarketplaceScreen() {
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);

  const totalCommissions = MOCK_PARTNERS.reduce((sum, p) => sum + p.totalEarnings, 0);
  const totalReferrals = MOCK_PARTNERS.reduce((sum, p) => sum + p.totalReferrals, 0);

  const handleCopyLink = async (link: string) => {
    await Clipboard.setStringAsync(link);
    Alert.alert("Link copiado!", "Cole o link para compartilhar com amigos");
  };

  const handleSharePartner = (partner: Partner) => {
    setSelectedPartner(partner);
  };

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="p-6 gap-6">
          {/* HEADER */}
          <View>
            <Text className="text-3xl font-bold text-foreground">
              Marketplace
            </Text>
            <Text className="text-sm text-muted mt-1">
              Ganhe comissões com referências
            </Text>
          </View>

          {/* SUMMARY */}
          <View className="bg-primary/10 rounded-lg p-4 border border-primary">
            <View className="flex-row justify-between mb-3">
              <View>
                <Text className="text-xs text-muted mb-1">Comissões Totais</Text>
                <Text className="text-2xl font-bold text-primary">
                  R$ {totalCommissions.toFixed(2)}
                </Text>
              </View>
              <View className="items-end">
                <Text className="text-xs text-muted mb-1">Referências</Text>
                <Text className="text-2xl font-bold text-primary">
                  {totalReferrals}
                </Text>
              </View>
            </View>
            <View className="pt-3 border-t border-primary/20">
              <Text className="text-xs text-muted">
                Média: R$ {(totalCommissions / totalReferrals).toFixed(2)} por referência
              </Text>
            </View>
          </View>

          {/* PARTNERS */}
          <View className="gap-3">
            {MOCK_PARTNERS.map((partner) => (
              <View
                key={partner.id}
                className="bg-surface rounded-lg p-4 border border-border"
              >
                <View className="flex-row items-start gap-3 mb-3">
                  <Text className="text-3xl">{partner.icon}</Text>
                  <View className="flex-1">
                    <Text className="text-base font-semibold text-foreground">
                      {partner.name}
                    </Text>
                    <Text className="text-xs text-muted mt-1">
                      {partner.description}
                    </Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-lg font-bold text-success">
                      {partner.commission}%
                    </Text>
                    <Text className="text-xs text-muted">comissão</Text>
                  </View>
                </View>

                {/* STATS */}
                <View className="flex-row gap-4 mb-3 py-3 border-y border-border">
                  <View className="flex-1">
                    <Text className="text-xs text-muted mb-1">Ganhos</Text>
                    <Text className="text-sm font-semibold text-foreground">
                      R$ {partner.totalEarnings.toFixed(2)}
                    </Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-xs text-muted mb-1">Referências</Text>
                    <Text className="text-sm font-semibold text-foreground">
                      {partner.totalReferrals}
                    </Text>
                  </View>
                </View>

                {/* ACTIONS */}
                <View className="flex-row gap-2">
                  <TouchableOpacity
                    onPress={() => handleCopyLink(partner.link)}
                    className="flex-1 bg-primary/20 py-2 rounded items-center"
                  >
                    <Text className="text-xs font-semibold text-primary">
                      Copiar Link
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleSharePartner(partner)}
                    className="flex-1 bg-primary py-2 rounded items-center"
                  >
                    <Text className="text-xs font-semibold text-white">
                      Compartilhar
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>

          {/* HOW IT WORKS */}
          <View className="bg-surface rounded-lg p-4">
            <Text className="text-sm font-semibold text-foreground mb-3">
              Como Funciona
            </Text>
            <View className="gap-2">
              <View className="flex-row items-start gap-2">
                <Text className="text-primary font-bold">1.</Text>
                <Text className="text-xs text-muted flex-1">
                  Copie seu link único de referência
                </Text>
              </View>
              <View className="flex-row items-start gap-2">
                <Text className="text-primary font-bold">2.</Text>
                <Text className="text-xs text-muted flex-1">
                  Compartilhe com amigos e colegas
                </Text>
              </View>
              <View className="flex-row items-start gap-2">
                <Text className="text-primary font-bold">3.</Text>
                <Text className="text-xs text-muted flex-1">
                  Ganhe comissão quando eles se cadastrarem
                </Text>
              </View>
              <View className="flex-row items-start gap-2">
                <Text className="text-primary font-bold">4.</Text>
                <Text className="text-xs text-muted flex-1">
                  Receba o pagamento no próximo mês
                </Text>
              </View>
            </View>
          </View>

          {/* PAYOUT */}
          <View className="bg-success/10 rounded-lg p-4 border border-success">
            <Text className="text-sm font-semibold text-success mb-2">
              Próximo Pagamento
            </Text>
            <Text className="text-xs text-foreground mb-2">
              Seus ganhos de comissão serão pagos no dia 5 do próximo mês via PIX
            </Text>
            <Text className="text-lg font-bold text-success">
              R$ {totalCommissions.toFixed(2)}
            </Text>
          </View>

          {/* TODO: WEBHOOK */}
          <View className="bg-warning/10 rounded-lg p-4 border border-warning">
            <Text className="text-xs font-semibold text-warning mb-2">
              🔗 RASTREAMENTO EM TEMPO REAL
            </Text>
            <Text className="text-xs text-muted">
              TODO: Implementar webhook para rastrear conversões em tempo real
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
