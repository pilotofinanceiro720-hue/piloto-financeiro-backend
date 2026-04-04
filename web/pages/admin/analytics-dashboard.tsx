/**
 * Dashboard de Analytics para Admins
 * Métricas principais: MRR, Churn, LTV, Conversão, Adimplência
 */

import React, { useState, useEffect } from "react";

interface AnalyticsMetrics {
  mrr: number; // Monthly Recurring Revenue
  churnRate: number;
  ltv: number; // Lifetime Value
  conversionRate: number;
  adimplencia: number;
  activeUsers: number;
  newUsers: number;
  totalRevenue: number;
  avgSubscriptionValue: number;
}

interface ChartData {
  date: string;
  value: number;
}

export default function AnalyticsDashboard() {
  const [metrics, setMetrics] = useState<AnalyticsMetrics>({
    mrr: 0,
    churnRate: 0,
    ltv: 0,
    conversionRate: 0,
    adimplencia: 0,
    activeUsers: 0,
    newUsers: 0,
    totalRevenue: 0,
    avgSubscriptionValue: 0,
  });

  const [period, setPeriod] = useState<"week" | "month" | "quarter" | "year">("month");
  const [mrrTrend, setMrrTrend] = useState<ChartData[]>([]);
  const [churnTrend, setChurnTrend] = useState<ChartData[]>([]);

  useEffect(() => {
    loadAnalytics();
  }, [period]);

  const loadAnalytics = async () => {
    try {
      // TODO: Buscar dados do backend
      // const response = await fetch(`/api/admin/analytics?period=${period}`);
      // const data = await response.json();

      // Mock data
      const mockMetrics: AnalyticsMetrics = {
        mrr: 45230.5, // Monthly Recurring Revenue
        churnRate: 3.2, // 3.2% de churn
        ltv: 1250.8, // Lifetime Value
        conversionRate: 8.5, // 8.5% de conversão
        adimplencia: 96.8, // 96.8% de adimplência
        activeUsers: 1245,
        newUsers: 87,
        totalRevenue: 125640.75,
        avgSubscriptionValue: 29.9,
      };

      setMetrics(mockMetrics);

      // Mock trend data
      const mockMrrTrend: ChartData[] = [
        { date: "Jan", value: 32000 },
        { date: "Fev", value: 35500 },
        { date: "Mar", value: 38200 },
        { date: "Abr", value: 41800 },
        { date: "Mai", value: 44100 },
        { date: "Jun", value: 45230 },
      ];

      setMrrTrend(mockMrrTrend);

      const mockChurnTrend: ChartData[] = [
        { date: "Jan", value: 5.2 },
        { date: "Fev", value: 4.8 },
        { date: "Mar", value: 4.1 },
        { date: "Abr", value: 3.8 },
        { date: "Mai", value: 3.5 },
        { date: "Jun", value: 3.2 },
      ];

      setChurnTrend(mockChurnTrend);
    } catch (error) {
      console.error("Erro ao carregar analytics:", error);
    }
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatPercent = (value: number): string => {
    return `${value.toFixed(1)}%`;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard de Analytics</h1>
        <p className="text-gray-600">Acompanhe métricas principais da plataforma</p>
      </div>

      {/* Período Seletor */}
      <div className="mb-8 flex gap-2">
        {(["week", "month", "quarter", "year"] as const).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              period === p
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 border border-gray-200 hover:border-gray-300"
            }`}
          >
            {p === "week" ? "Semana" : p === "month" ? "Mês" : p === "quarter" ? "Trimestre" : "Ano"}
          </button>
        ))}
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* MRR */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-600">
          <p className="text-gray-600 text-sm font-semibold mb-2">MRR (Monthly Recurring Revenue)</p>
          <p className="text-3xl font-bold text-gray-900 mb-2">{formatCurrency(metrics.mrr)}</p>
          <p className="text-green-600 text-sm">↑ 2.5% vs mês anterior</p>
        </div>

        {/* Churn Rate */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-600">
          <p className="text-gray-600 text-sm font-semibold mb-2">Churn Rate</p>
          <p className="text-3xl font-bold text-gray-900 mb-2">{formatPercent(metrics.churnRate)}</p>
          <p className="text-green-600 text-sm">↓ 0.3% vs mês anterior</p>
        </div>

        {/* LTV */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-600">
          <p className="text-gray-600 text-sm font-semibold mb-2">LTV (Lifetime Value)</p>
          <p className="text-3xl font-bold text-gray-900 mb-2">{formatCurrency(metrics.ltv)}</p>
          <p className="text-gray-600 text-sm">Valor médio por usuário</p>
        </div>

        {/* Conversão */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-600">
          <p className="text-gray-600 text-sm font-semibold mb-2">Taxa de Conversão</p>
          <p className="text-3xl font-bold text-gray-900 mb-2">{formatPercent(metrics.conversionRate)}</p>
          <p className="text-gray-600 text-sm">Free → Paid</p>
        </div>

        {/* Adimplência */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-600">
          <p className="text-gray-600 text-sm font-semibold mb-2">Adimplência</p>
          <p className="text-3xl font-bold text-gray-900 mb-2">{formatPercent(metrics.adimplencia)}</p>
          <p className="text-gray-600 text-sm">Pagamentos em dia</p>
        </div>

        {/* Usuários Ativos */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-indigo-600">
          <p className="text-gray-600 text-sm font-semibold mb-2">Usuários Ativos</p>
          <p className="text-3xl font-bold text-gray-900 mb-2">{metrics.activeUsers.toLocaleString()}</p>
          <p className="text-green-600 text-sm">↑ {metrics.newUsers} novos</p>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* MRR Trend */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Tendência de MRR</h2>
          <div className="h-64 bg-gray-50 rounded flex items-end justify-center gap-2 p-4">
            {mrrTrend.map((data, idx) => (
              <div key={idx} className="flex flex-col items-center flex-1">
                <div
                  className="w-full bg-blue-600 rounded-t"
                  style={{ height: `${(data.value / 50000) * 100}%` }}
                />
                <p className="text-xs text-gray-600 mt-2">{data.date}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-4">
            Crescimento: +{(((mrrTrend[mrrTrend.length - 1]?.value || 0) - (mrrTrend[0]?.value || 0)) / (mrrTrend[0]?.value || 1) * 100).toFixed(1)}%
          </p>
        </div>

        {/* Churn Trend */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Tendência de Churn</h2>
          <div className="h-64 bg-gray-50 rounded flex items-end justify-center gap-2 p-4">
            {churnTrend.map((data, idx) => (
              <div key={idx} className="flex flex-col items-center flex-1">
                <div
                  className="w-full bg-red-600 rounded-t"
                  style={{ height: `${(data.value / 6) * 100}%` }}
                />
                <p className="text-xs text-gray-600 mt-2">{data.date}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-4">
            Redução: -{(((churnTrend[0]?.value || 0) - (churnTrend[churnTrend.length - 1]?.value || 0)) / (churnTrend[0]?.value || 1) * 100).toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Tabela de Resumo */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">Resumo Financeiro</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Métrica</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Valor</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Variação</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">Receita Total</td>
                <td className="px-6 py-4 text-sm text-right font-semibold text-gray-900">
                  {formatCurrency(metrics.totalRevenue)}
                </td>
                <td className="px-6 py-4 text-sm text-right text-green-600">↑ 5.2%</td>
              </tr>
              <tr className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">Valor Médio de Assinatura</td>
                <td className="px-6 py-4 text-sm text-right font-semibold text-gray-900">
                  {formatCurrency(metrics.avgSubscriptionValue)}
                </td>
                <td className="px-6 py-4 text-sm text-right text-gray-600">→ 0%</td>
              </tr>
              <tr className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">Usuários Novos</td>
                <td className="px-6 py-4 text-sm text-right font-semibold text-gray-900">
                  {metrics.newUsers}
                </td>
                <td className="px-6 py-4 text-sm text-right text-green-600">↑ 12.3%</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">Taxa de Conversão</td>
                <td className="px-6 py-4 text-sm text-right font-semibold text-gray-900">
                  {formatPercent(metrics.conversionRate)}
                </td>
                <td className="px-6 py-4 text-sm text-right text-green-600">↑ 1.2%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Recomendações da IA */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="text-lg font-bold text-blue-900 mb-4">🤖 Recomendações da IA</h2>
        <ul className="space-y-2 text-blue-800">
          <li>✅ Churn rate em queda: continue com a estratégia de retenção atual</li>
          <li>⚠️ Conversão abaixo da meta: considere revisar preços ou oferecer trial estendido</li>
          <li>💡 MRR crescendo: oportunidade para aumentar investimento em marketing</li>
          <li>📈 LTV saudável: foco em reduzir CAC (Customer Acquisition Cost)</li>
        </ul>
      </div>
    </div>
  );
}
