/**
 * PILOTO FINANCEIRO — Serviço de IA com Gemini
 * Funcionalidades da Camada 1:
 * - Resumo diário em linguagem natural (com voz)
 * - Alerta de queda de rentabilidade
 * - Detecção de padrão ruim no mês
 * - Sugestão de horário ideal para sair
 */

import axios from "axios";
import { ENV } from "../env.js";

const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

async function callGemini(prompt: string): Promise<string> {
  const res = await axios.post(
    `${GEMINI_URL}?key=${ENV.geminiApiKey}`,
    { contents: [{ parts: [{ text: prompt }] }] }
  );
  return res.data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
}

// ============================================================================
// 1. RESUMO DIÁRIO EM LINGUAGEM NATURAL
// ============================================================================

export interface DailyData {
  driverName: string;
  date: string;
  totalRides: number;
  grossEarnings: number;
  netEarnings: number;
  totalKm: number;
  bestHour: string;
  bestHourRate: number;
  bestPlatform: string;
  dailyGoal: number;
  cityEvents: { title: string; time: string; attendance: number }[];
}

export async function generateDailySummary(data: DailyData): Promise<string> {
  const goalPct = Math.round((data.netEarnings / data.dailyGoal) * 100);
  const goalStatus = goalPct >= 100 ? `Você bateu a meta! 🎉` : `Você chegou a ${goalPct}% da meta.`;
  const nextEvent = data.cityEvents[0];

  const prompt = `
Você é um assistente financeiro para motoristas de app no Brasil.
Gere um resumo do dia em 3-4 frases curtas, diretas e encorajadoras, em português brasileiro informal.
NÃO use markdown. NÃO use asteriscos. Fale diretamente com o motorista.

Dados do dia de ${data.driverName}:
- Corridas: ${data.totalRides}
- Ganho bruto: R$ ${data.grossEarnings.toFixed(2)}
- Ganho líquido: R$ ${data.netEarnings.toFixed(2)}
- KM rodados: ${data.totalKm}
- Melhor horário: ${data.bestHour} (R$ ${data.bestHourRate.toFixed(2)}/hora)
- Melhor plataforma: ${data.bestPlatform}
- Meta do dia: R$ ${data.dailyGoal.toFixed(2)} — ${goalStatus}
${nextEvent ? `- Evento amanhã: ${nextEvent.title} às ${nextEvent.time} (${nextEvent.attendance.toLocaleString()} pessoas)` : ""}

Seja conciso. Máximo 4 frases. Termine com uma dica ou motivação para amanhã.
  `.trim();

  return await callGemini(prompt);
}

// ============================================================================
// 2. ALERTA DE QUEDA DE RENTABILIDADE (por região)
// ============================================================================

export interface RentabilityAlert {
  currentRatePerHour: number;
  historicalAvgPerHour: number;
  currentRegion: string;
  regionHistoricalAvg: number;
  hoursBelow: number;
}

export function checkRentabilityDrop(data: RentabilityAlert): {
  shouldAlert: boolean;
  message: string;
} {
  // Considera média da região se disponível, senão usa média geral
  const referenceAvg = data.regionHistoricalAvg > 0
    ? data.regionHistoricalAvg
    : data.historicalAvgPerHour;

  const dropPct = Math.round(((referenceAvg - data.currentRatePerHour) / referenceAvg) * 100);

  if (data.hoursBelow >= 2 && dropPct >= 25) {
    const msg = data.regionHistoricalAvg > 0
      ? `Nas últimas ${data.hoursBelow}h você está ganhando R$ ${data.currentRatePerHour.toFixed(2)}/h — ${dropPct}% abaixo da média na ${data.currentRegion}. Quer fazer uma pausa?`
      : `Nas últimas ${data.hoursBelow}h você está ganhando R$ ${data.currentRatePerHour.toFixed(2)}/h — ${dropPct}% abaixo da sua média. Considere uma pausa ou mudar de região.`;

    return { shouldAlert: true, message: msg };
  }

  return { shouldAlert: false, message: "" };
}

// ============================================================================
// 3. DETECÇÃO DE PADRÃO RUIM NO MÊS (coletivo + regional)
// ============================================================================

export interface MonthlyPattern {
  driverName: string;
  currentMonth: string;
  previousMonth: string;
  dayOfWeekAnalysis: {
    dayName: string;
    currentAvg: number;
    previousAvg: number;
    dropPct: number;
  }[];
  driverProfile: "fixo" | "nomade";
  mainRegion?: string;
}

