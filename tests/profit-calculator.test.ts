import { describe, it, expect } from "vitest";
import {
  calculateRideProfit,
  calculateDailySummary,
  calculateMonthlySummary,
  projectMonthlyProfit,
  type RideData,
  type VehicleData,
} from "../lib/services/profit-calculator";

describe("Profit Calculator", () => {
  const mockVehicle: VehicleData = {
    fuelConsumption: 10,
    maintenanceCostPerKm: 0.35,
    wearCoefficient: 1.0,
    fuelPrice: 5.89,
  };

  describe("calculateRideProfit", () => {
    it("should calculate profit correctly for a ride", () => {
      const ride: RideData = {
        distance: 10,
        duration: 30,
        grossRevenue: 40,
        tips: 5,
        tolls: 0,
      };

      const result = calculateRideProfit(ride, mockVehicle);

      expect(result.totalIncome).toBe(45);
      expect(result.fuelCost).toBeCloseTo(5.89, 1);
      expect(result.maintenanceCost).toBeCloseTo(3.5, 1);
      expect(result.totalExpenses).toBeCloseTo(9.39, 1);
      expect(result.netProfit).toBeGreaterThan(0);
    });

    it("should calculate revenue per km correctly", () => {
      const ride: RideData = {
        distance: 20,
        duration: 60,
        grossRevenue: 80,
        tips: 10,
        tolls: 0,
      };

      const result = calculateRideProfit(ride, mockVehicle);

      expect(result.revenuePerKm).toBe(4.5); // 90 / 20
    });

    it("should handle rides with tolls", () => {
      const ride: RideData = {
        distance: 15,
        duration: 45,
        grossRevenue: 60,
        tips: 5,
        tolls: 5,
      };

      const result = calculateRideProfit(ride, mockVehicle);

      expect(result.tollsCost).toBe(5);
      expect(result.totalExpenses).toBeGreaterThan(5);
    });

    it("should calculate profit margin correctly", () => {
      const ride: RideData = {
        distance: 10,
        duration: 30,
        grossRevenue: 50,
        tips: 0,
        tolls: 0,
      };

      const result = calculateRideProfit(ride, mockVehicle);

      expect(result.profitMargin).toBeGreaterThan(0);
      expect(result.profitMargin).toBeLessThan(100);
    });
  });

  describe("calculateDailySummary", () => {
    it("should calculate daily summary for multiple rides", () => {
      const rides: RideData[] = [
        {
          distance: 10,
          duration: 30,
          grossRevenue: 40,
          tips: 5,
          tolls: 0,
        },
        {
          distance: 15,
          duration: 45,
          grossRevenue: 60,
          tips: 10,
          tolls: 2,
        },
      ];

      const result = calculateDailySummary(rides, mockVehicle);

      expect(result.ridesCount).toBe(2);
      expect(result.totalDistance).toBe(25);
      expect(result.totalDuration).toBe(75);
      expect(result.totalIncome).toBeCloseTo(115, 0);
      expect(result.netProfit).toBeGreaterThan(0);
    });

    it("should calculate average metrics correctly", () => {
      const rides: RideData[] = [
        {
          distance: 10,
          duration: 30,
          grossRevenue: 40,
          tips: 5,
          tolls: 0,
        },
        {
          distance: 10,
          duration: 30,
          grossRevenue: 40,
          tips: 5,
          tolls: 0,
        },
      ];

      const result = calculateDailySummary(rides, mockVehicle);

      expect(result.averageRevenuePerKm).toBeGreaterThan(0);
      expect(result.averageCostPerKm).toBeGreaterThan(0);
    });

    it("should handle empty rides array", () => {
      const result = calculateDailySummary([], mockVehicle);

      expect(result.ridesCount).toBe(0);
      expect(result.totalDistance).toBe(0);
      expect(result.totalIncome).toBe(0);
      expect(result.netProfit).toBe(0);
    });
  });

  describe("calculateMonthlySummary", () => {
    it("should calculate monthly summary correctly", () => {
      const dailySummaries = [
        {
          ridesCount: 5,
          totalDistance: 50,
          totalDuration: 150,
          totalGrossRevenue: 200,
          totalTips: 25,
          totalIncome: 225,
          fuelCost: 50,
          maintenanceCost: 17.5,
          tollsCost: 5,
          totalExpenses: 72.5,
          netProfit: 152.5,
          profitMargin: 67.8,
          averageRevenuePerKm: 4.5,
          averageCostPerKm: 1.45,
          averageRevenuePerHour: 90,
          averageCostPerHour: 29,
        },
        {
          ridesCount: 6,
          totalDistance: 60,
          totalDuration: 180,
          totalGrossRevenue: 240,
          totalTips: 30,
          totalIncome: 270,
          fuelCost: 60,
          maintenanceCost: 21,
          tollsCost: 6,
          totalExpenses: 87,
          netProfit: 183,
          profitMargin: 67.8,
          averageRevenuePerKm: 4.5,
          averageCostPerKm: 1.45,
          averageRevenuePerHour: 90,
          averageCostPerHour: 29,
        },
      ];

      const result = calculateMonthlySummary(dailySummaries);

      expect(result.workingDays).toBe(2);
      expect(result.totalRides).toBe(11);
      expect(result.totalDistance).toBe(110);
      expect(result.totalIncome).toBe(495);
      expect(result.netProfit).toBe(335.5);
    });
  });

  describe("projectMonthlyProfit", () => {
    it("should project monthly profit correctly", () => {
      const dailySummary = {
        ridesCount: 5,
        totalDistance: 50,
        totalDuration: 150,
        totalGrossRevenue: 200,
        totalTips: 25,
        totalIncome: 225,
        fuelCost: 50,
        maintenanceCost: 17.5,
        tollsCost: 5,
        totalExpenses: 72.5,
        netProfit: 152.5,
        profitMargin: 67.8,
        averageRevenuePerKm: 4.5,
        averageCostPerKm: 1.45,
        averageRevenuePerHour: 90,
        averageCostPerHour: 29,
      };

      const result = projectMonthlyProfit(dailySummary, 5, 30);

      expect(result.projectedDays).toBe(25);
      expect(result.projectedIncome).toBeGreaterThan(0);
      expect(result.projectedExpenses).toBeGreaterThan(0);
      expect(result.projectedNetProfit).toBeGreaterThan(0);
    });

    it("should calculate projected monthly profit for full month", () => {
      const dailySummary = {
        ridesCount: 5,
        totalDistance: 50,
        totalDuration: 150,
        totalGrossRevenue: 200,
        totalTips: 25,
        totalIncome: 225,
        fuelCost: 50,
        maintenanceCost: 17.5,
        tollsCost: 5,
        totalExpenses: 72.5,
        netProfit: 152.5,
        profitMargin: 67.8,
        averageRevenuePerKm: 4.5,
        averageCostPerKm: 1.45,
        averageRevenuePerHour: 90,
        averageCostPerHour: 29,
      };

      const result = projectMonthlyProfit(dailySummary, 1, 30);

      expect(result.projectedMonthlyProfit).toBeCloseTo(152.5 * 30, 0);
    });
  });
});
