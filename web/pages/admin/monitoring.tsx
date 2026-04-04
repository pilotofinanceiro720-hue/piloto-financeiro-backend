/**
 * Painel de Monitoramento Técnico
 * Logs, sessões ativas, falhas de permissão, consumo de bateria
 */

export default function MonitoringDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Monitoramento Técnico
          </h1>
          <p className="text-gray-600 mt-2">
            Acompanhe logs, sessões ativas e métricas de desempenho
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Active Sessions */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  Sessões Ativas
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">24</p>
              </div>
              <div className="text-4xl">🟢</div>
            </div>
            <p className="text-green-600 text-sm mt-4">+3 últimos 5 min</p>
          </div>

          {/* Error Rate */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Taxa de Erro</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">0.8%</p>
              </div>
              <div className="text-4xl">📊</div>
            </div>
            <p className="text-green-600 text-sm mt-4">Dentro do esperado</p>
          </div>

          {/* Permission Failures */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  Falhas de Permissão
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">3</p>
              </div>
              <div className="text-4xl">🔒</div>
            </div>
            <p className="text-yellow-600 text-sm mt-4">Requer atenção</p>
          </div>

          {/* Avg Battery */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  Consumo Médio Bateria
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">6.2%</p>
              </div>
              <div className="text-4xl">🔋</div>
            </div>
            <p className="text-green-600 text-sm mt-4">Otimizado</p>
          </div>
        </div>

        {/* Logs Section */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="border-b border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900">Logs de Erro</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Timestamp
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Usuário
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Tipo de Erro
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Mensagem
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    2026-02-17 01:15:32
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    motorista_001
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                      Permission Denied
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    Acesso de Uso de Apps negado
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                      Pendente
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    2026-02-17 01:10:15
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    motorista_002
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                      Network Error
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    Falha ao sincronizar com backend
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                      Resolvido
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    2026-02-17 00:55:42
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    motorista_003
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">
                      Battery Warning
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    Consumo de bateria acima de 10%/h
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                      Monitorando
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Active Sessions */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900">Sessões Ativas</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Usuário
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Dispositivo
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Bateria
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Última Atividade
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    motorista_001
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    Samsung Galaxy A12
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                      🟢 ONLINE
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">78%</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    1 min atrás
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    motorista_002
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    Xiaomi Redmi 9
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                      🟡 PAUSA
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">45%</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    5 min atrás
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    motorista_003
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    Motorola G8
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                      🟢 ONLINE
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">92%</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    2 min atrás
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
