/**
 * Refresh Token Mutex
 * Prevents concurrent refresh calls and queues requests
 * Only ONE refresh can run at a time
 */

interface QueuedRequest {
  resolve: (token: string | null) => void;
  reject: (error: Error) => void;
}

export class RefreshMutex {
  private static isRefreshing = false;
  private static refreshPromise: Promise<string | null> | null = null;
  private static queue: QueuedRequest[] = [];

  /**
   * Acquire lock for refresh operation
   * If already refreshing, waits in queue
   */
  static async acquireLock(): Promise<string | null> {
    // If already refreshing, add to queue
    if (this.isRefreshing && this.refreshPromise) {
      console.log("[RefreshMutex] Refresh in progress, queuing request");
      return new Promise((resolve, reject) => {
        this.queue.push({ resolve, reject });
      });
    }

    // Mark as refreshing
    this.isRefreshing = true;
    console.log("[RefreshMutex] Lock acquired, starting refresh");

    return null; // Caller should proceed with refresh
  }

  /**
   * Release lock and process queue
   */
  static releaseLock(token: string | null, error: Error | null = null): void {
    console.log(
      `[RefreshMutex] Lock released (token: ${token ? "✓" : "✗"}, error: ${error ? error.message : "none"})`,
    );

    this.isRefreshing = false;
    this.refreshPromise = null;

    // Process queued requests
    const queue = this.queue.splice(0); // Copy and clear queue
    console.log(`[RefreshMutex] Processing ${queue.length} queued requests`);

    queue.forEach((req) => {
      if (error) {
        req.reject(error);
      } else {
        req.resolve(token);
      }
    });
  }

  /**
   * Check if refresh is in progress
   */
  static isLocked(): boolean {
    return this.isRefreshing;
  }

  /**
   * Get queue size
   */
  static getQueueSize(): number {
    return this.queue.length;
  }

  /**
   * Reset mutex (for testing or logout)
   */
  static reset(): void {
    console.log("[RefreshMutex] Resetting mutex");
    this.isRefreshing = false;
    this.refreshPromise = null;
    this.queue = [];
  }
}
