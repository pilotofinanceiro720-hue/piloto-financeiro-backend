import { getDb } from "../db";
import { eq, like } from "drizzle-orm";
import { offers } from "../../drizzle/schema";

export interface AISearchQuery {
  query: string;
  category?: string;
  maxPrice?: number;
  minTrustScore?: number;
}

export interface AIOfferResult {
  id?: number;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  storeName: string;
  storeUrl: string;
  productUrl: string;
  couponCode?: string;
  couponDiscount?: number;
  trustScore: number;
  category: string;
  imageUrl?: string;
  isAffiliate: boolean;
  affiliateUrl?: string;
  lastUpdated: Date;
}

/**
 * Busca ofertas usando IA
 * Integra com o LLM do servidor para buscar e validar ofertas
 */
export async function searchOffersWithAI(query: AISearchQuery): Promise<AIOfferResult[]> {
  try {
    const database = await getDb();
    if (!database) return [];

    // TODO: Integrar com LLM do servidor para buscar ofertas
    // Por enquanto, retorna ofertas do banco de dados
    const dbOffers = await database.select().from(offers).where(like(offers.title, `%${query.query}%`)).limit(10);

    return dbOffers.map((offer: any) => ({
      id: offer.id,
      title: offer.title,
      description: offer.description || "",
      price: offer.price,
      originalPrice: offer.originalPrice,
      storeName: offer.storeName,
      storeUrl: offer.storeUrl || "",
      productUrl: offer.productUrl || "",
      couponCode: offer.couponCode,
      couponDiscount: offer.couponDiscount,
      trustScore: offer.trustScore || 80,
      category: offer.category || "geral",
      imageUrl: offer.imageUrl,
      isAffiliate: offer.isAffiliate || false,
      affiliateUrl: offer.affiliateUrl,
      lastUpdated: offer.updatedAt || new Date(),
    }));
  } catch (error) {
    console.error("Erro ao buscar ofertas com IA:", error);
    return [];
  }
}

/**
 * Valida confiabilidade de uma oferta usando IA
 */
export async function validateOfferTrust(offer: AIOfferResult): Promise<{
  trustScore: number;
  isScam: boolean;
  warnings: string[];
  recommendations: string[];
}> {
  const warnings: string[] = [];
  const recommendations: string[] = [];
  let trustScore = 100;

  // Validações básicas
  if (!offer.storeUrl || !offer.productUrl) {
    warnings.push("URL da loja ou produto não encontrada");
    trustScore -= 20;
  }

  if (offer.price > (offer.originalPrice || 0) * 2) {
    warnings.push("Preço muito acima do valor original");
    trustScore -= 15;
  }

  if (offer.trustScore < 60) {
    warnings.push("Loja com baixa reputação");
    trustScore -= 25;
  }

  // TODO: Integrar com IA para análise mais profunda
  // - Verificar histórico da loja
  // - Analisar reviews
  // - Detectar padrões de fraude

  if (trustScore < 50) {
    recommendations.push("Não recomendamos esta oferta");
  } else if (trustScore < 70) {
    recommendations.push("Verifique a reputação da loja antes de comprar");
  } else {
    recommendations.push("Oferta segura para compra");
  }

  return {
    trustScore: Math.max(0, trustScore),
    isScam: trustScore < 40,
    warnings,
    recommendations,
  };
}

/**
 * Recomenda ofertas baseado no perfil do motorista
 */
