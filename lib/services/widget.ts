/**
 * PILOTO FINANCEIRO — Widget Android
 * 
 * O widget exibe ganho do dia, % da meta e status na tela inicial do Android.
 * O motorista habilita nas configurações — não aparece automaticamente.
 * 
 * Implementação: expo-widgets (ou react-native-android-widget)
 * Requer: android/app/src/main/res/xml/widget_info.xml + WidgetProvider.kt
 * 
 * Este arquivo define a configuração e o contrato de dados do widget.
 */

export interface WidgetData {
  earningsToday: number;
  dailyGoal: number;
  goalPct: number;
  totalRides: number;
  isOnline: boolean;
  isPaused: boolean;
  lastUpdated: string;
}

/**
 * Chave usada para compartilhar dados entre o app e o widget via SharedPreferences.
 * O WidgetProvider.kt lê esta chave para atualizar o widget.
 */
export const WIDGET_PREFS_KEY = "pilotofinanceiro_widget_data";

/**
 * Serializa os dados do widget para SharedPreferences.
 * Chamado sempre que os dados do dashboard são atualizados.
 */
export function serializeWidgetData(data: WidgetData): string {
  return JSON.stringify({
    ...data,
    lastUpdated: new Date().toISOString(),
  });
}

/**
 * Layout do widget (referência para implementação nativa):
 * 
 * ┌─────────────────────────────────────┐
 * │ 💰 Piloto Financeiro                 │
 * │ Hoje: R$ 147,20                      │
 * │ Meta: 67% ████████░░░                │
 * │ 🟢 Online · 9 corridas               │
 * └─────────────────────────────────────┘
 * 
 * Tamanho: 4x2 células (configurável pelo usuário)
 * Atualização: a cada 15 minutos ou quando o app envia broadcast
 * Toque: abre o app diretamente no dashboard
 */

/**
 * Instruções para habilitar o widget (exibidas nas configurações):
 */
export const WIDGET_ENABLE_INSTRUCTIONS = `
Para adicionar o widget à tela inicial do seu Android:

1. Toque e segure em uma área vazia da tela inicial
2. Selecione "Widgets"
3. Encontre "Piloto Financeiro"
4. Arraste o widget para a posição desejada

O widget mostra seu ganho do dia, progresso da meta e status.
Atualiza automaticamente a cada 15 minutos.
`.trim();

/**
 * Configurações do widget — salvas no perfil do usuário
 */
export interface WidgetSettings {
  enabled: boolean;
  showEarnings: boolean;    // Pode ocultar valor por privacidade
  showGoalBar: boolean;
  showRideCount: boolean;
  showStatus: boolean;
}

export const DEFAULT_WIDGET_SETTINGS: WidgetSettings = {
  enabled: false,           // Desabilitado por padrão — motorista habilita
  showEarnings: true,
  showGoalBar: true,
  showRideCount: true,
  showStatus: true,
};
