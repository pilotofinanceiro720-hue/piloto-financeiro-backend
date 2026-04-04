/**
 * Painel Administrativo - Relatórios de Receita e Conversões
 * Exibe gráficos e métricas de receita, conversões e ROI
 */

"use client";

import React, { useState, useEffect } from "react";

interface RevenueData {
  date: string;
  revenue: number;
  conversions: number;
  affiliateRevenue: number;
  subscriptionRevenue: number;
}

interface ConversionMetrics {
  totalConversions: number;
  conversionRate: number;
  averageOrderValue: number;
  totalRevenue: number;
  affiliateCommissions: number;
  netRevenue: number;
  subscriptionRevenue?: number;
}

interface PlanRevenue {
  plan: "monthly" | "semestral" | "annual";
  count: number;
  revenue: number;
  percentage: number;
}

export default function ReportsPage() {
  const [period, setPeriod] = useState<"7d" | "30d" | "90d" | "1y">("30d");
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [metrics, setMetrics] = useState<ConversionMetrics | null>(null);
  const [planRevenue, setPlanRevenue] = useState<PlanRevenue[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadReports();
  }, [period]);

  const loadReports = async () => {
    try {
      setLoading(true);
      console.log("Carregando relatórios para período:", period);

      setMetrics({
        totalConversions: 1250,
        conversionRate: 0.045,
        averageOrderValue: 89.99,
        totalRevenue: 112487.5,
        affiliateCommissions: 22497.5,
        netRevenue: 89990,
        subscriptionRevenue: 67492.5,
      });

      setPlanRevenue([
        { plan: "monthly", count: 800, revenue: 47990, percentage: 42.7 },
        { plan: "semestral", count: 300, revenue: 35970, percentage: 32 },
        { plan: "annual", count: 150, revenue: 28527.5, percentage: 25.3 },
      ]);

      const data: RevenueData[] = [];
      for (let i = 30; i > 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        data.push({
          date: date.toISOString().split("T")[0],
          revenue: Math.random() * 5000 + 2000,
          conversions: Math.floor(Math.random() * 50 + 20),
          affiliateRevenue: Math.random() * 1000 + 500,
          subscriptionRevenue: Math.random() * 4000 + 1500,
        });
      }
      setRevenueData(data);
    } catch (error) {
      console.error("Erro ao carregar relatórios:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalRevenue = revenueData.reduce((sum, d) => sum + d.revenue, 0);
  const totalConversions = revenueData.reduce((sum, d) => sum + d.conversions, 0);
  const averageDaily = totalRevenue / revenueData.length;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Relatórios de Receita e Conversões</h1>
          <div className="flex gap-2">
            {(["7d", "30d", "90d", "1y"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-2 rounded ${
                  period === p ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {p === "7d" ? "7 dias" : p === "30d" ? "30 dias" : p === "90d" ? "90 dias" : "1 ano"}
              </button>
            ))}
          </div>
        </div>

        {/* Métricas Principais */}
        {metrics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-600 text-sm mb-2">Receita Total</p>
              <p className="text-3xl font-bold text-blue-600">
                R$ {metrics.totalRevenue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Média diária: R$ {(metrics.totalRevenue / 30).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-600 text-sm mb-2">Total de Conversões</p>
              <p className="text-3xl font-bold text-green-600">{metrics.totalConversions.toLocaleString("pt-BR")}</p>
              <p className="text-xs text-gray-500 mt-2">Taxa de conversão: {(metrics.conversionRate * 100).toFixed(2)}%</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-600 text-sm mb-2">Receita Líquida</p>
              <p className="text-3xl font-bold text-purple-600">
                R$ {metrics.netRevenue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-gray-500 mt-2">Após comissões de afiliados</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-600 text-sm mb-2">Ticket Médio</p>
              <p className="text-3xl font-bold text-orange-600">
                R$ {metrics.averageOrderValue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-gray-500 mt-2">Valor médio por conversão</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-600 text-sm mb-2">Comissões de Afiliados</p>
              <p className="text-3xl font-bold text-red-600">
                R$ {metrics.affiliateCommissions.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {((metrics.affiliateCommissions / metrics.totalRevenue) * 100).toFixed(1)}% da receita total
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-600 text-sm mb-2">Receita por Assinatura</p>
              <p className="text-3xl font-bold text-indigo-600">
                R$ {(metrics.subscriptionRevenue || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-gray-500 mt-2">Receita recorrente</p>
            </div>
          </div>
        )}

        {/* Receita por Plano */}
        {planRevenue.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow mb-8">
            <h2 className="text-xl font-bold mb-4">Receita por Plano</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {planRevenue.map((plan) => (
                <div key={plan.plan} className="border border-gray-200 p-4 rounded">
                  <p className="font-semibold mb-2">
                    {plan.plan === "monthly" ? "Mensal" : plan.plan === "semestral" ? "Semestral" : "Anual"}
                  </p>
                  <p className="text-2xl font-bold text-blue-600 mb-2">
                    R$ {plan.revenue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">{plan.count} assinaturas</p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${plan.percentage}%` }} />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">{plan.percentage.toFixed(1)}% do total</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Gráfico de Receita */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-bold mb-4">Receita Diária</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-4">Data</th>
                  <th className="text-right py-2 px-4">Receita</th>
                  <th className="text-right py-2 px-4">Conversões</th>
                  <th className="text-right py-2 px-4">Afiliados</th>
                  <th className="text-right py-2 px-4">Assinatura</th>
                </tr>
              </thead>
              <tbody>
                {revenueData.slice(-7).map((data) => (
                  <tr key={data.date} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-2 px-4">{new Date(data.date).toLocaleDateString("pt-BR")}</td>
                    <td className="text-right py-2 px-4 font-semibold">
                      R$ {data.revenue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="text-right py-2 px-4">{data.conversions}</td>
                    <td className="text-right py-2 px-4">
                      R$ {data.affiliateRevenue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="text-right py-2 px-4">
                      R$ {data.subscriptionRevenue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Resumo */}
        <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
          <h3 className="font-bold text-blue-900 mb-2">Resumo do Período</h3>
          <p className="text-blue-800 text-sm">
            Receita total de <strong>R$ {totalRevenue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</strong> com{" "}
            <strong>{totalConversions} conversões</strong> e média diária de{" "}
            <strong>R$ {averageDaily.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</strong>. O programa de afiliados gerou{" "}
            <strong>R$ {(totalRevenue * 0.2).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</strong> em comissões.
          </p>
        </div>
      </div>
    </div>
  );
}
