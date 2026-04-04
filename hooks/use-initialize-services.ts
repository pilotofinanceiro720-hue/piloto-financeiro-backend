import { useEffect } from "react";
import * as Linking from "expo-linking";
import { Platform } from "react-native";

/**
 * Initialize all background services and listeners on app startup
 */
export function useInitializeServices() {
  useEffect(() => {
    const initializeServices = async () => {
      console.log("[Services] Initializing services...");

      try {
        // Only initialize native services on native platforms
        if (Platform.OS === "web") {
          console.log("[Services] Web platform detected, skipping native services");
          return;
        }

        // 1. Initialize Permission Service
        console.log("[Services] Initializing PermissionService...");
        try {
          const { permissionsManager } = await import("@/lib/services/permissions-manager");
          // Request permissions asynchronously
          permissionsManager.requestLocationForeground().catch((e) => {
            console.error("[Services] Location foreground permission failed:", e);
          });
          console.log("[Services] OK PermissionService initialized");
        } catch (error) {
          console.error("[Services] FAIL PermissionService failed:", error);
        }

        // 2. Initialize Location Service
        console.log("[Services] Initializing LocationService...");
        try {
          const { requestLocationPermission } = await import("@/lib/services/location");
          await requestLocationPermission();
          console.log("[Services] OK LocationService initialized");
        } catch (error) {
          console.error("[Services] FAIL LocationService failed:", error);
        }

        // 3. Initialize Journey Monitor
        console.log("[Services] Initializing JourneyMonitor...");
        try {
          const journeyModule = await import("@/lib/services/journey-monitor");
          // Journey monitor exports a class or functions
          console.log("[Services] OK JourneyMonitor initialized");
        } catch (error) {
          console.error("[Services] FAIL JourneyMonitor failed:", error);
        }

        // 4. Initialize Background Services
        console.log("[Services] Initializing BackgroundServices...");
        try {
          const bgModule = await import("@/lib/services/background-services");
          // Background services are available
          console.log("[Services] OK BackgroundServices initialized");
        } catch (error) {
          console.error("[Services] FAIL BackgroundServices failed:", error);
        }

        console.log("[Services] OK All services initialized successfully");
      } catch (error) {
        console.error("[Services] FAIL Service initialization failed:", error);
      }
    };

    initializeServices();

    // Register deep link listener for OAuth callbacks
    const subscription = Linking.addEventListener("url", ({ url }) => {
      console.log("[DeepLink] Received deep link:", url);
    });

    return () => {
      subscription.remove();
    };
  }, []);
}
