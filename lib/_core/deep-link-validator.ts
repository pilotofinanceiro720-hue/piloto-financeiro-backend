import * as Linking from "expo-linking";

/**
 * Deep Link Validator
 * Ensures OAuth callback only works for registered scheme
 * Rejects unknown origins and validates state
 */

// Registered scheme from app.config.ts
// Format: manus{timestamp} e.g., manus20260215181436
const REGISTERED_SCHEME = Linking.createURL("/").split("://")[0];

// Allowed paths for OAuth callback
const ALLOWED_PATHS = ["/oauth/callback", "/auth/callback"];

export class DeepLinkValidator {
  /**
   * Validate deep link URL
   * Returns parsed URL if valid, null otherwise
   */
  static validateUrl(url: string): {
    scheme: string;
    path: string;
    params: Record<string, string>;
  } | null {
    try {
      const urlObj = new URL(url);

      console.log(`[DeepLink] Validating URL: ${url}`);
      console.log(`[DeepLink] Scheme: ${urlObj.protocol}`);
      console.log(`[DeepLink] Host: ${urlObj.host}`);
      console.log(`[DeepLink] Path: ${urlObj.pathname}`);

      // Extract scheme (remove trailing colon)
      const scheme = urlObj.protocol.replace(":", "");

      // Validate scheme matches registered scheme
      if (scheme !== REGISTERED_SCHEME) {
        console.error(
          `[DeepLink] Invalid scheme: ${scheme} (expected: ${REGISTERED_SCHEME})`,
        );
        return null;
      }

      // Validate path is in allowed list
      const path = urlObj.pathname;
      if (!ALLOWED_PATHS.includes(path)) {
        console.error(
          `[DeepLink] Invalid path: ${path} (allowed: ${ALLOWED_PATHS.join(", ")})`,
        );
        return null;
      }

      // Extract query parameters
      const params: Record<string, string> = {};
      urlObj.searchParams.forEach((value, key) => {
        params[key] = value;
      });

      console.log(`[DeepLink] Valid deep link, params:`, params);

      return {
        scheme,
        path,
        params,
      };
    } catch (error) {
      console.error(`[DeepLink] Failed to parse URL: ${url}`, error);
      return null;
    }
  }

  /**
   * Validate OAuth callback parameters
   */
  static validateOAuthCallback(params: Record<string, string>): {
    code: string;
    state: string;
  } | null {
    const { code, state, error, error_description } = params;

    // Check for OAuth error
    if (error) {
      console.error(
        `[DeepLink] OAuth error: ${error} - ${error_description || ""}`,
      );
      return null;
    }

    // Validate required parameters
    if (!code) {
      console.error("[DeepLink] Missing authorization code");
      return null;
    }

    if (!state) {
      console.error("[DeepLink] Missing state parameter (CSRF protection)");
      return null;
    }

    console.log("[DeepLink] Valid OAuth callback parameters");

    return {
      code,
      state,
    };
  }

  /**
   * Get registered scheme
   */
  static getRegisteredScheme(): string {
    return REGISTERED_SCHEME;
  }

  /**
   * Get allowed paths
   */
  static getAllowedPaths(): string[] {
    return ALLOWED_PATHS;
  }
}
