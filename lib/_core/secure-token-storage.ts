import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

/**
 * Secure Token Storage
 * Stores access and refresh tokens in platform-specific secure storage
 * - iOS: Keychain
 * - Android: Keystore
 * - Web: localStorage (with warning - not truly secure)
 */

const ACCESS_TOKEN_KEY = "app_access_token";
const REFRESH_TOKEN_KEY = "app_refresh_token";

export class SecureTokenStorage {
  /**
   * Save access token securely
   */
  static async saveAccessToken(token: string): Promise<void> {
    try {
      if (Platform.OS === "web") {
        console.warn("[SecureStore] Web platform - using localStorage (not secure)");
        localStorage.setItem(ACCESS_TOKEN_KEY, token);
      } else {
        await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token);
      }
      console.log("[SecureStore] Access token saved securely");
    } catch (error) {
      console.error("[SecureStore] Failed to save access token:", error);
      throw error;
    }
  }

  /**
   * Get access token from secure storage
   */
  static async getAccessToken(): Promise<string | null> {
    try {
      if (Platform.OS === "web") {
        return localStorage.getItem(ACCESS_TOKEN_KEY);
      } else {
        return await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
      }
    } catch (error) {
      console.error("[SecureStore] Failed to get access token:", error);
      return null;
    }
  }

  /**
   * Save refresh token securely
   */
  static async saveRefreshToken(token: string): Promise<void> {
    try {
      if (Platform.OS === "web") {
        console.warn("[SecureStore] Web platform - using localStorage (not secure)");
        localStorage.setItem(REFRESH_TOKEN_KEY, token);
      } else {
        await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
      }
      console.log("[SecureStore] Refresh token saved securely");
    } catch (error) {
      console.error("[SecureStore] Failed to save refresh token:", error);
      throw error;
    }
  }

  /**
   * Get refresh token from secure storage
   */
  static async getRefreshToken(): Promise<string | null> {
    try {
      if (Platform.OS === "web") {
        return localStorage.getItem(REFRESH_TOKEN_KEY);
      } else {
        return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
      }
    } catch (error) {
      console.error("[SecureStore] Failed to get refresh token:", error);
      return null;
    }
  }

  /**
   * Clear all tokens from secure storage
   */
  static async clearTokens(): Promise<void> {
    try {
      if (Platform.OS === "web") {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
      } else {
        await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
        await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
      }
      console.log("[SecureStore] All tokens cleared");
    } catch (error) {
      console.error("[SecureStore] Failed to clear tokens:", error);
      throw error;
    }
  }

  /**
   * Check if tokens exist
   */
  static async hasTokens(): Promise<boolean> {
    try {
      const accessToken = await this.getAccessToken();
      const refreshToken = await this.getRefreshToken();
      return !!(accessToken && refreshToken);
    } catch (error) {
      console.error("[SecureStore] Failed to check tokens:", error);
      return false;
    }
  }
}
