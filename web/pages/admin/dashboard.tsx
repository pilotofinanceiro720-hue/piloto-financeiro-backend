import React, { useState } from "react";

interface DashboardStats {
  totalUsers: number;
  activeSubscriptions: number;
  monthlyRevenue: number;
  conversionRate: number;
  totalOffers: number;
  affiliateCommissions: number;
}

interface ChartData {
  month: string;
  revenue: number;
  users: number;
  subscriptions: number;
}

export default function AdminDashboard() {
  const [stats] = useState<DashboardStats>({
    totalUsers: 1250,
    activeSubscriptions: 850,
    monthlyRevenue: 42500,
    conversionRate: 68,
    totalOffers: 324,
    affiliateCommissions: 8750,
  });

  const [chartData] = useState<ChartData[]>([
    { month: "Jan", revenue: 28000, users: 450, subscriptions: 280 },
    { month: "Fev", revenue: 35000, users: 680, subscriptions: 450 },
    { month: "Mar", revenue: 42500, users: 1250, subscriptions: 850 },
  ]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Painel Administrativo</h1>
        <p className="text-gray-600 mt-2">Visão geral da plataforma Driver Finance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Total de Usuários */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total de Usuários</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalUsers.toLocaleString()}</p>
              <p className="text-green-600 text-sm mt-2">+15% este mês</p>
            </div>
            <div className="bg-blue-100 rounded-full p-3">
              <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Assinaturas Ativas */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Assinaturas Ativas</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.activeSubscriptions.toLocaleString()}</p>
              <p className="text-green-600 text-sm mt-2">Taxa: {stats.conversionRate}%</p>
            </div>
            <div className="bg-green-100 rounded-full p-3">
              <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 1 1 0 000 2H6a6 6 0 100 12H6a1 1 0 000 2 2 2 0 002-2v-4a6 6 0 100-12h-2a2 2 0 00-2 2v4a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H4z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        {/* Receita Mensal */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Receita Mensal</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">R$ {(stats.monthlyRevenue / 1000).toFixed(1)}k</p>
              <p className="text-green-600 text-sm mt-2">+21% vs mês anterior</p>
            </div>
            <div className="bg-purple-100 rounded-full p-3">
              <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8.16 2.75a.75.75 0 00-1.32 0l-3.5 9.5A.75.75 0 004.5 13h11a.75.75 0 00.66-1.25l-3.5-9.5z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Total de Ofertas */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total de Ofertas</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalOffers}</p>
              <p className="text-blue-600 text-sm mt-2">+12 novas ofertas</p>
            </div>
            <div className="bg-orange-100 rounded-full p-3">
              <svg className="w-8 h-8 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 6H6.28l-.31-1.243A1 1 0 005 4H3z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Comissões de Afiliados */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Comissões (Mês)</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">R$ {(stats.affiliateCommissions / 1000).toFixed(1)}k</p>
              <p className="text-green-600 text-sm mt-2">+8% vs mês anterior</p>
            </div>
            <div className="bg-pink-100 rounded-full p-3">
              <svg className="w-8 h-8 text-pink-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Taxa de Conversão */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Taxa de Conversão</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.conversionRate}%</p>
              <p className="text-green-600 text-sm mt-2">+3% vs mês anterior</p>
            </div>
            <div className="bg-indigo-100 rounded-full p-3">
              <svg className="w-8 h-8 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V9.414l-4.293 4.293a1 1 0 01-1.414-1.414L13.586 8H12z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos Simples */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Receita e Usuários */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Receita e Usuários (3 meses)</h2>
          <div className="space-y-4">
            {chartData.map((data, idx) => (
              <div key={idx}>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{data.month}</span>
                  <span className="text-sm font-bold text-gray-900">R$ {(data.revenue / 1000).toFixed(1)}k</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${(data.revenue / 42500) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Assinaturas */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Crescimento de Assinaturas</h2>
          <div className="space-y-4">
            {chartData.map((data, idx) => (
              <div key={idx}>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{data.month}</span>
                  <span className="text-sm font-bold text-gray-900">{data.subscriptions}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: `${(data.subscriptions / 850) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabelas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Usuários Recentes */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Usuários Recentes</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Nome</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Plano</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "João Silva", status: "Ativo", plan: "Mensal" },
                  { name: "Maria Santos", status: "Ativo", plan: "Anual" },
                  { name: "Pedro Costa", status: "Inativo", plan: "Semestral" },
                  { name: "Ana Oliveira", status: "Ativo", plan: "Mensal" },
                ].map((user, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-900">{user.name}</td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        user.status === "Ativo"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{user.plan}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Ofertas Populares */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Ofertas Populares</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Produto</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Cliques</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Conversão</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { product: "Pneu Pirelli P7", clicks: 234, conversion: "12%" },
                  { product: "Óleo Motor Mobil", clicks: 189, conversion: "8%" },
                  { product: "Filtro de Ar", clicks: 156, conversion: "15%" },
                  { product: "Pastilha de Freio", clicks: 142, conversion: "10%" },
                ].map((offer, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-900">{offer.product}</td>
                    <td className="py-3 px-4 text-gray-600">{offer.clicks}</td>
                    <td className="py-3 px-4">
                      <span className="text-green-600 font-medium">{offer.conversion}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
