/**
 * Serviço de Localização e Mapas
 * Integração com Expo Location e Maps
 */

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
  accuracy?: number;
  altitude?: number;
  heading?: number;
  speed?: number;
}

export interface DemandArea {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  demandLevel: "low" | "medium" | "high";
  eventType?: string;
  description?: string;
  distance?: number; // em km
}

export interface FuelStation {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  address?: string;
  fuelPrice?: number;
  hasElectricCharging: boolean;
  distance?: number; // em km
}

/**
 * Solicita permissão de localização
 */
export async function requestLocationPermission(): Promise<boolean> {
  try {
    // TODO: Integrar com expo-location
    console.log("Solicitando permissão de localização...");
    return true;
  } catch (error) {
    console.error("Erro ao solicitar permissão de localização:", error);
    return false;
  }
}

/**
 * Obtém localização atual do usuário
 */
export async function getCurrentLocation(): Promise<LocationCoordinates | null> {
  try {
    // TODO: Integrar com expo-location
    // Por enquanto, retorna localização mock (São Paulo)
    return {
      latitude: -23.5505,
      longitude: -46.6333,
      accuracy: 10,
    };
  } catch (error) {
    console.error("Erro ao obter localização:", error);
    return null;
  }
}

/**
 * Monitora localização em tempo real
 */
export function watchLocation(
  callback: (location: LocationCoordinates) => void,
  onError?: (error: Error) => void
): () => void {
  try {
    // TODO: Integrar com expo-location
    console.log("Monitorando localização...");
    
    // Retornar função para parar de monitorar
    return () => {
      console.log("Parando monitoramento de localização");
    };
  } catch (error) {
    onError?.(error as Error);
    return () => {};
  }
}

/**
 * Calcula distância entre dois pontos (em km)
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Raio da Terra em km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Busca áreas de demanda próximas
 */
export async function findNearbyDemandAreas(
  location: LocationCoordinates,
  radiusKm: number = 5
): Promise<DemandArea[]> {
  try {
    // TODO: Buscar do banco de dados
    // Por enquanto, retorna dados mock
    const mockAreas: DemandArea[] = [
      {
        id: 1,
        name: "Centro - Pico de Demanda",
        latitude: location.latitude + 0.01,
        longitude: location.longitude + 0.01,
        demandLevel: "high",
        eventType: "Rush Hour",
        description: "Alta demanda no centro da cidade",
      },
      {
        id: 2,
        name: "Aeroporto",
        latitude: location.latitude - 0.02,
        longitude: location.longitude - 0.02,
        demandLevel: "medium",
        eventType: "Aeroporto",
        description: "Demanda constante de passageiros",
      },
      {
        id: 3,
        name: "Estação de Trem",
        latitude: location.latitude + 0.015,
        longitude: location.longitude - 0.015,
        demandLevel: "medium",
        eventType: "Transporte Público",
        description: "Demanda em horários de pico",
      },
    ];

    // Calcular distância e filtrar
    return mockAreas
      .map((area) => ({
        ...area,
        distance: calculateDistance(
          location.latitude,
          location.longitude,
          area.latitude,
          area.longitude
        ),
      }))
      .filter((area) => area.distance! <= radiusKm)
      .sort((a, b) => (a.distance || 0) - (b.distance || 0));
  } catch (error) {
    console.error("Erro ao buscar áreas de demanda:", error);
    return [];
  }
}

/**
 * Busca postos de combustível próximos
 */
export async function findNearbyFuelStations(
  location: LocationCoordinates,
  radiusKm: number = 10
): Promise<FuelStation[]> {
  try {
    // TODO: Buscar do banco de dados
    // Por enquanto, retorna dados mock
    const mockStations: FuelStation[] = [
      {
        id: 1,
        name: "Posto Shell",
        latitude: location.latitude + 0.005,
        longitude: location.longitude + 0.005,
        address: "Av. Principal, 123",
        fuelPrice: 5.89,
        hasElectricCharging: true,
      },
      {
        id: 2,
        name: "Posto Ipiranga",
        latitude: location.latitude - 0.008,
        longitude: location.longitude - 0.008,
        address: "Rua Secundária, 456",
        fuelPrice: 5.79,
        hasElectricCharging: false,
      },
      {
        id: 3,
        name: "Posto BR",
        latitude: location.latitude + 0.012,
        longitude: location.longitude - 0.01,
        address: "Estrada, 789",
        fuelPrice: 5.99,
        hasElectricCharging: true,
      },
    ];

    // Calcular distância e filtrar
    return mockStations
      .map((station) => ({
        ...station,
        distance: calculateDistance(
          location.latitude,
          location.longitude,
          station.latitude,
          station.longitude
        ),
      }))
      .filter((station) => station.distance! <= radiusKm)
      .sort((a, b) => (a.fuelPrice || 0) - (b.fuelPrice || 0));
  } catch (error) {
    console.error("Erro ao buscar postos de combustível:", error);
    return [];
  }
}

/**
 * Calcula rota otimizada entre pontos
 */
export function calculateOptimalRoute(
  startLocation: LocationCoordinates,
  endLocations: LocationCoordinates[]
): LocationCoordinates[] {
  // Algoritmo simples de rota (nearest neighbor)
  const route: LocationCoordinates[] = [startLocation];
  const remaining = [...endLocations];

  while (remaining.length > 0) {
    const current = route[route.length - 1];
    let nearest = remaining[0];
    let minDistance = calculateDistance(
      current.latitude,
      current.longitude,
      nearest.latitude,
      nearest.longitude
    );

    for (let i = 1; i < remaining.length; i++) {
      const distance = calculateDistance(
        current.latitude,
        current.longitude,
        remaining[i].latitude,
        remaining[i].longitude
      );
      if (distance < minDistance) {
        nearest = remaining[i];
        minDistance = distance;
      }
    }

    route.push(nearest);
    remaining.splice(remaining.indexOf(nearest), 1);
  }

  return route;
}

/**
 * Estima tempo de viagem entre dois pontos
 */
export function estimateTravelTime(
  startLocation: LocationCoordinates,
  endLocation: LocationCoordinates,
  averageSpeedKmh: number = 40
): number {
  const distance = calculateDistance(
    startLocation.latitude,
    startLocation.longitude,
    endLocation.latitude,
    endLocation.longitude
  );
  return Math.round((distance / averageSpeedKmh) * 60); // retorna em minutos
}

/**
 * Geocodifica endereço para coordenadas
 */
export async function geocodeAddress(address: string): Promise<LocationCoordinates | null> {
  try {
    // TODO: Integrar com expo-location
    console.log("Geocodificando endereço:", address);
    return null;
  } catch (error) {
    console.error("Erro ao geocodificar endereço:", error);
    return null;
  }
}

/**
 * Reverse geocodifica coordenadas para endereço
 */
export async function reverseGeocodeLocation(
  location: LocationCoordinates
): Promise<string | null> {
  try {
    // TODO: Integrar com expo-location
    console.log("Reverse geocodificando localização:", location);
    return null;
  } catch (error) {
    console.error("Erro ao fazer reverse geocoding:", error);
    return null;
  }
}
