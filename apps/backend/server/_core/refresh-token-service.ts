import crypto from "crypto";
import { getDb } from "../db.js";
import { refreshTokens } from "../../drizzle/schema.js";
import { eq, and, isNull, lt } from "drizzle-orm";
import { ONE_YEAR_MS } from "../../shared/const.js";

export interface RefreshTokenPayload {
  userId: number;
  tokenId: number;
  issuedAt: number;
}

/**
 * Serviço de Refresh Token com segurança:
 * - Hash SHA256 do token
 * - Rotação automática
 * - Detecção de reuse
 * - Revogação em cascata
 */
export class RefreshTokenService {
  private readonly REFRESH_TOKEN_EXPIRY_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
  private readonly REFRESH_TOKEN_LENGTH = 32; // 256 bits

  /**
   * Gera um novo refresh token seguro
   */
  generateToken(): string {
    return crypto.randomBytes(this.REFRESH_TOKEN_LENGTH).toString("hex");
  }

  /**
   * Calcula hash SHA256 do token
   */
  hashToken(token: string): string {
    return crypto.createHash("sha256").update(token).digest("hex");
  }

  /**
   * Cria e salva um novo refresh token no banco
   */
  async createRefreshToken(userId: number): Promise<{ token: string; expiresAt: Date }> {
    const token = this.generateToken();
    const tokenHash = this.hashToken(token);
    const expiresAt = new Date(Date.now() + this.REFRESH_TOKEN_EXPIRY_MS);

    console.log(`[RefreshToken] Creating new refresh token for user ${userId}`);

    try {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const result = await db.insert(refreshTokens).values({
        userId,
        tokenHash,
        expiresAt,
      });

      console.log(`[RefreshToken] Token created successfully for user ${userId}`);
      return { token, expiresAt };
    } catch (error) {
      console.error(`[RefreshToken] Error creating token for user ${userId}:`, error);
      return { token: "", expiresAt: new Date() };
    }
  }

  /**
   * Valida um refresh token
   * Retorna o payload se válido, null se inválido
   */
  async validateRefreshToken(token: string): Promise<RefreshTokenPayload | null> {
    const tokenHash = this.hashToken(token);

    console.log(`[RefreshToken] Validating refresh token`);

    try {
      const db = await getDb();
      if (!db) return null;
      const result = await db
        .select()
        .from(refreshTokens)
        .where(
          and(
            eq(refreshTokens.tokenHash, tokenHash),
            isNull(refreshTokens.revokedAt), // Token não foi revogado
          ),
        )
        .limit(1);

      if (result.length === 0) {
        console.warn(`[RefreshToken] Token validation failed - token not found or revoked`);
        return null;
      }

      const dbToken = result[0];
      
      // Verifica se token expirou
      if (dbToken.expiresAt < new Date()) {
        console.warn(`[RefreshToken] Token expired for user ${dbToken.userId}`);
        return null;
      }
      
      console.log(`[RefreshToken] Token validated successfully for user ${dbToken.userId}`);

      return {
        userId: dbToken.userId,
        tokenId: dbToken.id,
        issuedAt: dbToken.createdAt.getTime(),
      };
    } catch (error) {
      console.error(`[RefreshToken] Error validating token:`, error);
      return null;
    }
  }

  /**
   * Rotaciona um refresh token (revoga o antigo e cria um novo)
   * Detecta reuse: se o token já foi usado, revoga toda a sessão
   */
  async rotateRefreshToken(
    oldToken: string,
    userId: number,
  ): Promise<{ newToken: string; expiresAt: Date } | null> {
    const tokenHash = this.hashToken(oldToken);

    console.log(`[RefreshToken] Rotating refresh token for user ${userId}`);

    try {
      const db = await getDb();
      if (!db) return null;
      // Busca o token antigo
      const result = await db
        .select()
        .from(refreshTokens)
        .where(eq(refreshTokens.tokenHash, tokenHash))
        .limit(1);

      if (result.length === 0) {
        console.warn(`[RefreshToken] Token not found for rotation - possible reuse attempt`);
        // Revoga toda a sessão do usuário (possível ataque)
        await this.revokeAllUserTokens(userId, "POSSIBLE_REUSE_DETECTED");
        return null;
      }

      const dbToken = result[0];

      // Verifica se token já foi revogado (reuse)
      if (dbToken.revokedAt !== null) {
        console.error(
          `[RefreshToken] SECURITY ALERT: Token reuse detected for user ${userId}`,
        );
        // Revoga toda a sessão do usuário
        await this.revokeAllUserTokens(userId, "TOKEN_REUSE_DETECTED");
        return null;
      }

      // Verifica se token expirou
      if (dbToken.expiresAt < new Date()) {
        console.warn(`[RefreshToken] Token expired for user ${userId}`);
        return null;
      }

      // Revoga o token antigo
      await db
        .update(refreshTokens)
        .set({ revokedAt: new Date() })
        .where(eq(refreshTokens.id, dbToken.id));

      console.log(`[RefreshToken] Old token revoked for user ${userId}`);

      // Cria um novo token
      const { token: newToken, expiresAt } = await this.createRefreshToken(userId);

      console.log(`[RefreshToken] Token rotated successfully for user ${userId}`);
      return { newToken, expiresAt };
    } catch (error) {
      console.error(`[RefreshToken] Error rotating token for user ${userId}:`, error);
      return null;
    }
  }

  /**
   * Revoga um refresh token específico
   */
  async revokeRefreshToken(token: string): Promise<boolean> {
    const tokenHash = this.hashToken(token);

    console.log(`[RefreshToken] Revoking refresh token`);

    try {
      const db = await getDb();
      if (!db) return false;
      const result = await db
        .update(refreshTokens)
        .set({ revokedAt: new Date() })
        .where(eq(refreshTokens.tokenHash, tokenHash));

      console.log(`[RefreshToken] Token revoked successfully`);
      return true;
    } catch (error) {
      console.error(`[RefreshToken] Error revoking token:`, error);
      return false;
    }
  }

  /**
   * Revoga todos os refresh tokens de um usuário
   * Usado em casos de segurança (logout, reuse detectado, etc)
   */
  async revokeAllUserTokens(userId: number, reason: string): Promise<boolean> {
    console.log(`[RefreshToken] Revoking all tokens for user ${userId} - Reason: ${reason}`);

    try {
      const db = await getDb();
      if (!db) return false;
      await db
        .update(refreshTokens)
        .set({ revokedAt: new Date() })
        .where(and(eq(refreshTokens.userId, userId), isNull(refreshTokens.revokedAt)));

      console.log(`[RefreshToken] All tokens revoked for user ${userId}`);
      return true;
    } catch (error) {
      console.error(`[RefreshToken] Error revoking all tokens for user ${userId}:`, error);
      return false;
    }
  }

  /**
   * Limpa tokens expirados do banco (limpeza periódica)
   */
  async cleanupExpiredTokens(): Promise<number> {
    console.log(`[RefreshToken] Cleaning up expired tokens`);

    try {
      const db = await getDb();
      if (!db) return 0;
      // Deleta tokens que expiraram há mais de 7 dias
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

      const result = await db
        .delete(refreshTokens)
        .where(and(isNull(refreshTokens.revokedAt), lt(refreshTokens.expiresAt, sevenDaysAgo)));

      console.log(`[RefreshToken] Cleanup completed`);
      return 0; // Drizzle não retorna count, então retorna 0
    } catch (error) {
      console.error(`[RefreshToken] Error cleaning up expired tokens:`, error);
      return 0;
    }
  }
}

// Singleton instance
export const refreshTokenService = new RefreshTokenService();
