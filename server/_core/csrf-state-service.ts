import crypto from "crypto";
import { getDb } from "../db";
import { csrfStates } from "../../drizzle/schema";
import { eq, lt } from "drizzle-orm";

/**
 * CSRF State Service
 * Generates and validates cryptographically secure state tokens for OAuth
 */
export class CsrfStateService {
  /**
   * Generate a new CSRF state token
   * @returns Generated state token (hex string)
   */
  static generateState(): string {
    return crypto.randomBytes(32).toString("hex");
  }

  /**
   * Store state token with expiration
   * @param state - State token to store
   * @param expiresAt - Expiration timestamp
   */
  static async storeState(state: string, expiresAt: Date): Promise<void> {
    try {
      const database = await getDb();
      if (!database) throw new Error("Database not initialized");
      await database.insert(csrfStates).values({
        state,
        expiresAt,
        used: 0,
      });
      console.log("[CSRF] State stored:", state.substring(0, 8) + "...");
    } catch (error) {
      console.error("[CSRF] Failed to store state:", error);
      throw error;
    }
  }

  /**
   * Validate state token
   * @param state - State token to validate
   * @returns true if valid and unused, false otherwise
   */
  static async validateState(state: string): Promise<boolean> {
    try {
      const database = await getDb();
      if (!database) throw new Error("Database not initialized");
      const now = new Date();

      // Find the state
      const result = await database
        .select()
        .from(csrfStates)
        .where(eq(csrfStates.state, state))
        .limit(1);

      if (result.length === 0) {
        console.warn("[CSRF] State not found:", state.substring(0, 8) + "...");
        return false;
      }

      const record = result[0];

      // Check if expired
      if (record.expiresAt < now) {
        console.warn("[CSRF] State expired:", state.substring(0, 8) + "...");
        return false;
      }

      // Check if already used
      if (record.used) {
        console.warn("[CSRF] State already used (ATTACK DETECTED):", state.substring(0, 8) + "...");
        return false;
      }

      // Mark as used
      await database
        .update(csrfStates)
        .set({ used: 1 })
        .where(eq(csrfStates.state, state));

      console.log("[CSRF] State validated and marked as used:", state.substring(0, 8) + "...");
      return true;
    } catch (error) {
      console.error("[CSRF] Failed to validate state:", error);
      return false;
    }
  }

  /**
   * Clean up expired states (run periodically)
   */
  static async cleanupExpiredStates(): Promise<number> {
    try {
      const database = await getDb();
      if (!database) throw new Error("Database not initialized");
      const now = new Date();

      const result = await database
        .delete(csrfStates)
        .where(lt(csrfStates.expiresAt, now));

      console.log("[CSRF] Cleaned up expired states");
      return 0;
    } catch (error) {
      console.error("[CSRF] Failed to cleanup expired states:", error);
      return 0;
    }
  }
}
