import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getMe } from "@/lib/_core/api";

interface User {
  id: number;
  openId: string;
  name: string | null;
  email: string | null;
  loginMethod: string | null;
  lastSignedIn: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
  refreshSession: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log("[Auth] Initializing authentication...");

        // Try to get user from API
        const currentUser = await getMe();
        if (currentUser) {
          console.log("[Auth] ✅ User authenticated:", currentUser.email);
          setUser(currentUser);
          await AsyncStorage.setItem("@auth_user", JSON.stringify(currentUser));
        } else {
          console.log("[Auth] ⚠️ No authenticated user");
          // Try to restore from AsyncStorage
          const savedUser = await AsyncStorage.getItem("@auth_user");
          if (savedUser) {
            setUser(JSON.parse(savedUser));
            console.log("[Auth] ✅ User restored from storage");
          }
        }
      } catch (error) {
        console.error("[Auth] Error initializing auth:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const handleLogout = async () => {
    try {
      console.log("[Auth] Logging out...");
      await fetch("https://api.manus.im/api/auth/logout", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      setUser(null);
      await AsyncStorage.removeItem("@auth_user");
      console.log("[Auth] Logged out successfully");
    } catch (error) {
      console.error("[Auth] Logout error:", error);
    }
  };

  const handleRefreshSession = async (): Promise<boolean> => {
    try {
      console.log("[Auth] Refreshing session...");
      const currentUser = await getMe();
      if (currentUser) {
        console.log("[Auth] ✅ Session refreshed, user:", currentUser.email);
        setUser(currentUser);
        await AsyncStorage.setItem("@auth_user", JSON.stringify(currentUser));
        return true;
      } else {
        console.warn("[Auth] ⚠️ Session refresh failed - user not found");
        return false;
      }
    } catch (error) {
      console.error("[Auth] Session refresh error:", error);
      return false;
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    setUser: (newUser) => {
      setUser(newUser);
      if (newUser) {
        AsyncStorage.setItem("@auth_user", JSON.stringify(newUser)).catch((error) => {
          console.error("[Auth] Error saving user to storage:", error);
        });
      } else {
        AsyncStorage.removeItem("@auth_user").catch((error) => {
          console.error("[Auth] Error removing user from storage:", error);
        });
      }
    },
    logout: handleLogout,
    refreshSession: handleRefreshSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
