import { Text, View, TouchableOpacity, ScrollView } from "react-native";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

export default function SubscriptionScreen() {
  const colors = useColors();
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "semestral" | "annual">("monthly");
  const [isProcessing, setIsProcessing] = useState(false);

  const plans = {
    monthly: {
      name: "Plano Mensal",
      price: 29.90,
      pricePerMonth: 29.90,
      discount: 0,
      features: [
        "Acesso completo ao app",
        "Cálculos de lucro em tempo real",
        "Marketplace com 100+ ofertas",
        "Suporte por email",
      ],
      description: "Perfeito para motoristas que querem testar",
    },
    semestral: {
      name: "Plano Semestral",
      price: 149.90,
      pricePerMonth: 24.98,
      discount: 17,
      features: [
        "Tudo do plano mensal",
        "Desconto de 17%",
        "Prioridade no suporte",
        "Relatórios avançados",
        "Integração com mapas",
      ],
      description: "Melhor custo-benefício",
    },
    annual: {
      name: "Plano Anual",
      price: 299.90,
      pricePerMonth: 24.99,
      discount: 33,
      features: [
        "Tudo do plano semestral",
        "Desconto de 33%",
        "Suporte prioritário 24/7",
        "Consultoria financeira",
        "API access",
        "Relatórios customizados",
      ],
      description: "Melhor valor para profissionais",
    },
  };

  const handleSubscribe = async () => {
    setIsProcessing(true);
    // TODO: Integrar com Stripe
    setTimeout(() => {
      setIsProcessing(false);
      console.log(`Assinatura iniciada para plano: ${selectedPlan}`);
    }, 2000);
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-4 pt-4 pb-4">
          <Text className="text-2xl font-bold text-foreground">Escolha seu Plano</Text>
          <Text className="text-sm text-muted mt-1">Acesso ilimitado a todas as funcionalidades</Text>
        </View>

        {/* Planos */}
        <View className="px-4 mb-6 gap-4">
          {Object.entries(plans).map(([key, plan]) => {
            const planKey = key as "monthly" | "semestral" | "annual";
            const isSelected = selectedPlan === planKey;

            return (
              <TouchableOpacity
                key={planKey}
                onPress={() => setSelectedPlan(planKey)}
                className={`rounded-2xl p-4 border-2 transition-all ${
                  isSelected
                    ? `border-primary bg-primary/5`
                    : "border-border bg-surface"
                }`}
              >
                {/* Badge de Desconto */}
                {plan.discount > 0 && (
                  <View className="absolute top-4 right-4 bg-success px-3 py-1 rounded-full">
                    <Text className="text-white text-xs font-bold">Economize {plan.discount}%</Text>
                  </View>
                )}

                {/* Nome e Descrição */}
                <View className="mb-3">
                  <Text className="text-lg font-bold text-foreground">{plan.name}</Text>
                  <Text className="text-xs text-muted mt-1">{plan.description}</Text>
                </View>

                {/* Preço */}
                <View className="mb-3">
                  <View className="flex-row items-baseline gap-1">
                    <Text className="text-3xl font-bold text-primary">R$ {plan.price.toFixed(2)}</Text>
                    <Text className="text-sm text-muted">
                      {planKey === "monthly" ? "/mês" : planKey === "semestral" ? "/6 meses" : "/ano"}
                    </Text>
                  </View>
                  <Text className="text-xs text-muted mt-1">
                    R$ {plan.pricePerMonth.toFixed(2)}/mês
                  </Text>
                </View>

                {/* Features */}
                <View className="space-y-2">
                  {plan.features.map((feature, idx) => (
                    <View key={idx} className="flex-row items-center gap-2">
                      <IconSymbol name="star.fill" size={14} color={colors.success} />
                      <Text className="text-sm text-foreground flex-1">{feature}</Text>
                    </View>
                  ))}
                </View>

                {/* Seletor */}
                {isSelected && (
                  <View className="mt-4 pt-4 border-t border-border flex-row items-center justify-between">
                    <Text className="text-sm font-semibold text-primary">Plano Selecionado</Text>
                    <View className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <Text className="text-white text-xs font-bold">✓</Text>
                    </View>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Comparação de Planos */}
        <View className="px-4 mb-6">
          <Text className="text-base font-bold text-foreground mb-3">Comparação de Planos</Text>
          <View className="bg-surface rounded-2xl p-4 border border-border overflow-hidden">
            <View className="space-y-3">
              {[
                { feature: "Acesso ao App", monthly: true, semestral: true, annual: true },
                { feature: "Cálculos em Tempo Real", monthly: true, semestral: true, annual: true },
                { feature: "Marketplace", monthly: true, semestral: true, annual: true },
                { feature: "Integração com Mapas", monthly: false, semestral: true, annual: true },
                { feature: "Relatórios Avançados", monthly: false, semestral: true, annual: true },
                { feature: "Suporte Prioritário", monthly: false, semestral: true, annual: true },
                { feature: "Consultoria Financeira", monthly: false, semestral: false, annual: true },
                { feature: "API Access", monthly: false, semestral: false, annual: true },
              ].map((item, idx) => (
                <View key={idx} className="flex-row items-center justify-between py-2 border-b border-border last:border-b-0">
                  <Text className="text-sm text-foreground flex-1">{item.feature}</Text>
                  <View className="flex-row gap-4">
                    <View className="w-10 items-center">
                      {item.monthly ? (
                        <IconSymbol name="star.fill" size={16} color={colors.success} />
                      ) : (
                        <Text className="text-muted text-sm">—</Text>
                      )}
                    </View>
                    <View className="w-10 items-center">
                      {item.semestral ? (
                        <IconSymbol name="star.fill" size={16} color={colors.success} />
                      ) : (
                        <Text className="text-muted text-sm">—</Text>
                      )}
                    </View>
                    <View className="w-10 items-center">
                      {item.annual ? (
                        <IconSymbol name="star.fill" size={16} color={colors.success} />
                      ) : (
                        <Text className="text-muted text-sm">—</Text>
                      )}
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Informações */}
        <View className="px-4 mb-6 bg-primary/10 border border-primary/20 rounded-2xl p-4">
          <View className="flex-row items-start gap-3">
            <IconSymbol name="paperplane.fill" size={20} color={colors.primary} />
            <View className="flex-1">
              <Text className="text-sm font-bold text-primary">Cancelamento Gratuito</Text>
              <Text className="text-xs text-muted mt-1">
                Cancele sua assinatura a qualquer momento, sem taxas adicionais
              </Text>
            </View>
          </View>
        </View>

        {/* Botão de Assinatura */}
        <View className="px-4 pb-8">
          <TouchableOpacity
            onPress={handleSubscribe}
            disabled={isProcessing}
            className={`rounded-full py-4 shadow-md active:opacity-80 ${
              isProcessing ? "bg-primary/50" : "bg-primary"
            }`}
          >
            <Text className="text-white text-center text-lg font-bold">
              {isProcessing ? "Processando..." : `Assinar ${plans[selectedPlan].name}`}
            </Text>
          </TouchableOpacity>

          {/* Termos */}
          <Text className="text-xs text-muted text-center mt-4">
            Ao assinar, você concorda com nossos Termos de Serviço e Política de Privacidade
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
