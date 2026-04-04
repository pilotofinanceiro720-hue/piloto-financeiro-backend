import { Text, View, ScrollView, Switch, TouchableOpacity } from "react-native";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

export default function NotificationSettingsScreen() {
  const colors = useColors();

  const [demandAlerts, setDemandAlerts] = useState(true);
  const [marketplaceOffers, setMarketplaceOffers] = useState(true);
  const [maintenanceReminders, setMaintenanceReminders] = useState(true);
  const [paymentNotifications, setPaymentNotifications] = useState(true);
  const [referralAlerts, setReferralAlerts] = useState(true);
  const [systemNotifications, setSystemNotifications] = useState(true);
  const [quietHoursEnabled, setQuietHoursEnabled] = useState(true);

  return (
    <ScreenContainer className="bg-background">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-4 pt-4 pb-4">
          <Text className="text-2xl font-bold text-foreground">Notificações</Text>
          <Text className="text-sm text-muted mt-1">Personalize seus alertas</Text>
        </View>

        {/* Seção de Alertas de Demanda */}
        <View className="px-4 mb-6">
          <Text className="text-base font-bold text-foreground mb-3">Alertas de Demanda</Text>
          <View className="bg-surface rounded-2xl p-4 border border-border">
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center gap-3 flex-1">
                <View className="w-10 h-10 rounded-full bg-error/10 items-center justify-center">
                  <IconSymbol name="paperplane.fill" size={18} color={colors.error} />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-foreground">Demanda Alta</Text>
                  <Text className="text-xs text-muted">Alertas de áreas com alta demanda</Text>
                </View>
              </View>
              <Switch
                value={demandAlerts}
                onValueChange={setDemandAlerts}
                trackColor={{ false: colors.border, true: colors.primary }}
              />
            </View>
          </View>
        </View>

        {/* Seção de Marketplace */}
        <View className="px-4 mb-6">
          <Text className="text-base font-bold text-foreground mb-3">Marketplace</Text>
          <View className="bg-surface rounded-2xl p-4 border border-border">
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center gap-3 flex-1">
                <View className="w-10 h-10 rounded-full bg-success/10 items-center justify-center">
                  <IconSymbol name="star.fill" size={18} color={colors.success} />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-foreground">Ofertas Especiais</Text>
                  <Text className="text-xs text-muted">Notificações de descontos e cupons</Text>
                </View>
              </View>
              <Switch
                value={marketplaceOffers}
                onValueChange={setMarketplaceOffers}
                trackColor={{ false: colors.border, true: colors.primary }}
              />
            </View>
          </View>
        </View>

        {/* Seção de Manutenção */}
        <View className="px-4 mb-6">
          <Text className="text-base font-bold text-foreground mb-3">Manutenção</Text>
          <View className="bg-surface rounded-2xl p-4 border border-border">
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center gap-3 flex-1">
                <View className="w-10 h-10 rounded-full bg-warning/10 items-center justify-center">
                  <IconSymbol name="paperplane.fill" size={18} color={colors.warning} />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-foreground">Lembretes</Text>
                  <Text className="text-xs text-muted">Alertas de manutenção do veículo</Text>
                </View>
              </View>
              <Switch
                value={maintenanceReminders}
                onValueChange={setMaintenanceReminders}
                trackColor={{ false: colors.border, true: colors.primary }}
              />
            </View>
          </View>
        </View>

        {/* Seção de Pagamento */}
        <View className="px-4 mb-6">
          <Text className="text-base font-bold text-foreground mb-3">Pagamento</Text>
          <View className="bg-surface rounded-2xl p-4 border border-border">
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center gap-3 flex-1">
                <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center">
                  <IconSymbol name="paperplane.fill" size={18} color={colors.primary} />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-foreground">Notificações</Text>
                  <Text className="text-xs text-muted">Confirmações de pagamento e faturas</Text>
                </View>
              </View>
              <Switch
                value={paymentNotifications}
                onValueChange={setPaymentNotifications}
                trackColor={{ false: colors.border, true: colors.primary }}
              />
            </View>
          </View>
        </View>

        {/* Seção de Referência */}
        <View className="px-4 mb-6">
          <Text className="text-base font-bold text-foreground mb-3">Referência</Text>
          <View className="bg-surface rounded-2xl p-4 border border-border">
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center gap-3 flex-1">
                <View className="w-10 h-10 rounded-full bg-success/10 items-center justify-center">
                  <IconSymbol name="star.fill" size={18} color={colors.success} />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-foreground">Ganhos</Text>
                  <Text className="text-xs text-muted">Alertas de novos referrals</Text>
                </View>
              </View>
              <Switch
                value={referralAlerts}
                onValueChange={setReferralAlerts}
                trackColor={{ false: colors.border, true: colors.primary }}
              />
            </View>
          </View>
        </View>

        {/* Seção de Sistema */}
        <View className="px-4 mb-6">
          <Text className="text-base font-bold text-foreground mb-3">Sistema</Text>
          <View className="bg-surface rounded-2xl p-4 border border-border">
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center gap-3 flex-1">
                <View className="w-10 h-10 rounded-full bg-muted/10 items-center justify-center">
                  <IconSymbol name="paperplane.fill" size={18} color={colors.muted} />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-foreground">Notificações</Text>
                  <Text className="text-xs text-muted">Atualizações e informações importantes</Text>
                </View>
              </View>
              <Switch
                value={systemNotifications}
                onValueChange={setSystemNotifications}
                trackColor={{ false: colors.border, true: colors.primary }}
              />
            </View>
          </View>
        </View>

        {/* Seção de Horário Silencioso */}
        <View className="px-4 mb-6">
          <Text className="text-base font-bold text-foreground mb-3">Horário Silencioso</Text>
          <View className="bg-surface rounded-2xl p-4 border border-border">
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-row items-center gap-3 flex-1">
                <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center">
                  <IconSymbol name="paperplane.fill" size={18} color={colors.primary} />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-foreground">Ativar</Text>
                  <Text className="text-xs text-muted">Não receber notificações em certos horários</Text>
                </View>
              </View>
              <Switch
                value={quietHoursEnabled}
                onValueChange={setQuietHoursEnabled}
                trackColor={{ false: colors.border, true: colors.primary }}
              />
            </View>

            {quietHoursEnabled && (
              <View className="border-t border-border pt-4 gap-3">
                <View className="flex-row items-center justify-between">
                  <Text className="text-sm text-foreground">De</Text>
                  <TouchableOpacity className="bg-primary/10 px-4 py-2 rounded-lg">
                    <Text className="text-sm font-semibold text-primary">22:00</Text>
                  </TouchableOpacity>
                </View>
                <View className="flex-row items-center justify-between">
                  <Text className="text-sm text-foreground">Até</Text>
                  <TouchableOpacity className="bg-primary/10 px-4 py-2 rounded-lg">
                    <Text className="text-sm font-semibold text-primary">08:00</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Informação */}
        <View className="px-4 mb-6 bg-primary/10 border border-primary/20 rounded-2xl p-4">
          <View className="flex-row items-start gap-3">
            <IconSymbol name="paperplane.fill" size={20} color={colors.primary} />
            <View className="flex-1">
              <Text className="text-sm font-bold text-primary">Dica</Text>
              <Text className="text-xs text-muted mt-1">
                Você pode desativar todas as notificações a qualquer momento nas configurações do seu dispositivo
              </Text>
            </View>
          </View>
        </View>

        {/* Botão de Salvar */}
        <View className="px-4 pb-8">
          <TouchableOpacity className="bg-primary rounded-full py-4 active:opacity-80">
            <Text className="text-white text-center text-base font-bold">Salvar Preferências</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
