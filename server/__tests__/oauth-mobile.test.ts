import { describe, it, expect, beforeAll, afterAll } from "vitest";
import fetch from "node-fetch";

const API_BASE = "http://localhost:3000";

describe("OAuth Mobile Endpoint", () => {
  it("should return mobile OAuth URL with deep link redirect URI", async () => {
    const response = await fetch(`${API_BASE}/api/auth/google/url/mobile`);
    const data = (await response.json()) as any;

    expect(response.status).toBe(200);
    expect(data.url).toBeDefined();
    expect(data.redirectUri).toBeDefined();
    expect(data.redirectUri).toMatch(/^manus\d+:\/\/oauth\/callback$/);
    expect(data.url).toContain("accounts.google.com");
    expect(data.url).toContain("redirect_uri=manus");
  });

  it("should have correct redirect URI in authorization URL", async () => {
    const response = await fetch(`${API_BASE}/api/auth/google/url/mobile`);
    const data = (await response.json()) as any;

    const url = new URL(data.url);
    const redirectUri = url.searchParams.get("redirect_uri");

    expect(redirectUri).toBe(data.redirectUri);
    expect(redirectUri).toMatch(/^manus\d+:\/\/oauth\/callback$/);
  });

  it("should include required OAuth parameters", async () => {
    const response = await fetch(`${API_BASE}/api/auth/google/url/mobile`);
    const data = (await response.json()) as any;

    const url = new URL(data.url);

    expect(url.searchParams.get("client_id")).toBeDefined();
    expect(url.searchParams.get("response_type")).toBe("code");
    expect(url.searchParams.get("scope")).toContain("openid");
    expect(url.searchParams.get("scope")).toContain("profile");
    expect(url.searchParams.get("scope")).toContain("email");
    expect(url.searchParams.get("state")).toBeDefined();
    expect(url.searchParams.get("access_type")).toBe("offline");
  });

  it("should have GOOGLE_REDIRECT_URI_MOBILE environment variable set", () => {
    const mobileRedirectUri = process.env.GOOGLE_REDIRECT_URI_MOBILE;
    expect(mobileRedirectUri).toBeDefined();
    expect(mobileRedirectUri).toMatch(/^manus\d+:\/\/oauth\/callback$/);
  });
});