export async function detectBadMonthlyPattern(data: MonthlyPattern): Promise<string | null> {
  const badDays = data.dayOfWeekAnalysis.filter((d) => d.dropPct >= 20);
  if (badDays.length === 0) return null;

  const worst = badDays.sort((a, b) => b.dropPct - a.dropPct)[0];

  const prompt = `
Você é um assistente financeiro para motoristas de app no Brasil.
Identifique em 2-3 frases curtas um padrão de queda no desempenho do motorista.
NÃO use markdown. Seja direto e construtivo, não negativo.

Motorista: ${data.driverName}
Perfil: ${data.driverProfile === "fixo" ? `Fixo na região ${data.mainRegion}` : "Nômade (múltiplas regiões)"}
Queda identificada: ${worst.dayName}s de ${data.currentMonth} estão ${worst.dropPct}% abaixo dos ${worst.dayName}s de ${data.previousMonth}
Outros dias com queda: ${badDays.slice(1).map((d) => `${d.dayName} (${d.dropPct}%)`).join(", ") || "nenhum"}

Sugira uma causa possível e uma ação concreta. Máximo 3 frases.
  `.trim();

  return await callGemini(prompt);
}

// ============================================================================
// 4. SUGESTÃO DE HORÁRIO IDEAL PARA SAIR
// ============================================================================

export interface HourSuggestionInput {
  dayOfWeek: string;
  driverProfile: "fixo" | "nomade";
  mainRegion?: string;
  historicalBestHours: { hour: number; avgRate: number }[];
  upcomingEvents: { title: string; time: string; venue: string; attendance: number }[];
}

export function buildHourSuggestion(data: HourSuggestionInput): {
  primaryWindow: string;
  secondaryWindow: string;
  reason: string;
  eventHighlight?: string;
} {
  const sorted = [...data.historicalBestHours].sort((a, b) => b.avgRate - a.avgRate);
  const best = sorted[0];
  const second = sorted[1];

  const primaryWindow = best
    ? `${best.hour}h–${best.hour + 3}h (R$ ${best.avgRate.toFixed(2)}/h)`
    : "17h–21h";

  const secondaryWindow = second
    ? `${second.hour}h–${second.hour + 2}h`
    : "07h–09h";

  const regionLabel = data.driverProfile === "fixo" && data.mainRegion
    ? ` na ${data.mainRegion}`
    : "";

  const reason = `Baseado nos seus melhores ${data.dayOfWeek}s${regionLabel}`;

  const topEvent = data.upcomingEvents.find((e) => e.attendance >= 5000);
  const eventHighlight = topEvent
    ? `${topEvent.title} às ${topEvent.time} em ${topEvent.venue} — ${topEvent.attendance.toLocaleString()} pessoas esperadas`
    : undefined;

  return { primaryWindow, secondaryWindow, reason, eventHighlight };
}

// ============================================================================
// 5. PREVISÃO DE META EM TEMPO REAL (sem IA — cálculo puro)
// ============================================================================

export function calcGoalForecast(data: {
  currentEarnings: number;
  dailyGoal: number;
  hoursWorked: number;
  hoursRemainingInDay: number;
}): {
  projectedTotal: number;
  willReachGoal: boolean;
  ridesNeeded: number;
  avgRideValue: number;
  message: string;
} {
  const { currentEarnings, dailyGoal, hoursWorked, hoursRemainingInDay } = data;

  const ratePerHour = hoursWorked > 0 ? currentEarnings / hoursWorked : 0;
  const projectedTotal = currentEarnings + ratePerHour * hoursRemainingInDay;
  const willReachGoal = projectedTotal >= dailyGoal;
  const remaining = Math.max(0, dailyGoal - currentEarnings);
  const avgRideValue = ratePerHour > 0 ? ratePerHour / 3 : 20; // ~3 corridas/hora
  const ridesNeeded = avgRideValue > 0 ? Math.ceil(remaining / avgRideValue) : 0;

  const message = willReachGoal
    ? `No seu ritmo atual você vai atingir R$ ${projectedTotal.toFixed(2)} hoje. Meta garantida! 🎉`
    : `No seu ritmo atual você vai chegar a R$ ${projectedTotal.toFixed(2)}. Faltam R$ ${remaining.toFixed(2)} — cerca de ${ridesNeeded} corridas.`;

  return { projectedTotal, willReachGoal, ridesNeeded, avgRideValue, message };
}
