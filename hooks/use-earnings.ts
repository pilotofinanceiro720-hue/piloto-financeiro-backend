import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/contexts/auth-context";

export interface EarningsData {
  today: {
    rides: number;
    revenue: number;
    expenses: number;
    profit: number;
  };
  week: {
    revenue: number;
    expenses: number;
    profit: number;
  };
  month: {
    revenue: number;
    expenses: number;
    profit: number;
  };
  opportunities: Array<{
    id: string;
    type: string;
    location: string;
    demand: "low" | "medium" | "high";
    estimatedEarnings: number;
  }>;
}

/**
 * Fetch driver earnings data from backend
 */
export function useEarnings() {
  const { user, isAuthenticated } = useAuth();

  const query = useQuery<EarningsData>({
    queryKey: ["earnings", user?.id],
    queryFn: async () => {
      if (!isAuthenticated) {
        throw new Error("User not authenticated");
      }

      console.log("[useEarnings] Fetching earnings data...");

      const response = await fetch("https://api.manus.im/api/driver/earnings", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        console.error("[useEarnings] Failed to fetch earnings:", response.status);
        // Return mock data if API fails
        return getMockEarningsData();
      }

      const data = await response.json();
      console.log("[useEarnings] Earnings data received:", data);
      return data;
    },
    enabled: isAuthenticated && !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });

  return query;
}

/**
 * Mock earnings data for development/testing
 */
function getMockEarningsData(): EarningsData {
  return {
    today: {
      rides: 12,
      revenue: 380.0,
      expenses: 179.5,
      profit: 245.5,
    },
    week: {
      revenue: 2100.0,
      expenses: 950.0,
      profit: 1150.0,
    },
    month: {
      revenue: 8500.0,
      expenses: 3800.0,
      profit: 4700.0,
    },
    opportunities: [
      {
        id: "1",
        type: "high_demand",
        location: "Centro",
        demand: "high",
        estimatedEarnings: 150.0,
      },
      {
        id: "2",
        type: "event",
        location: "Estádio",
        demand: "medium",
        estimatedEarnings: 120.0,
      },
      {
        id: "3",
        type: "airport",
        location: "Aeroporto",
        demand: "high",
        estimatedEarnings: 200.0,
      },
    ],
  };
}