export async function getRecommendedOffers(userId: number): Promise<AIOfferResult[]> {
  try {
    const database = await getDb();
    if (!database) return [];

    // TODO: Analisar histórico de compras e preferências do usuário
    // Usar IA para recomendar ofertas relevantes

    // Por enquanto, retorna ofertas mais confiáveis
    const dbOffers = await database.select().from(offers).limit(5);

    return dbOffers.map((offer: any) => ({
      id: offer.id,
      title: offer.title,
      description: offer.description || "",
      price: offer.price,
      originalPrice: offer.originalPrice,
      storeName: offer.storeName,
      storeUrl: offer.storeUrl || "",
      productUrl: offer.productUrl || "",
      couponCode: offer.couponCode,
      couponDiscount: offer.couponDiscount,
      trustScore: offer.trustScore || 80,
      category: offer.category || "geral",
      imageUrl: offer.imageUrl,
      isAffiliate: offer.isAffiliate || false,
      affiliateUrl: offer.affiliateUrl,
      lastUpdated: offer.updatedAt || new Date(),
    }));
  } catch (error) {
    console.error("Erro ao buscar ofertas recomendadas:", error);
    return [];
  }
}

/**
 * Detecta oportunidades de economia para o motorista
 */
export async function detectSavingsOpportunities(
  userId: number,
  monthlyExpenses: { fuel: number; maintenance: number }
): Promise<Array<{ category: string; savings: number; offers: AIOfferResult[] }>> {
  const opportunities: Array<{ category: string; savings: number; offers: AIOfferResult[] }> = [];

  try {
    const database = await getDb();
    if (!database) return [];

    // Oportunidades de combustível
    if (monthlyExpenses.fuel > 1000) {
      const fuelOffers = await database.select().from(offers).where(like(offers.category, "%combustível%")).limit(3);

      if (fuelOffers.length > 0) {
        const avgSavings = fuelOffers.reduce((acc: number, offer: any) => {
          const discount = offer.originalPrice
            ? ((offer.originalPrice - offer.price) / offer.originalPrice) * 100
            : 0;
          return acc + discount;
        }, 0) / fuelOffers.length;

        opportunities.push({
          category: "Combustível",
          savings: (monthlyExpenses.fuel * avgSavings) / 100,
          offers: fuelOffers.map((offer: any) => ({
            id: offer.id,
            title: offer.title,
            description: offer.description || "",
            price: offer.price,
            originalPrice: offer.originalPrice,
            storeName: offer.storeName,
            storeUrl: offer.storeUrl || "",
            productUrl: offer.productUrl || "",
            couponCode: offer.couponCode,
            couponDiscount: offer.couponDiscount,
            trustScore: offer.trustScore || 80,
            category: offer.category || "geral",
            imageUrl: offer.imageUrl,
            isAffiliate: offer.isAffiliate || false,
            affiliateUrl: offer.affiliateUrl,
            lastUpdated: offer.updatedAt || new Date(),
          })),
        });
      }
    }

    // Oportunidades de manutenção
    if (monthlyExpenses.maintenance > 1500) {
      const maintenanceOffers = await database.select().from(offers).where(like(offers.category, "%manutenção%")).limit(3);

      if (maintenanceOffers.length > 0) {
        const avgSavings = maintenanceOffers.reduce((acc: number, offer: any) => {
          const discount = offer.originalPrice
            ? ((offer.originalPrice - offer.price) / offer.originalPrice) * 100
            : 0;
          return acc + discount;
        }, 0) / maintenanceOffers.length;

        opportunities.push({
          category: "Manutenção",
          savings: (monthlyExpenses.maintenance * avgSavings) / 100,
          offers: maintenanceOffers.map((offer: any) => ({
            id: offer.id,
            title: offer.title,
            description: offer.description || "",
            price: offer.price,
            originalPrice: offer.originalPrice,
            storeName: offer.storeName,
            storeUrl: offer.storeUrl || "",
            productUrl: offer.productUrl || "",
            couponCode: offer.couponCode,
            couponDiscount: offer.couponDiscount,
            trustScore: offer.trustScore || 80,
            category: offer.category || "geral",
            imageUrl: offer.imageUrl,
            isAffiliate: offer.isAffiliate || false,
            affiliateUrl: offer.affiliateUrl,
            lastUpdated: offer.updatedAt || new Date(),
          })),
        });
      }
    }

    return opportunities;
  } catch (error) {
    console.error("Erro ao detectar oportunidades de economia:", error);
    return [];
  }
}
