import { describe, it, expect } from "vitest";

describe("Google OAuth Configuration", () => {
  it("should have GOOGLE_CLIENT_ID configured", () => {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    expect(clientId).toBeDefined();
    expect(clientId).toMatch(/\.apps\.googleusercontent\.com$/);
  });

  it("should have GOOGLE_CLIENT_SECRET configured", () => {
    const secret = process.env.GOOGLE_CLIENT_SECRET;
    expect(secret).toBeDefined();
    expect(secret?.length).toBeGreaterThan(10);
  });

  it("should have GOOGLE_REDIRECT_URI configured", () => {
    const redirectUri = process.env.GOOGLE_REDIRECT_URI;
    expect(redirectUri).toBeDefined();
    expect(redirectUri).toMatch(/^https?:\/\//);
    expect(redirectUri).toContain("/api/oauth/callback");
  });

  it("should generate valid Google authorization URL", () => {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI;

    if (!clientId || !redirectUri) {
      throw new Error("OAuth configuration missing");
    }

    const scope = encodeURIComponent("openid profile email");
    const state = btoa(redirectUri);
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${encodeURIComponent(clientId)}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `response_type=code&` +
      `scope=${scope}&` +
      `state=${encodeURIComponent(state)}&` +
      `access_type=offline`;

    expect(authUrl).toContain("accounts.google.com");
    expect(authUrl).toContain(clientId);
    expect(authUrl).toContain(encodeURIComponent(redirectUri));
    expect(authUrl).toContain("openid");
    expect(authUrl).toContain("profile");
    expect(authUrl).toContain("email");
  });
});
