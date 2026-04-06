/**
 * GEMINI IA SERVICE — INSIGHTS AUTOMÁTICOS
 * Gera análises e recomendações baseadas em dados do motorista
 * TODO: Implementar cache de respostas
 * TODO: Implementar rate limiting
 */

import axios from "axios";
import type { MonthlyReport, DashboardMetrics } from "@/shared/types/piloto";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

// ============================================================================
// TIPOS
// ============================================================================

interface GeminiRequest {
  contents: Array<{
    parts: Array<{ text: string }>;
  }>;
}

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{ text: string }>;
    };
  }>;
}

// ============================================================================
// INSIGHTS GERAIS
// ============================================================================

/**
 * Gerar insights sobre desempenho mensal
 * TODO: Integrar com dados reais do banco
 */
export async function generateMonthlyInsights(data: {
  totalGross: number;
  totalNet: number;
  totalExpenses: number;
  totalRides: number;
  dailyGoal: number;
  monthlyGoal: number;
  bestDay: string;
  bestRegion: string;
  bestHour: number;
  daysWorked: number;
}): Promise<string> {
  const prompt = `
Você é um assistente financeiro especializado em motoristas de aplicativo. 
Analise os dados do motorista e gere insights e recomendações práticas.

DADOS DO MÊS:
- Ganho Bruto: R$ ${data.totalGross.toFixed(2)}
- Ganho Líquido: R$ ${data.totalNet.toFixed(2)}
- Despesas: R$ ${data.totalExpenses.toFixed(2)}
- Total de Corridas: ${data.totalRides}
- Dias Trabalhados: ${data.daysWorked}
- Meta Diária: R$ ${data.dailyGoal.toFixed(2)}
- Meta Mensal: R$ ${data.monthlyGoal.toFixed(2)}
- Melhor Dia: ${data.bestDay}
- Melhor Região: ${data.bestRegion}
- Melhor Hora: ${data.bestHour}:00

Gere:
1. Resumo de desempenho (1-2 frases)
2. 3 insights principais sobre ganhos e eficiência
3. 3 recomendações práticas para aumentar ganhos
4. Análise de consistência (quantos dias atingiu a meta)

Responda em português, de forma concisa e acionável.
`;

  try {
    const response = await callGemini(prompt);
    return response;
  } catch (error) {
    console.error("[Gemini] Erro ao gerar insights:", error);
    return "Desculpe, não consegui gerar insights no momento. Tente novamente mais tarde.";
  }
}

/**
 * Gerar recomendação de horário ideal
 */
export async function generateTimeRecommendation(data: {
  bestHours: number[];
  worstHours: number[];
  totalRides: number;
  averagePerHour: number;
}): Promise<string> {
  const prompt = `
Você é um consultor de produtividade para motoristas de aplicativo.

DADOS:
- Melhores horários: ${data.bestHours.join(", ")}:00
- Piores horários: ${data.worstHours.join(", ")}:00
- Total de corridas: ${data.totalRides}
- Média por hora: R$ ${data.averagePerHour.toFixed(2)}

Gere uma recomendação concisa (máx 3 frases) sobre o melhor horário para trabalhar.
Inclua estimativa de ganho se trabalhar nos melhores horários.
`;

  try {
    return await callGemini(prompt);
  } catch (error) {
    console.error("[Gemini] Erro ao gerar recomendação:", error);
    return "Recomendação indisponível no momento.";
  }
}

/**
 * Gerar análise de região
 */
export async function generateRegionAnalysis(data: {
  region: string;
  demand: number;
  avgEarnings: number;
  trend: "up" | "down" | "stable";
  totalRidesInRegion: number;
}): Promise<string> {
  const prompt = `
Você é um analista de mercado para motoristas de aplicativo.

DADOS DA REGIÃO ${data.region.toUpperCase()}:
- Demanda: ${data.demand}%
- Ganho Médio: R$ ${data.avgEarnings.toFixed(2)}
- Tendência: ${data.trend === "up" ? "em alta" : data.trend === "down" ? "em queda" : "estável"}
- Total de corridas: ${data.totalRidesInRegion}

Gere uma análise breve (2-3 frases) sobre a viabilidade de trabalhar nesta região.
`;

  try {
    return await callGemini(prompt);
  } catch (error) {
    console.error("[Gemini] Erro ao analisar região:", error);
    return "Análise indisponível no momento.";
  }
}

/**
 * Gerar sugestão de meta realista
 */
export async function generateGoalSuggestion(data: {
  historicalDailyAverage: number;
  bestDay: number;
  worstDay: number;
  consistency: number; // percentual de dias com meta atingida
}): Promise<{ suggestedDaily: number; suggestedMonthly: number; reasoning: string }> {
  const prompt = `
Você é um coach financeiro para motoristas.

HISTÓRICO:
- Média diária: R$ ${data.historicalDailyAverage.toFixed(2)}
- Melhor dia: R$ ${data.bestDay.toFixed(2)}
- Pior dia: R$ ${data.worstDay.toFixed(2)}
- Consistência (dias com meta): ${data.consistency}%

Sugira uma meta diária realista e uma meta mensal (22 dias úteis).
Responda em JSON: { "dailyGoal": número, "monthlyGoal": número, "reasoning": "explicação breve" }
`;

  try {
    const response = await callGemini(prompt);
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return {
      suggestedDaily: data.historicalDailyAverage * 1.1,
      suggestedMonthly: data.historicalDailyAverage * 1.1 * 22,
      reasoning: "Meta sugerida com base no histórico de desempenho.",
    };
  } catch (error) {
    console.error("[Gemini] Erro ao sugerir meta:", error);
    return {
      suggestedDaily: data.historicalDailyAverage,
      suggestedMonthly: data.historicalDailyAverage * 22,
      reasoning: "Erro ao calcular sugestão.",
    };
  }
}

// ============================================================================
// CHAMADA GEMINI
// ============================================================================

/**
 * Chamada genérica à API Gemini
 * TODO: Implementar retry com backoff exponencial
 */
async function callGemini(prompt: string): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY não configurada");
  }

  try {
    const request: GeminiRequest = {
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
    };

    const response = await axios.post<GeminiResponse>(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      request,
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 30000,
      }
    );

    const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      throw new Error("Resposta vazia da API Gemini");
    }

    return text;
  } catch (error) {
    console.error("[Gemini] Erro na chamada:", error);
    throw error;
  }
}

// ============================================================================
// UTILITIES
// ============================================================================

/**
 * Formatar insights para exibição
 */
export function formatInsights(rawInsights: string): string[] {
  return rawInsights
    .split("\n")
    .filter((line) => line.trim().length > 0)
    .map((line) => line.replace(/^[-•*]\s*/, "").trim());
}

/**
 * Extrair números de insights
 */
export function extractNumbers(text: string): number[] {
  const numbers = text.match(/\d+(?:\.\d+)?/g) || [];
  return numbers.map((n) => parseFloat(n));
}
