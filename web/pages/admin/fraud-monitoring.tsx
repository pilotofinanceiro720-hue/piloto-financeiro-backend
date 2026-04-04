import { useState } from "react";

interface FraudAlert {
  id: string;
  userId: number;
  type: string;
  severity: "low" | "medium" | "high" | "critical";
  description: string;
  createdAt: string;
  status: "pending" | "investigating" | "confirmed" | "dismissed";
}

export default function FraudMonitoringPage() {
  const [activeTab, setActiveTab] = useState<"pending" | "confirmed" | "statistics">("pending");
  const [selectedAlert, setSelectedAlert] = useState<FraudAlert | null>(null);

  const alerts: FraudAlert[] = [
    {
      id: "fa_001",
      userId: 123,
      type: "high_velocity",
      severity: "critical",
      description: "15 referências em 1 hora (limite: 10)",
      createdAt: "2026-02-16T01:30:00Z",
      status: "pending",
    },
    {
      id: "fa_002",
      userId: 456,
      type: "multiple_accounts",
      severity: "high",
      description: "Detectadas 3 contas associadas",
      createdAt: "2026-02-16T00:45:00Z",
      status: "pending",
    },
    {
      id: "fa_003",
      userId: 789,
      type: "unusual_pattern",
      severity: "medium",
      description: "Taxa de cancelamento de 85% em 7 dias",
      createdAt: "2026-02-15T22:15:00Z",
      status: "investigating",
    },
  ];

  const stats = {
    totalAlerts: 24,
    pendingAlerts: 8,
    confirmedFrauds: 3,
    blockedUsers: 2,
    criticalAlerts: 2,
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-red-50 border-red-200";
      case "investigating":
        return "bg-yellow-50 border-yellow-200";
      case "confirmed":
        return "bg-orange-50 border-orange-200";
      case "dismissed":
        return "bg-green-50 border-green-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-3xl font-bold text-gray-900">Monitoramento de Fraude</h1>
        <p className="text-gray-600 mt-1">Detecte e gerencie atividades suspeitas</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Total de Alertas</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalAlerts}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Pendentes</p>
          <p className="text-3xl font-bold text-red-600 mt-2">{stats.pendingAlerts}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Fraudes Confirmadas</p>
          <p className="text-3xl font-bold text-orange-600 mt-2">{stats.confirmedFrauds}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Usuários Bloqueados</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{stats.blockedUsers}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Alertas Críticos</p>
          <p className="text-3xl font-bold text-red-600 mt-2">{stats.criticalAlerts}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 mb-4">
        <div className="flex gap-2 border-b border-gray-200">
          {["pending", "confirmed", "statistics"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-2 font-medium border-b-2 ${
                activeTab === tab
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab === "pending" ? "Pendentes" : tab === "confirmed" ? "Confirmadas" : "Estatísticas"}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-6 pb-6">
        {activeTab === "pending" && (
          <div className="space-y-4">
            {alerts
              .filter((a) => a.status === "pending" || a.status === "investigating")
              .map((alert) => (
                <div
                  key={alert.id}
                  className={`bg-white rounded-lg border-2 p-4 cursor-pointer hover:shadow-lg transition ${getStatusColor(alert.status)}`}
                  onClick={() => setSelectedAlert(alert)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${getSeverityColor(alert.severity)}`}>
                          {alert.severity.toUpperCase()}
                        </span>
                        <span className="text-sm text-gray-600">{alert.type}</span>
                      </div>
                      <p className="font-medium text-gray-900">{alert.description}</p>
                      <p className="text-sm text-gray-600 mt-2">
                        Usuário: #{alert.userId} | {new Date(alert.createdAt).toLocaleString("pt-BR")}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        alert.status === "pending"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {alert.status === "pending" ? "Pendente" : "Investigando"}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
                    <button className="flex-1 px-3 py-2 bg-green-500 text-white rounded text-sm font-medium hover:bg-green-600">
                      Descartar
                    </button>
                    <button className="flex-1 px-3 py-2 bg-yellow-500 text-white rounded text-sm font-medium hover:bg-yellow-600">
                      Investigar
                    </button>
                    <button className="flex-1 px-3 py-2 bg-red-500 text-white rounded text-sm font-medium hover:bg-red-600">
                      Confirmar Fraude
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}

        {activeTab === "confirmed" && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Fraudes Confirmadas</h3>
            <div className="space-y-4">
              {alerts
                .filter((a) => a.status === "confirmed")
                .map((alert) => (
                  <div key={alert.id} className="border-l-4 border-red-500 pl-4 py-2">
                    <p className="font-medium text-gray-900">{alert.description}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Usuário: #{alert.userId} | {new Date(alert.createdAt).toLocaleString("pt-BR")}
                    </p>
                    <button className="mt-2 px-3 py-1 bg-red-500 text-white rounded text-sm font-medium hover:bg-red-600">
                      Bloquear Usuário
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}

        {activeTab === "statistics" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Alertas por Tipo */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Alertas por Tipo</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Velocidade Anormal</span>
                  <span className="font-semibold text-gray-900">8</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Múltiplas Contas</span>
                  <span className="font-semibold text-gray-900">5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Padrão Incomum</span>
                  <span className="font-semibold text-gray-900">7</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Falha de Pagamento</span>
                  <span className="font-semibold text-gray-900">3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Churn de Referência</span>
                  <span className="font-semibold text-gray-900">1</span>
                </div>
              </div>
            </div>

            {/* Alertas por Severidade */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Alertas por Severidade</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-600"></div>
                    <span className="text-gray-600">Crítico</span>
                  </div>
                  <span className="font-semibold text-gray-900">2</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                    <span className="text-gray-600">Alto</span>
                  </div>
                  <span className="font-semibold text-gray-900">6</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <span className="text-gray-600">Médio</span>
                  </div>
                  <span className="font-semibold text-gray-900">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-gray-600">Baixo</span>
                  </div>
                  <span className="font-semibold text-gray-900">4</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
