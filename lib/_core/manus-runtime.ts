// ============================================================================
// PILOTO FINANCEIRO — Runtime stub (substituiu Manus Runtime)
// Este arquivo é mantido para compatibilidade de imports existentes.
// Não tem dependências externas e não faz comunicação com nenhum serviço.
// ============================================================================

export function initManusRuntime(): void {
  // No-op: Manus Runtime removido. App opera de forma independente.
}

export function subscribeSafeAreaInsets(_callback: (insets: any) => void): () => void {
  // No-op: safe area é gerenciada diretamente pelo react-native-safe-area-context
  return () => {};
}
