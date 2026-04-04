/**
 * Serviço de cálculo de lucro real para motoristas
 * Leva em conta: combustível, manutenção, pedágios, desgaste
 */

export interface RideData {
  distance: number; // km
  duration: number; // minutos
  grossRevenue: number; // R$ bruto
  tips: number; // R$ gorjetas
  tolls: number; // R$ pedágios
}

export interface VehicleData {
  fuelConsumption: number; // km/l
  maintenanceCostPerKm: number; // R$ por km
  wearCoefficient: number; // coeficiente de desgaste (0.5-1.5)
  fuelPrice: number; // R$ por litro
}

export interface ProfitCalculation {
  grossRevenue: number;
  tips: number;
  totalIncome: number;
  fuelCost: number;
  maintenanceCost: number;
  tollsCost: number;
  totalExpenses: number;
  netProfit: number;
  profitMargin: number; // percentual
  costPerKm: number;
  costPerHour: number;
  revenuePerKm: number;
  revenuePerHour: number;
}

export function calculateRideProfit(
  ride: RideData,
  vehicle: VehicleData
): ProfitCalculation {
  // Receita total
  const totalIncome = ride.grossRevenue + ride.tips;

  // Custo de combustível
  const fuelNeeded = ride.distance / vehicle.fuelConsumption;
  const fuelCost = fuelNeeded * vehicle.fuelPrice;

  // Custo de manutenção (incluindo desgaste)
  const maintenanceCost = ride.distance * vehicle.maintenanceCostPerKm * vehicle.wearCoefficient;

  // Custos totais
  const totalExpenses = fuelCost + maintenanceCost + ride.tolls;

  // Lucro líquido
  const netProfit = totalIncome - totalExpenses;

  // Margem de lucro
  const profitMargin = totalIncome > 0 ? (netProfit / totalIncome) * 100 : 0;

  // Custos por km e hora
  const costPerKm = ride.distance > 0 ? totalExpenses / ride.distance : 0;
  const costPerHour = ride.duration > 0 ? totalExpenses / (ride.duration / 60) : 0;

  // Receita por km e hora
  const revenuePerKm = ride.distance > 0 ? totalIncome / ride.distance : 0;
  const revenuePerHour = ride.duration > 0 ? totalIncome / (ride.duration / 60) : 0;

  return {
    grossRevenue: ride.grossRevenue,
    tips: ride.tips,
    totalIncome,
    fuelCost,
    maintenanceCost,
    tollsCost: ride.tolls,
    totalExpenses,
    netProfit,
    profitMargin,
    costPerKm,
    costPerHour,
    revenuePerKm,
    revenuePerHour,
  };
}

export function calculateDailySummary(rides: RideData[], vehicle: VehicleData) {
  let totalDistance = 0;
  let totalDuration = 0;
  let totalGrossRevenue = 0;
  let totalTips = 0;
  let totalTolls = 0;
  let totalFuelCost = 0;
  let totalMaintenanceCost = 0;

  rides.forEach((ride) => {
    const profit = calculateRideProfit(ride, vehicle);
    totalDistance += ride.distance;
    totalDuration += ride.duration;
    totalGrossRevenue += ride.grossRevenue;
    totalTips += ride.tips;
    totalTolls += ride.tolls;
    totalFuelCost += profit.fuelCost;
    totalMaintenanceCost += profit.maintenanceCost;
  });

  const totalIncome = totalGrossRevenue + totalTips;
  const totalExpenses = totalFuelCost + totalMaintenanceCost + totalTolls;
  const netProfit = totalIncome - totalExpenses;
  const profitMargin = totalIncome > 0 ? (netProfit / totalIncome) * 100 : 0;

  return {
    ridesCount: rides.length,
    totalDistance,
    totalDuration,
    totalGrossRevenue,
    totalTips,
    totalIncome,
    fuelCost: totalFuelCost,
    maintenanceCost: totalMaintenanceCost,
    tollsCost: totalTolls,
    totalExpenses,
    netProfit,
    profitMargin,
    averageRevenuePerKm: totalDistance > 0 ? totalIncome / totalDistance : 0,
    averageCostPerKm: totalDistance > 0 ? totalExpenses / totalDistance : 0,
    averageRevenuePerHour: totalDuration > 0 ? totalIncome / (totalDuration / 60) : 0,
    averageCostPerHour: totalDuration > 0 ? totalExpenses / (totalDuration / 60) : 0,
  };
}

export function calculateMonthlySummary(
  dailySummaries: ReturnType<typeof calculateDailySummary>[]
) {
  let totalDistance = 0;
  let totalDuration = 0;
  let totalIncome = 0;
  let totalExpenses = 0;
  let totalRides = 0;

  dailySummaries.forEach((day) => {
    totalDistance += day.totalDistance;
    totalDuration += day.totalDuration;
    totalIncome += day.totalIncome;
    totalExpenses += day.totalExpenses;
    totalRides += day.ridesCount;
  });

  const netProfit = totalIncome - totalExpenses;
  const profitMargin = totalIncome > 0 ? (netProfit / totalIncome) * 100 : 0;
  const workingDays = dailySummaries.length;
  const averageDailyProfit = workingDays > 0 ? netProfit / workingDays : 0;

  return {
    workingDays,
    totalRides,
    totalDistance,
    totalDuration,
    totalIncome,
    totalExpenses,
    netProfit,
    profitMargin,
    averageDailyProfit,
    averageRevenuePerKm: totalDistance > 0 ? totalIncome / totalDistance : 0,
    averageCostPerKm: totalDistance > 0 ? totalExpenses / totalDistance : 0,
    averageRevenuePerHour: totalDuration > 0 ? totalIncome / (totalDuration / 60) : 0,
    averageCostPerHour: totalDuration > 0 ? totalExpenses / (totalDuration / 60) : 0,
  };
}

export function projectMonthlyProfit(
  currentDailySummary: ReturnType<typeof calculateDailySummary>,
  daysWorkedSoFar: number,
  totalDaysInMonth: number = 30
) {
  const projectedDays = totalDaysInMonth - daysWorkedSoFar;
  const projectedIncome = currentDailySummary.totalIncome * projectedDays;
  const projectedExpenses = currentDailySummary.totalExpenses * projectedDays;
  const projectedNetProfit = projectedIncome - projectedExpenses;

  return {
    projectedDays,
    projectedIncome,
    projectedExpenses,
    projectedNetProfit,
    projectedMonthlyProfit: (currentDailySummary.netProfit * totalDaysInMonth),
  };
}
