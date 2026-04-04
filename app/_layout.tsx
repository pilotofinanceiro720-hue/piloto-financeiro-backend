import "@/global.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useMemo, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { Platform } from "react-native";
import "@/lib/_core/nativewind-pressable";
import { ThemeProvider } from "@/lib/theme-provider";
import {
  SafeAreaFrameContext,
  SafeAreaInsetsContext,
  SafeAreaProvider,
  initialWindowMetrics,
} from "react-native-safe-area-context";
import type { EdgeInsets, Metrics, Rect } from "react-native-safe-area-context";

import { trpc, createTRPCClient } from "@/lib/trpc";
import { initManusRuntime, subscribeSafeAreaInsets } from "@/lib/_core/manus-runtime";
import { useInitializeServices } from "@/hooks/use-initialize-services";
import { AuthProvider, useAuth } from "@/lib/contexts/auth-context";
import { useRouter } from "expo-router";

const DEFAULT_WEB_INSETS: EdgeInsets = { top: 0, right: 0, bottom: 0, left: 0 };
const DEFAULT_WEB_FRAME: Rect = { x: 0, y: 0, width: 0, height: 0 };

export const unstable_settings = {
  anchor: "(tabs)",
};

// Create query client and TRPC client once
const queryClient = new QueryClient();
const trpcClient = createTRPCClient();

// Inner component that uses AuthContext
function RootLayoutInner() {
  const [insets, setInsets] = useState<EdgeInsets>(DEFAULT_WEB_INSETS);
  const [frame, setFrame] = useState<Rect>(DEFAULT_WEB_FRAME);

  // Initialize Manus runtime for cookie injection from parent container
  useEffect(() => {
    initManusRuntime();
  }, []);

  // Initialize all background services
  useInitializeServices();

  // Get auth context to check if user is authenticated
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      console.log("[RootLayout] No user authenticated, redirecting to login");
      router.replace("/login");
    }
  }, [user, authLoading, router]);

  const handleSafeAreaUpdate = useCallback((metrics: Metrics) => {
    setInsets(metrics.insets);
    setFrame(metrics.frame);
  }, []);

  useEffect(() => {
    return subscribeSafeAreaInsets(handleSafeAreaUpdate);
  }, [handleSafeAreaUpdate]);

  const safeAreaContextValue = useMemo(
    () => ({
      insets,
      frame,
    }),
    [insets, frame]
  );

  const content = (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="login" />
            <Stack.Screen name="oauth/callback" />
          </Stack>
          <StatusBar style="auto" />
        </QueryClientProvider>
      </trpc.Provider>
    </GestureHandlerRootView>
  );

  const shouldOverrideSafeArea = Platform.OS === "web";

  if (shouldOverrideSafeArea) {
    return (
      <ThemeProvider>
        <SafeAreaProvider initialMetrics={initialWindowMetrics}>
          <SafeAreaInsetsContext.Provider value={insets}>
            <SafeAreaFrameContext.Provider value={frame}>{content}</SafeAreaFrameContext.Provider>
          </SafeAreaInsetsContext.Provider>
        </SafeAreaProvider>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <SafeAreaInsetsContext.Provider value={insets}>
          <SafeAreaFrameContext.Provider value={frame}>{content}</SafeAreaFrameContext.Provider>
        </SafeAreaInsetsContext.Provider>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}

// Outer component that wraps with AuthProvider
export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutInner />
    </AuthProvider>
  );
}
