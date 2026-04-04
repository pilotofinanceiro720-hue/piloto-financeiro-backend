/**
 * Auditor de Corridas
 * Compara valor estimado vs realizado com detecção de anomalias
 */

export interface RideData {
  rideId: string;
  platformId: string;
  platformName: string;
  estimatedValue: number;
  realValue: number;
  estimatedDistance: number;
  realDistance: number;
  estimatedTime: number; // em minutos
  realTime: number; // em minutos
  startTime: Date;
  endTime: Date;
  startLocation?: { lat: number; lng: number };
  endLocation?: { lat: number; lng: number };
}

export interface RideAudit {
  rideId: string;
  platformId: string;
  platformName: string;
  estimatedValue: number;
  realValue: number;
  valueDifference: number;
  valueDifferencePercent: number;
  distance: number;
  time: number;
  earningsPerKm: number;
  earningsPerHour: number;
  alerts: RideAlert[];
  fairValue: number;
  fairValueDifference: number;
  recommendation: string;
  auditDate: Date;
  status: "fair" | "suspicious" | "favorable";
}

export interface RideAlert {
  type: "time" | "distance" | "value" | "route";
  severity: "low" | "medium" | "high";
  message: string;
  threshold: number;
  actual: number;
  percentDifference: number;
}

/**
 * Tarifas padrão por plataforma (mock data)
 */
const PLATFORM_TARIFFS: Record<string, { kmRate: number; minRate: number }> = {
  uber: { kmRate: 1.4, minRate: 0.25 },
  "99": { kmRate: 1.2, minRate: 0.22 },
  loggi: { kmRate: 1.5, minRate: 0.3 },
  rappi: { kmRate: 1.3, minRate: 0.28 },
  ifood: { kmRate: 1.2, minRate: 0.25 },
};

/**
 * Audita uma corrida
 */
export function auditRide(rideData: RideData): RideAudit {
  console.log(`🔍 Auditando corrida ${rideData.rideId} em ${rideData.platformName}`);

  const alerts: RideAlert[] = [];

  // 1. Validar tempo
  const timeAlert = validateTime(rideData.estimatedTime, rideData.realTime);
  if (timeAlert) alerts.push(timeAlert);

  // 2. Validar distância
  const distanceAlert = validateDistance(rideData.estimatedDistance, rideData.realDistance);
  if (distanceAlert) alerts.push(distanceAlert);

  // 3. Calcular valor justo
  const fairValue = calculateFairValue(
    rideData.realDistance,
    rideData.realTime,
    rideData.platformName
  );

  // 4. Validar valor
  const valueAlert = validateValue(rideData.realValue, fairValue);
  if (valueAlert) alerts.push(valueAlert);

  // 5. Detectar rota divergente
  const routeAlert = detectDivergeRoute(
    rideData.estimatedDistance,
    rideData.realDistance,
    rideData.realTime
  );
  if (routeAlert) alerts.push(routeAlert);

  // 6. Calcular ganhos
  const earningsPerKm = rideData.realDistance > 0 ? rideData.realValue / rideData.realDistance : 0;
  const earningsPerHour = rideData.realTime > 0 ? (rideData.realValue / rideData.realTime) * 60 : 0;

  // 7. Determinar status
  const status = determineStatus(alerts, rideData.realValue, fairValue);

  // 8. Gerar recomendação
  const recommendation = generateRecommendation(alerts, rideData, fairValue);

  const audit: RideAudit = {
    rideId: rideData.rideId,
    platformId: rideData.platformId,
    platformName: rideData.platformName,
    estimatedValue: rideData.estimatedValue,
    realValue: rideData.realValue,
    valueDifference: rideData.realValue - rideData.estimatedValue,
    valueDifferencePercent: ((rideData.realValue - rideData.estimatedValue) / rideData.estimatedValue) * 100,
    distance: rideData.realDistance,
    time: rideData.realTime,
    earningsPerKm,
    earningsPerHour,
    alerts,
    fairValue,
    fairValueDifference: rideData.realValue - fairValue,
    recommendation,
    auditDate: new Date(),
    status,
  };

  // Log resultado
  logAuditResult(audit);

  return audit;
}

/**
 * Valida tempo da corrida
 */
