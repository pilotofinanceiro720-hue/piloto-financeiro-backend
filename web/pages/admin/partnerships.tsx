/**
 * Painel Administrativo - Gestão de Parcerias
 * Permite incluir, editar, excluir e aprovar ofertas de parcerias
 */

"use client";

import React, { useState, useEffect } from "react";

interface Partnership {
  id: string;
  name: string;
  category: string;
  logo: string;
  description: string;
  commissionRate: number;
  status: "active" | "pending" | "inactive";
  createdAt: string;
  updatedAt: string;
  aiGenerated: boolean;
}

interface Offer {
  id: string;
  partnerId: string;
  title: string;
  description: string;
  discount: number;
  coupon?: string;
  expiresAt: string;
  status: "active" | "pending" | "expired";
  createdAt: string;
}

export default function PartnershipsPage() {
  const [partnerships, setPartnerships] = useState<Partnership[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [activeTab, setActiveTab] = useState<"partnerships" | "offers">("partnerships");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Partnership>>({});
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<"all" | "active" | "pending" | "inactive">("all");

  useEffect(() => {
    loadPartnerships();
    loadOffers();
  }, []);

  const loadPartnerships = async () => {
    try {
      setLoading(true);
      // TODO: Buscar parcerias do backend
      // const response = await fetch('/api/admin/partnerships');
      // const data = await response.json();
      // setPartnerships(data);

      console.log("Carregando parcerias...");
      setPartnerships([
        {
          id: "1",
          name: "Exemplo Parceria",
          category: "Combustível",
          logo: "https://via.placeholder.com/100",
          description: "Parceria de exemplo",
          commissionRate: 0.05,
          status: "active",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          aiGenerated: false,
        },
      ]);
    } catch (error) {
      console.error("Erro ao carregar parcerias:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadOffers = async () => {
    try {
      // TODO: Buscar ofertas do backend
      // const response = await fetch('/api/admin/offers');
      // const data = await response.json();
      // setOffers(data);

      console.log("Carregando ofertas...");
    } catch (error) {
      console.error("Erro ao carregar ofertas:", error);
    }
  };

  const handleAddPartnership = async () => {
    try {
      setLoading(true);
      // TODO: Enviar para backend
      // const response = await fetch('/api/admin/partnerships', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });

      console.log("Adicionando parceria:", formData);
      setShowForm(false);
      setFormData({});
      loadPartnerships();
    } catch (error) {
      console.error("Erro ao adicionar parceria:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditPartnership = async (id: string, data: Partial<Partnership>) => {
    try {
      setLoading(true);
      // TODO: Enviar para backend
      // const response = await fetch(`/api/admin/partnerships/${id}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data)
      // });

      console.log("Editando parceria:", id, data);
      loadPartnerships();
    } catch (error) {
      console.error("Erro ao editar parceria:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePartnership = async (id: string) => {
    if (!confirm("Tem certeza que deseja deletar esta parceria?")) return;

    try {
      setLoading(true);
      // TODO: Enviar para backend
      // const response = await fetch(`/api/admin/partnerships/${id}`, {
      //   method: 'DELETE'
      // });

      console.log("Deletando parceria:", id);
      loadPartnerships();
    } catch (error) {
      console.error("Erro ao deletar parceria:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveOffer = async (offerId: string) => {
    try {
      setLoading(true);
      // TODO: Enviar para backend
      // const response = await fetch(`/api/admin/offers/${offerId}/approve`, {
      //   method: 'POST'
      // });

      console.log("Aprovando oferta:", offerId);
      loadOffers();
    } catch (error) {
      console.error("Erro ao aprovar oferta:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRejectOffer = async (offerId: string) => {
    try {
      setLoading(true);
      // TODO: Enviar para backend
      // const response = await fetch(`/api/admin/offers/${offerId}/reject`, {
      //   method: 'POST'
      // });

      console.log("Rejeitando oferta:", offerId);
      loadOffers();
    } catch (error) {
      console.error("Erro ao rejeitar oferta:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPartnerships = partnerships.filter((p) => {
    if (filter === "all") return true;
    return p.status === filter;
  });

  const pendingOffers = offers.filter((o) => o.status === "pending");

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Gestão de Parcerias</h1>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("partnerships")}
            className={`px-4 py-2 font-medium ${
              activeTab === "partnerships"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Parcerias ({partnerships.length})
          </button>
          <button
            onClick={() => setActiveTab("offers")}
            className={`px-4 py-2 font-medium ${
              activeTab === "offers"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Ofertas Pendentes ({pendingOffers.length})
          </button>
        </div>

        {/* Partnerships Tab */}
        {activeTab === "partnerships" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <div className="flex gap-2">
                {(["all", "active", "pending", "inactive"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-4 py-2 rounded ${
                      filter === f
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {f === "all" ? "Todas" : f === "active" ? "Ativas" : f === "pending" ? "Pendentes" : "Inativas"}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowForm(!showForm)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {showForm ? "Cancelar" : "+ Nova Parceria"}
              </button>
            </div>

            {/* Form */}
            {showForm && (
              <div className="bg-white p-6 rounded-lg shadow mb-6">
                <h2 className="text-xl font-bold mb-4">Nova Parceria</h2>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    placeholder="Nome da Parceria"
                    value={formData.name || ""}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded"
                  />
                  <input
                    type="text"
                    placeholder="Categoria"
                    value={formData.category || ""}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded"
                  />
                  <input
                    type="url"
                    placeholder="URL do Logo"
                    value={formData.logo || ""}
                    onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded"
                  />
                  <input
                    type="number"
                    placeholder="Taxa de Comissão (%)"
                    value={formData.commissionRate || ""}
                    onChange={(e) => setFormData({ ...formData, commissionRate: parseFloat(e.target.value) })}
                    className="px-3 py-2 border border-gray-300 rounded"
                  />
                </div>
                <textarea
                  placeholder="Descrição"
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded mb-4"
                  rows={3}
                />
                <button
                  onClick={handleAddPartnership}
                  disabled={loading}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                >
                  {loading ? "Salvando..." : "Salvar Parceria"}
                </button>
              </div>
            )}

            {/* Partnerships List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPartnerships.map((partnership) => (
                <div key={partnership.id} className="bg-white p-4 rounded-lg shadow">
                  <img
                    src={partnership.logo}
                    alt={partnership.name}
                    className="w-full h-32 object-cover rounded mb-2"
                  />
                  <h3 className="font-bold text-lg mb-2">{partnership.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{partnership.category}</p>
                  <p className="text-sm mb-2">{partnership.description}</p>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-semibold">Comissão: {(partnership.commissionRate * 100).toFixed(1)}%</span>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        partnership.status === "active"
                          ? "bg-green-100 text-green-800"
                          : partnership.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {partnership.status === "active" ? "Ativa" : partnership.status === "pending" ? "Pendente" : "Inativa"}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setFormData(partnership);
                        setShowForm(true);
                      }}
                      className="flex-1 px-2 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeletePartnership(partnership.id)}
                      className="flex-1 px-2 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Deletar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Offers Tab */}
        {activeTab === "offers" && (
          <div>
            <h2 className="text-xl font-bold mb-4">Ofertas Geradas pela IA (Aguardando Aprovação)</h2>
            {pendingOffers.length === 0 ? (
              <div className="bg-white p-6 rounded-lg shadow text-center text-gray-500">
                Nenhuma oferta pendente de aprovação
              </div>
            ) : (
              <div className="space-y-4">
                {pendingOffers.map((offer) => (
                  <div key={offer.id} className="bg-white p-4 rounded-lg shadow">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg">{offer.title}</h3>
                      <span className="text-sm font-semibold text-blue-600">Desconto: {offer.discount}%</span>
                    </div>
                    <p className="text-gray-600 mb-2">{offer.description}</p>
                    {offer.coupon && <p className="text-sm text-gray-500 mb-2">Cupom: {offer.coupon}</p>}
                    <p className="text-xs text-gray-400 mb-4">Expira em: {new Date(offer.expiresAt).toLocaleDateString("pt-BR")}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApproveOffer(offer.id)}
                        className="flex-1 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Aprovar
                      </button>
                      <button
                        onClick={() => handleRejectOffer(offer.id)}
                        className="flex-1 px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Rejeitar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
