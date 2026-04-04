import crypto from "crypto";

/**
 * PKCE Service (Proof Key for Public Clients)
 * Implements RFC 7636 for secure OAuth flows on public clients (mobile apps)
 * Prevents authorization code interception attacks
 */

export class PKCEService {
  /**
   * Generate code verifier (43-128 characters, unreserved characters)
   * Used by client to create code challenge
   */
  static generateCodeVerifier(): string {
    const length = 128; // Maximum length for better security
    const charset =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
    let verifier = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = crypto.randomInt(0, charset.length);
      verifier += charset[randomIndex];
    }

    return verifier;
  }

  /**
   * Generate code challenge from code verifier
   * SHA256 hash of verifier, base64url encoded
   */
  static generateCodeChallenge(codeVerifier: string): string {
    const hash = crypto.createHash("sha256").update(codeVerifier).digest();
    // Base64url encoding (no padding)
    return hash
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=/g, "");
  }

  /**
   * Verify code verifier against code challenge
   * Used by server to validate PKCE flow
   */
  static verifyCodeChallenge(
    codeVerifier: string,
    codeChallenge: string,
  ): boolean {
    const computedChallenge = this.generateCodeChallenge(codeVerifier);
    return computedChallenge === codeChallenge;
  }

  /**
   * Generate authorization URL with PKCE
   */
  static buildAuthorizationUrl(options: {
    clientId: string;
    redirectUri: string;
    scope: string;
    state: string;
    codeChallenge: string;
  }): string {
    const params = new URLSearchParams({
      client_id: options.clientId,
      redirect_uri: options.redirectUri,
      response_type: "code",
      scope: options.scope,
      state: options.state,
      code_challenge: options.codeChallenge,
      code_challenge_method: "S256", // SHA256
      access_type: "offline",
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }
}
