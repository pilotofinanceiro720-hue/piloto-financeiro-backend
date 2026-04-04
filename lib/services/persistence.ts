/**
 * Persistence - Gerenciamento de persistência de dados
 * Salva e recupera dados de forma confiável
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { logger } from "./logger";

class PersistenceManager {
  private prefix = "@rota-do-lucro:";

  /**
   * Salva dados no AsyncStorage
   */
  async save<T>(key: string, data: T): Promise<boolean> {
    try {
      const fullKey = this.prefix + key;
      const jsonData = JSON.stringify(data);

      await AsyncStorage.setItem(fullKey, jsonData);

      logger.debug(`💾 Dados salvos: ${key}`, { size: jsonData.length });
      return true;
    } catch (error) {
      logger.error(`❌ Erro ao salvar ${key}`, error as Error);
      return false;
    }
  }

  /**
   * Recupera dados do AsyncStorage
   */
  async load<T>(key: string, defaultValue?: T): Promise<T | null> {
    try {
      const fullKey = this.prefix + key;
      const jsonData = await AsyncStorage.getItem(fullKey);

      if (!jsonData) {
        logger.debug(`⚠️ Dados não encontrados: ${key}`);
        return defaultValue || null;
      }

      const data = JSON.parse(jsonData) as T;
      logger.debug(`📂 Dados carregados: ${key}`);
      return data;
    } catch (error) {
      logger.error(`❌ Erro ao carregar ${key}`, error as Error);
      return defaultValue || null;
    }
  }

  /**
   * Remove dados do AsyncStorage
   */
  async remove(key: string): Promise<boolean> {
    try {
      const fullKey = this.prefix + key;
      await AsyncStorage.removeItem(fullKey);

      logger.debug(`🗑️ Dados removidos: ${key}`);
      return true;
    } catch (error) {
      logger.error(`❌ Erro ao remover ${key}`, error as Error);
      return false;
    }
  }

  /**
   * Limpa todos os dados
   */
  async clear(): Promise<boolean> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const keysToRemove = keys.filter((k) => k.startsWith(this.prefix));

      await AsyncStorage.multiRemove(keysToRemove);

      logger.info(`🗑️ Todos os dados removidos (${keysToRemove.length} itens)`);
      return true;
    } catch (error) {
      logger.error("❌ Erro ao limpar dados", error as Error);
      return false;
    }
  }

  /**
   * Retorna tamanho aproximado dos dados
   */
  async getSize(): Promise<number> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const keysToCheck = keys.filter((k) => k.startsWith(this.prefix));

      let totalSize = 0;

      for (const key of keysToCheck) {
        const data = await AsyncStorage.getItem(key);
        if (data) {
          totalSize += data.length;
        }
      }

      logger.debug(`📊 Tamanho total: ${(totalSize / 1024).toFixed(2)} KB`);
      return totalSize;
    } catch (error) {
      logger.error("❌ Erro ao calcular tamanho", error as Error);
      return 0;
    }
  }

  /**
   * Salva múltiplos dados
   */
  async saveMultiple(data: Record<string, any>): Promise<boolean> {
    try {
      const items = Object.entries(data).map(([key, value]) => [
        this.prefix + key,
        JSON.stringify(value),
      ]);

      await AsyncStorage.multiSet(items as any);

      logger.debug(`💾 ${items.length} itens salvos`);
      return true;
    } catch (error) {
      logger.error("❌ Erro ao salvar múltiplos itens", error as Error);
      return false;
    }
  }

  /**
   * Carrega múltiplos dados
   */
  async loadMultiple(keys: string[]): Promise<Record<string, any>> {
    try {
      const fullKeys = keys.map((k) => this.prefix + k);
      const values = await AsyncStorage.multiGet(fullKeys);

      const result: Record<string, any> = {};

      values.forEach(([key, value], index) => {
        if (value) {
          try {
            result[keys[index]] = JSON.parse(value);
          } catch {
            result[keys[index]] = value;
          }
        }
      });

      logger.debug(`📂 ${Object.keys(result).length} itens carregados`);
      return result;
    } catch (error) {
      logger.error("❌ Erro ao carregar múltiplos itens", error as Error);
      return {};
    }
  }

  /**
   * Incrementa contador
   */
  async increment(key: string, amount: number = 1): Promise<number> {
    try {
      const current = (await this.load<number>(key, 0)) || 0;
      const newValue = current + amount;

      await this.save(key, newValue);

      logger.debug(`⬆️ ${key} incrementado para ${newValue}`);
      return newValue;
    } catch (error) {
      logger.error(`❌ Erro ao incrementar ${key}`, error as Error);
      return 0;
    }
  }

  /**
   * Salva com expiração
   */
  async saveWithExpiry<T>(key: string, data: T, expiryMs: number): Promise<boolean> {
    try {
      const expiry = Date.now() + expiryMs;
      const wrapped = { data, expiry };

      return await this.save(key, wrapped);
    } catch (error) {
      logger.error(`❌ Erro ao salvar com expiração ${key}`, error as Error);
      return false;
    }
  }

  /**
   * Carrega com verificação de expiração
   */
  async loadWithExpiry<T>(key: string, defaultValue?: T): Promise<T | null> {
    try {
      const wrapped = await this.load<{ data: T; expiry: number }>(key);

      if (!wrapped) {
        return defaultValue || null;
      }

      if (Date.now() > wrapped.expiry) {
        logger.debug(`⏰ Dados expirados: ${key}`);
        await this.remove(key);
        return defaultValue || null;
      }

      return wrapped.data;
    } catch (error) {
      logger.error(`❌ Erro ao carregar com expiração ${key}`, error as Error);
      return defaultValue || null;
    }
  }
}

// Singleton
export const persistence = new PersistenceManager();

/**
 * Hook para usar persistência
 */
export function usePersistence() {
  return persistence;
}

/**
 * Exemplo de uso:
 *
 * import { persistence } from '@/lib/services/persistence';
 *
 * // Salvar
 * await persistence.save('user', { id: 1, name: 'João' });
 *
 * // Carregar
 * const user = await persistence.load('user');
 *
 * // Salvar com expiração (1 hora)
 * await persistence.saveWithExpiry('token', 'abc123', 3600000);
 *
 * // Carregar com expiração
 * const token = await persistence.loadWithExpiry('token');
 *
 * // Incrementar
 * const count = await persistence.increment('ride-count');
 *
 * // Salvar múltiplos
 * await persistence.saveMultiple({
 *   user: { id: 1 },
 *   settings: { theme: 'dark' },
 *   stats: { rides: 100 }
 * });
 */
