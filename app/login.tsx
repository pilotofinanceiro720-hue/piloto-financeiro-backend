import { useEffect, useState } from "react";
import { View, Text, Pressable, ActivityIndicator, Alert, Platform } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import { useAuth } from "@/lib/contexts/auth-context";
import { ScreenContainer } from "@/components/screen-container";
import { getApiBaseUrl } from "@/constants/oauth";

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const router = useRouter();
  const { user, isLoading, setUser } = useAuth();
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (user && !isLoading) {
      console.log("[Login] User already authenticated, redirecting to dashboard");
      router.replace("/(tabs)");
    }
  }, [user, isLoading, router]);

  const handleGoogleLogin = async () => {
    try {
      setIsAuthLoading(true);
      console.log("[Login] Starting Google OAuth...");

      // Get API base URL (dev: 3000-sandboxid.region.domain, prod: https://api.pilotofinanceiro.com.br)
      const apiUrl = getApiBaseUrl() || "https://api.pilotofinanceiro.com.br";
      
      // Determine if running on mobile or web
      const isMobile = Platform.OS !== "web";
      console.log("[Login] Platform:", Platform.OS, "isMobile:", isMobile);
      
      // Use mobile endpoint for native platforms, web endpoint for web
      const googleUrlEndpoint = isMobile
        ? `${apiUrl}/api/auth/google/url/mobile`
        : `${apiUrl}/api/auth/google/url`;
      
      console.log("[Login] API Base URL:", apiUrl);
      console.log("[Login] Calling endpoint:", googleUrlEndpoint);

      const response = await fetch(googleUrlEndpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("[Login] Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("[Login] Error response:", errorText);
        throw new Error(`Failed to get OAuth URL: ${response.status} ${errorText}`);
      }

      const { url, redirectUri } = await response.json();
      console.log("[Login] OAuth URL received:", url);
      console.log("[Login] Redirect URI:", redirectUri);
      
      // Extract and log Client ID from OAuth URL for validation
      const urlObj = new URL(url);
      const clientIdInUrl = urlObj.searchParams.get("client_id");
      console.log("[Login] 🔍 CLIENT ID IN OAUTH URL:", clientIdInUrl);
      console.log("[Login] 🔍 REDIRECT URI MOBILE:", redirectUri);
      console.log("[Login] 🔍 ENDPOINT CALLED:", googleUrlEndpoint);
      console.log("[Login] 🔍 PLATFORM:", Platform.OS);
      console.log("[Login] 🔍 OAUTH CONFIG VALIDATION:", {
        clientIdPresent: !!clientIdInUrl,
        redirectUriPresent: !!redirectUri,
        isMobileApp: isMobile,
        endpointCorrect: isMobile ? googleUrlEndpoint.includes("/mobile") : !googleUrlEndpoint.includes("/mobile")
      });

      // For mobile, use the dynamic redirect URI from backend
      // For web, use the standard web callback
      const callbackScheme = isMobile && redirectUri ? redirectUri : "manus://oauth/callback";
      console.log("[Login] Callback scheme:", callbackScheme);
      console.log("[Login] ✅ OAUTH CONFIG READY FOR LOGIN", {
        platform: Platform.OS,
        clientId: clientIdInUrl,
        redirectUri: callbackScheme,
        endpoint: googleUrlEndpoint
      });

      // Open the OAuth URL in web browser
      console.log("[Login] Opening OAuth URL in browser...");
      const result = await WebBrowser.openAuthSessionAsync(url, callbackScheme);

      if (result.type === "success") {
        console.log("[Login] OAuth success, result URL:", result.url);
        console.log("[Login] ✅ DEEP LINK CALLBACK RECEIVED");
        
        if (isMobile) {
          // For mobile: extract code and state from deep link, exchange via /api/oauth/mobile
          try {
            const callbackUrlObj = new URL(result.url);
            const code = callbackUrlObj.searchParams.get("code");
            console.log("[Login] 🔍 CALLBACK PARAMS:", {
              code: code ? code.substring(0, 20) + "..." : "MISSING",
              state: callbackUrlObj.searchParams.get("state") ? "PRESENT" : "MISSING"
            });
            const state = urlObj.searchParams.get("state");
            
            console.log("[Login] Extracted code:", code?.substring(0, 20) + "...");
            console.log("[Login] Extracted state:", state?.substring(0, 20) + "...");
            
            if (!code || !state) {
              throw new Error("Missing code or state in callback");
            }
            
            // Exchange code for token via mobile endpoint
            const mobileExchangeEndpoint = `${apiUrl}/api/oauth/mobile?code=${encodeURIComponent(code)}&state=${encodeURIComponent(state)}`;
            console.log("[Login] Exchanging code at:", mobileExchangeEndpoint);
            
            const mobileResponse = await fetch(mobileExchangeEndpoint, {
              method: "GET",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
            });
            
            if (!mobileResponse.ok) {
              const errorText = await mobileResponse.text();
              console.error("[Login] Mobile exchange error:", errorText);
              throw new Error(`Mobile exchange failed: ${mobileResponse.status}`);
            }
            
            const { app_session_id, user: userData } = await mobileResponse.json();
            console.log("[Login] Mobile exchange successful, user:", userData?.email);
            
            // Store session token and user data
            if (app_session_id) {
              await Linking.setInitialNotification?.();
              setUser(userData);
              router.replace("/(tabs)");
            } else {
              throw new Error("No session token returned");
            }
          } catch (exchangeError) {
            console.error("[Login] Code exchange error:", exchangeError);
            throw exchangeError;
          }
        } else {
          // For web: fetch user data via /api/auth/me (cookie-based)
          console.log("[Login] Web platform - fetching user data via /api/auth/me...");
          const meEndpoint = `${apiUrl}/api/auth/me`;
          console.log("[Login] Fetching user data from:", meEndpoint);
          const meResponse = await fetch(meEndpoint, {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (meResponse.ok) {
            const userData = await meResponse.json();
            console.log("[Login] User authenticated:", userData.email);
            setUser(userData);
            router.replace("/(tabs)");
          } else {
            throw new Error("Failed to fetch user data");
          }
        }
      } else if (result.type === "cancel") {
        console.log("[Login] OAuth cancelled by user");
        Alert.alert("Cancelled", "Login was cancelled");
      } else if (result.type === "dismiss") {
        console.log("[Login] OAuth dismissed");
        Alert.alert("Dismissed", "Login was dismissed");
      }
    } catch (error) {
      console.error("[Login] OAuth error:", error);
      console.error("[Login] Full error object:", JSON.stringify(error, null, 2));
      Alert.alert("Login Error", error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsAuthLoading(false);
    }
  };

  if (isLoading) {
    return (
      <ScreenContainer className="items-center justify-center">
        <ActivityIndicator size="large" color="#0a7ea4" />
        <Text className="mt-4 text-foreground">Checking session...</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="justify-center px-6">
      <View className="gap-8">
        {/* Header */}
        <View className="gap-4">
          <Text className="text-4xl font-bold text-foreground text-center">Rota do Lucro</Text>
          <Text className="text-base text-muted text-center">
            Inteligência financeira para motoristas
          </Text>
        </View>

        {/* Features */}
        <View className="gap-3 bg-surface rounded-2xl p-6">
          <View className="flex-row gap-3">
            <Text className="text-2xl">💰</Text>
            <View className="flex-1">
              <Text className="font-semibold text-foreground">Lucro Real</Text>
              <Text className="text-sm text-muted">Calcule seu lucro por corrida</Text>
            </View>
          </View>
          <View className="flex-row gap-3">
            <Text className="text-2xl">📊</Text>
            <View className="flex-1">
              <Text className="font-semibold text-foreground">Dashboard</Text>
              <Text className="text-sm text-muted">Acompanhe seu desempenho</Text>
            </View>
          </View>
          <View className="flex-row gap-3">
            <Text className="text-2xl">🎯</Text>
            <View className="flex-1">
              <Text className="font-semibold text-foreground">Oportunidades</Text>
              <Text className="text-sm text-muted">Encontre as melhores corridas</Text>
            </View>
          </View>
        </View>

        {/* Login Button */}
        <Pressable
          onPress={handleGoogleLogin}
          disabled={isAuthLoading}
          style={({ pressed }) => [
            {
              opacity: pressed ? 0.8 : 1,
              transform: [{ scale: pressed ? 0.97 : 1 }],
            },
          ]}
          className="bg-primary rounded-full py-4 flex-row items-center justify-center gap-3"
        >
          {isAuthLoading ? (
            <>
              <ActivityIndicator size="small" color="#ffffff" />
              <Text className="text-white font-semibold">Entrando...</Text>
            </>
          ) : (
            <>
              <Text className="text-2xl">🔐</Text>
              <Text className="text-white font-semibold">Entrar com Google</Text>
            </>
          )}
        </Pressable>

        {/* Footer */}
        <Text className="text-xs text-muted text-center">
          Ao entrar, você concorda com nossos Termos de Serviço
        </Text>
      </View>
    </ScreenContainer>
  );
}