function validateTime(estimatedTime: number, realTime: number): RideAlert | null {
  const percentDifference = ((realTime - estimatedTime) / estimatedTime) * 100;

  if (percentDifference > 15) {
    return {
      type: "time",
      severity: percentDifference > 30 ? "high" : "medium",
      message: `⚠️ Tempo ${percentDifference > 0 ? "maior" : "menor"} que estimado`,
      threshold: 15,
      actual: percentDifference,
      percentDifference,
    };
  }

  return null;
}

/**
 * Valida distância da corrida
 */
function validateDistance(estimatedDistance: number, realDistance: number): RideAlert | null {
  const percentDifference = ((realDistance - estimatedDistance) / estimatedDistance) * 100;

  if (percentDifference > 10) {
    return {
      type: "distance",
      severity: percentDifference > 20 ? "high" : "medium",
      message: `⚠️ Distância ${percentDifference > 0 ? "maior" : "menor"} que estimada`,
      threshold: 10,
      actual: percentDifference,
      percentDifference,
    };
  }

  return null;
}

/**
 * Calcula valor justo da corrida
 */
function calculateFairValue(distance: number, time: number, platformName: string): number {
  const tariff = PLATFORM_TARIFFS[platformName.toLowerCase()] || PLATFORM_TARIFFS.uber;

  const valueFromDistance = distance * tariff.kmRate;
  const valueFromTime = (time / 60) * tariff.minRate * 60; // converter para valor por hora

  const fairValue = valueFromDistance + valueFromTime;

  console.log(`   💰 Valor Justo: R$ ${fairValue.toFixed(2)}`);
  console.log(`      - Distância (${distance}km × R$ ${tariff.kmRate}): R$ ${valueFromDistance.toFixed(2)}`);
  console.log(`      - Tempo (${time}min × R$ ${tariff.minRate}/min): R$ ${valueFromTime.toFixed(2)}`);

  return fairValue;
}

/**
 * Valida valor da corrida
 */
function validateValue(realValue: number, fairValue: number): RideAlert | null {
  const percentDifference = ((realValue - fairValue) / fairValue) * 100;

  // Alerta se valor está 20% abaixo do justo
  if (percentDifference < -20) {
    return {
      type: "value",
      severity: "high",
      message: `❌ Valor ${Math.abs(percentDifference).toFixed(1)}% abaixo do justo`,
      threshold: -20,
      actual: percentDifference,
      percentDifference,
    };
  }

  return null;
}

/**
 * Detecta rota divergente
 */
function detectDivergeRoute(
  estimatedDistance: number,
  realDistance: number,
  realTime: number
): RideAlert | null {
  // Se distância aumentou muito mas tempo não aumentou proporcionalmente
  const distanceIncrease = ((realDistance - estimatedDistance) / estimatedDistance) * 100;
  const expectedTimeIncrease = distanceIncrease; // Tempo deve aumentar proporcionalmente

  // Velocidade média
  const averageSpeed = (realDistance / realTime) * 60; // km/h

  // Se velocidade média é muito baixa (< 20 km/h), pode indicar trânsito ou rota divergente
  if (averageSpeed < 20 && distanceIncrease > 15) {
    return {
      type: "route",
      severity: "medium",
      message: `⚠️ Possível rota divergente detectada (velocidade média: ${averageSpeed.toFixed(1)} km/h)`,
      threshold: 20,
      actual: averageSpeed,
      percentDifference: distanceIncrease,
    };
  }

  return null;
}

/**
 * Determina status da auditoria
 */
function determineStatus(alerts: RideAlert[], realValue: number, fairValue: number): "fair" | "suspicious" | "favorable" {
  // Se há alertas críticos
  if (alerts.some((a) => a.severity === "high")) {
    return "suspicious";
  }

  // Se valor é favorável ao motorista
  if (realValue > fairValue * 1.1) {
    return "favorable";
  }

  return "fair";
}

/**
 * Gera recomendação
 */
