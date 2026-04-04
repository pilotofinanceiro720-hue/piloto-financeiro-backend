# Refresh Token Implementation - Rota do Lucro

## Visão Geral

Sistema de refresh token seguro com rotação automática, detecção de reuse e hash SHA256.

## Arquitetura

### 1. Modelo de Banco de Dados

Tabela `refreshTokens`:
```sql
CREATE TABLE refreshTokens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  tokenHash VARCHAR(255) NOT NULL UNIQUE,
  expiresAt TIMESTAMP NOT NULL,
  revokedAt TIMESTAMP,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Campos:**
- `id`: Identificador único
- `userId`: ID do usuário (referência)
- `tokenHash`: Hash SHA256 do token (nunca armazenar token em plaintext)
- `expiresAt`: Data de expiração (30 dias)
- `revokedAt`: Data de revogação (NULL se ativo)
- `createdAt`: Data de criação

### 2. Fluxo de Autenticação

#### Login
```
1. Usuário faz login com Google OAuth
2. Backend gera:
   - accessToken (JWT, 15 minutos)
   - refreshToken (random, 30 dias)
3. Salva hash do refreshToken no banco
4. Envia refreshToken em cookie httpOnly seguro
5. Retorna accessToken para o app
```

#### Refresh Token
```
POST /api/auth/refresh

1. App envia refreshToken (via cookie ou header)
2. Backend valida:
   - Token existe no banco
   - Token não foi revogado
   - Token não expirou
3. Se válido:
   - Revoga token antigo
   - Gera novo refreshToken
   - Gera novo accessToken
   - Retorna novo accessToken
4. Se inválido ou reuse detectado:
   - Revoga TODA a sessão do usuário
   - Retorna 401
```

### 3. Segurança

#### Hash SHA256
- Token é aleatório (32 bytes = 256 bits)
- Hash é armazenado no banco, nunca o token em plaintext
- Impossível recuperar token do hash

#### Rotação Automática
- Cada refresh gera novo token
- Token antigo é imediatamente revogado
- Reduz janela de exposição

#### Detecção de Reuse
- Se alguém tenta usar token já revogado:
  - Indica possível vazamento
  - Revoga TODA a sessão do usuário
  - Força re-login

#### Expiração
- Access Token: 15 minutos
- Refresh Token: 30 dias
- Tokens expirados são limpos periodicamente

### 4. Serviço RefreshTokenService

Localização: `server/_core/refresh-token-service.ts`

**Métodos:**

```typescript
// Gera novo token aleatório
generateToken(): string

// Calcula hash SHA256
hashToken(token: string): string

// Cria novo refresh token no banco
createRefreshToken(userId: number): Promise<{token, expiresAt}>

// Valida um refresh token
validateRefreshToken(token: string): Promise<RefreshTokenPayload | null>

// Rotaciona token (revoga antigo, cria novo)
rotateRefreshToken(oldToken: string, userId: number): Promise<{newToken, expiresAt} | null>

// Revoga token específico
revokeRefreshToken(token: string): Promise<boolean>

// Revoga todos os tokens de um usuário
revokeAllUserTokens(userId: number, reason: string): Promise<boolean>

// Limpa tokens expirados (limpeza periódica)
cleanupExpiredTokens(): Promise<number>
```

### 5. Endpoint POST /api/auth/refresh

**Request:**
```bash
curl -X POST https://api.manus.im/api/auth/refresh \
  -H "Authorization: Bearer <refreshToken>" \
  -H "Content-Type: application/json"
```

Ou com cookie:
```bash
curl -X POST https://api.manus.im/api/auth/refresh \
  -b "session_refresh=<refreshToken>"
```

**Response (200):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 900
}
```

**Response (401):**
```json
{
  "error": "Invalid or expired refresh token"
}
```

### 6. Logs de Auditoria

Todos os eventos são registrados:

```
[RefreshToken] Creating new refresh token for user 123
[RefreshToken] Token created successfully for user 123
[RefreshToken] Validating refresh token
[RefreshToken] Token validated successfully for user 123
[RefreshToken] Rotating refresh token for user 123
[RefreshToken] Old token revoked for user 123
[RefreshToken] Token rotated successfully for user 123
[RefreshToken] SECURITY ALERT: Token reuse detected for user 123
[RefreshToken] Revoking all tokens for user 123 - Reason: TOKEN_REUSE_DETECTED
```

### 7. Testes

Localização: `server/_core/__tests__/refresh-token-service.test.ts`

**Cobertura:**
- ✅ Geração de tokens aleatórios
- ✅ Hash SHA256 consistente
- ✅ Validação de tokens
- ✅ Rotação de tokens
- ✅ Revogação de tokens
- ✅ Detecção de reuse
- ✅ Limpeza de tokens expirados

**Executar testes:**
```bash
npm test -- refresh-token-service
```

### 8. Integração no App

#### Login
```typescript
// app/login.tsx
const { token: refreshToken } = await loginWithGoogle();
// Token é armazenado em cookie httpOnly automaticamente
```

#### Refresh Automático
```typescript
// Interceptor de requisições
if (response.status === 401) {
  const { accessToken } = await fetch('/api/auth/refresh', {
    method: 'POST',
    credentials: 'include' // Envia cookies
  }).then(r => r.json());
  
  // Retenta requisição com novo token
  return fetch(originalRequest, {
    headers: {
      ...originalRequest.headers,
      'Authorization': `Bearer ${accessToken}`
    }
  });
}
```

### 9. Migração de Banco de Dados

```bash
npm run db:push
```

Gera arquivo: `drizzle/0002_old_the_leader.sql`

### 10. Checklist de Segurança

- [x] Token é aleatório (crypto.randomBytes)
- [x] Hash SHA256 armazenado no banco
- [x] Token nunca em plaintext
- [x] Rotação automática em cada refresh
- [x] Detecção de reuse com revogação em cascata
- [x] Expiração configurável
- [x] Limpeza periódica de tokens expirados
- [x] Logs de auditoria completos
- [x] Cookie httpOnly seguro
- [x] Testes unitários

## Próximos Passos

1. **Integrar no App**: Adicionar interceptor de requisições para refresh automático
2. **Middleware**: Criar middleware para validar accessToken em rotas protegidas
3. **Cleanup Periódico**: Agendar limpeza de tokens expirados (cron job)
4. **Monitoramento**: Alertas para detecção de reuse em massa (possível ataque)
5. **Rate Limiting**: Limitar tentativas de refresh para prevenir brute force

## Referências

- [OWASP: Refresh Token Rotation](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html#refresh-token-rotation)
- [RFC 6749: OAuth 2.0 Authorization Framework](https://tools.ietf.org/html/rfc6749)
- [Node.js Crypto: SHA256](https://nodejs.org/api/crypto.html)
