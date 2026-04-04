/**
 * PILOTO FINANCEIRO — Detector de perfil do motorista
 * Identifica automaticamente se o motorista é FIXO (opera em região principal)
 * ou NÔMADE (opera em múltiplas regiões) com base no histórico de corridas.
 */

export type DriverProfile = "fixo" | "nomade";

export interface RegionStats {
  region: string;
  rideCount: number;
  percentage: number;
  avgRatePerHour: number;
  avgRatePerKm: number;
}

export interface ProfileResult {
  profile: DriverProfile;
  mainRegion?: string;
  mainRegionPct?: number;
  regions: RegionStats[];
  insight: string;
}

/**
 * Detecta o perfil do motorista com base nas últimas N corridas.
 * Fixo: 80%+ das corridas em raio de 15km / mesma região
 * Nômade: corridas distribuídas em múltiplas regiões
 */
export function detectDriverProfile(rides: {
  region: string;
  grossValue: number;
  distanceKm: number;
  durationMinutes: number;
}[]): ProfileResult {
  if (rides.length === 0) {
    return {
      profile: "fixo",
      regions: [],
      insight: "Nenhuma corrida registrada ainda.",
    };
  }

  // Agrupa por região
  const regionMap = new Map<string, { count: number; gross: number; km: number; minutes: number }>();

  for (const ride of rides) {
    const region = ride.region || "Desconhecida";
    const existing = regionMap.get(region) ?? { count: 0, gross: 0, km: 0, minutes: 0 };
    regionMap.set(region, {
      count: existing.count + 1,
      gross: existing.gross + ride.grossValue,
      km: existing.km + ride.distanceKm,
      minutes: existing.minutes + ride.durationMinutes,
    });
  }

  const total = rides.length;
  const regions: RegionStats[] = Array.from(regionMap.entries())
    .map(([region, stats]) => ({
      region,
      rideCount: stats.count,
      percentage: Math.round((stats.count / total) * 100),
      avgRatePerHour: stats.minutes > 0 ? (stats.gross / stats.minutes) * 60 : 0,
      avgRatePerKm: stats.km > 0 ? stats.gross / stats.km : 0,
    }))
    .sort((a, b) => b.rideCount - a.rideCount);

  const topRegion = regions[0];
  const isFixo = topRegion && topRegion.percentage >= 80;

  if (isFixo) {
    return {
      profile: "fixo",
      mainRegion: topRegion.region,
      mainRegionPct: topRegion.percentage,
      regions,
      insight: `Você opera principalmente na região ${topRegion.region} (${topRegion.percentage}% das suas corridas).`,
    };
  }

  // Nômade — constrói insight com as principais regiões
  const topThree = regions.slice(0, 3);
  const insight = `Você é um motorista nômade — suas corridas estão distribuídas entre ${topThree.map((r) => `${r.region} (${r.percentage}%)`).join(", ")}.`;

  return {
    profile: "nomade",
    regions,
    insight,
  };
}

/**
 * Gera alerta de rentabilidade considerando a região atual do motorista.
 * Para nômades, compara com a média histórica daquela região específica.
 * Para fixos, compara com a média geral deles.
 */
export function buildRegionalAlert(params: {
  driverProfile: DriverProfile;
  currentRegion: string;
  currentRatePerHour: number;
  driverOverallAvg: number;
  regionHistoricalAvg: number;
  hoursBelow: number;
}): { shouldAlert: boolean; message: string } {
  const { driverProfile, currentRegion, currentRatePerHour, driverOverallAvg, regionHistoricalAvg, hoursBelow } = params;

  const referenceAvg = driverProfile === "nomade" && regionHistoricalAvg > 0
    ? regionHistoricalAvg
    : driverOverallAvg;

  const dropPct = referenceAvg > 0
    ? Math.round(((referenceAvg - currentRatePerHour) / referenceAvg) * 100)
    : 0;

  if (hoursBelow < 2 || dropPct < 25) {
    return { shouldAlert: false, message: "" };
  }

  const contextMsg = driverProfile === "nomade"
    ? `A ${currentRegion} costuma render R$ ${referenceAvg.toFixed(2)}/h para o seu perfil.`
    : `Sua média geral é R$ ${referenceAvg.toFixed(2)}/h.`;

  const message = `⚠️ Nas últimas ${hoursBelow}h você está ganhando R$ ${currentRatePerHour.toFixed(2)}/h — ${dropPct}% abaixo do esperado. ${contextMsg} Quer fazer uma pausa?`;

  return { shouldAlert: true, message };
}