function generateRecommendation(alerts: RideAlert[], rideData: RideData, fairValue: number): string {
  if (alerts.length === 0) {
    return `✅ Corrida dentro do esperado. Ganho: R$ ${rideData.realValue.toFixed(2)}`;
  }

  const highSeverityAlerts = alerts.filter((a) => a.severity === "high");

  if (highSeverityAlerts.length > 0) {
    if (rideData.realValue < fairValue) {
      return `⚠️ Valor recebido está ${Math.abs(((rideData.realValue - fairValue) / fairValue) * 100).toFixed(1)}% abaixo do justo. Considere revisar com a plataforma.`;
    }

    const routeAlert = alerts.find((a) => a.type === "route");
    if (routeAlert) {
      return `⚠️ Rota divergente detectada. Verifique se a navegação foi seguida corretamente.`;
    }
  }

  return `📊 Corrida com algumas variações. Revise os detalhes.`;
}

/**
 * Log do resultado da auditoria
 */
function logAuditResult(audit: RideAudit): void {
  console.log(`\n📋 Resultado da Auditoria:`);
  console.log(`   Status: ${audit.status.toUpperCase()}`);
  console.log(`   Valor Recebido: R$ ${audit.realValue.toFixed(2)}`);
  console.log(`   Valor Justo: R$ ${audit.fairValue.toFixed(2)}`);
  console.log(`   Diferença: R$ ${audit.fairValueDifference.toFixed(2)} (${audit.fairValueDifference > 0 ? "+" : ""}${((audit.fairValueDifference / audit.fairValue) * 100).toFixed(1)}%)`);
  console.log(`   Ganho/km: R$ ${audit.earningsPerKm.toFixed(2)}`);
  console.log(`   Ganho/hora: R$ ${audit.earningsPerHour.toFixed(2)}`);

  if (audit.alerts.length > 0) {
    console.log(`   Alertas:`);
    audit.alerts.forEach((alert) => {
      console.log(`      - ${alert.message}`);
    });
  }

  console.log(`   Recomendação: ${audit.recommendation}\n`);
}

/**
 * Compara múltiplas corridas
 */
export function compareRides(audits: RideAudit[]): {
  averageEarningsPerKm: number;
  averageEarningsPerHour: number;
  bestRide: RideAudit;
  worstRide: RideAudit;
  suspiciousCount: number;
  fairCount: number;
  favorableCount: number;
} {
  const averageEarningsPerKm =
    audits.reduce((sum, a) => sum + a.earningsPerKm, 0) / audits.length;
  const averageEarningsPerHour =
    audits.reduce((sum, a) => sum + a.earningsPerHour, 0) / audits.length;

  const bestRide = audits.reduce((best, current) =>
    current.earningsPerHour > best.earningsPerHour ? current : best
  );

  const worstRide = audits.reduce((worst, current) =>
    current.earningsPerHour < worst.earningsPerHour ? current : worst
  );

  const suspiciousCount = audits.filter((a) => a.status === "suspicious").length;
  const fairCount = audits.filter((a) => a.status === "fair").length;
  const favorableCount = audits.filter((a) => a.status === "favorable").length;

  return {
    averageEarningsPerKm,
    averageEarningsPerHour,
    bestRide,
    worstRide,
    suspiciousCount,
    fairCount,
    favorableCount,
  };
}

/**
 * Gera relatório de auditoria
 */
export function generateAuditReport(audits: RideAudit[]): string {
  const comparison = compareRides(audits);

  let report = `\n📊 RELATÓRIO DE AUDITORIA DE CORRIDAS\n`;
  report += `${"=".repeat(50)}\n`;
  report += `Total de Corridas: ${audits.length}\n`;
  report += `Ganho Médio/km: R$ ${comparison.averageEarningsPerKm.toFixed(2)}\n`;
  report += `Ganho Médio/hora: R$ ${comparison.averageEarningsPerHour.toFixed(2)}\n`;
  report += `\nStatus das Corridas:\n`;
  report += `   ✅ Justas: ${comparison.fairCount}\n`;
  report += `   ⚠️  Suspeitas: ${comparison.suspiciousCount}\n`;
  report += `   🎉 Favoráveis: ${comparison.favorableCount}\n`;
  report += `\nMelhor Corrida: ${comparison.bestRide.rideId} (R$ ${comparison.bestRide.earningsPerHour.toFixed(2)}/h)\n`;
  report += `Pior Corrida: ${comparison.worstRide.rideId} (R$ ${comparison.worstRide.earningsPerHour.toFixed(2)}/h)\n`;
  report += `${"=".repeat(50)}\n`;

  return report;
}
