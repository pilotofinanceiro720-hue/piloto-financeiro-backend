# 🔍 DIAGNÓSTICO TÉCNICO - FLUXO OAUTH

**Data:** 2026-02-20  
**Erro:** "Failed to get OAuth URL"  
**Status:** Investigação Completa

---

## 📋 ANÁLISE DETALHADA

### 1️⃣ CLIENT (Expo App)

**Arquivo:** `app/login.tsx` (linha 30)

```typescript
const response = await fetch("https://api.manus.im/api/auth/google/url", {
  method: "GET",
  headers: { "Content-Type": "application/json" },
});
```

**PROBLEMA IDENTIFICADO:**
- ❌ **URL hardcoded em `https://api.manus.im`** (produção)
- ❌ Não usa `getApiBaseUrl()` da `constants/oauth.ts`
- ❌ Em desenvolvimento, deveria usar `3000-sandboxid.region.domain`
- ❌ Sem tratamento de erro detalhado (apenas "Failed to get OAuth URL")

**CAUSA RAIZ:**
- Em dev/preview, `https://api.manus.im` é um domínio externo que pode não ter acesso ao backend local
- O endpoint `/api/auth/google/url` está registrado, mas a URL não está sendo resolvida corretamente

---

### 2️⃣ BACKEND (Node.js)

**Arquivo:** `server/_core/oauth.ts` (linha 67-107)

```typescript
app.get("/api/auth/google/url", (req: Request, res: Response) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;
  
  if (!clientId || !redirectUri) {
    res.status(500).json({
      error: "OAuth configuration missing",
      details: "GOOGLE_CLIENT_ID or GOOGLE_REDIRECT_URI not configured",
    });
    return;
  }
  
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?...`;
  res.json({ url: authUrl });
});
```

**ANÁLISE:**
- ✅ Endpoint está registrado corretamente
- ✅ Retorna JSON (não redirect)
- ⚠️ Depende de `GOOGLE_CLIENT_ID` e `GOOGLE_REDIRECT_URI` estarem configurados
- ⚠️ Sem CORS explícito (pode bloquear requisições do app)

---

### 3️⃣ VARIÁVEIS DE AMBIENTE

**Configuradas:**
- ✅ `GOOGLE_CLIENT_ID` - Presente
- ✅ `GOOGLE_CLIENT_SECRET` - Presente
- ✅ `GOOGLE_REDIRECT_URI` - Presente

**Não Configuradas no App:**
- ❌ `EXPO_PUBLIC_API_BASE_URL` - Vazio em dev
- ❌ Fallback para `getApiBaseUrl()` não está sendo usado

---

### 4️⃣ FLUXO DE REQUISIÇÃO

```
App (login.tsx)
  ↓
fetch("https://api.manus.im/api/auth/google/url")
  ↓
[PROBLEMA] URL hardcoded não resolve em dev
  ↓
Response: 404 ou timeout
  ↓
Error: "Failed to get OAuth URL"
```

---

## 🔧 SOLUÇÃO DEFINITIVA

### PASSO 1: Atualizar `app/login.tsx`

```typescript
// ❌ ANTES (linha 30)
const response = await fetch("https://api.manus.im/api/auth/google/url", {

// ✅ DEPOIS
import { getApiBaseUrl } from "@/constants/oauth";

const apiUrl = getApiBaseUrl() || "https://api.manus.im";
const response = await fetch(`${apiUrl}/api/auth/google/url`, {
```

### PASSO 2: Adicionar CORS no Backend

**Arquivo:** `server/_core/index.ts`

```typescript
import cors from "cors";

app.use(cors({
  origin: ["https://api.manus.im", "http://localhost:8081", /^https:\/\/\d+-.*\.manus\.computer$/],
  credentials: true,
}));
```

### PASSO 3: Configurar `.env` (Dev)

```env
# Backend
GOOGLE_CLIENT_ID=687561160795-m2p2u0291fs5u571v65vqs11c7t1ackv.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-...
GOOGLE_REDIRECT_URI=https://3000-sandboxid.region.manus.computer/api/oauth/callback

# App (opcional, fallback para getApiBaseUrl())
EXPO_PUBLIC_API_BASE_URL=https://3000-sandboxid.region.manus.computer
```

### PASSO 4: Adicionar Logging Detalhado

**Arquivo:** `app/login.tsx`

```typescript
const handleGoogleLogin = async () => {
  try {
    setIsAuthLoading(true);
    const apiUrl = getApiBaseUrl() || "https://api.manus.im";
    console.log("[Login] API URL:", apiUrl);
    console.log("[Login] Calling:", `${apiUrl}/api/auth/google/url`);

    const response = await fetch(`${apiUrl}/api/auth/google/url`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    console.log("[Login] Response status:", response.status);
    console.log("[Login] Response headers:", response.headers);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[Login] Error response:", errorText);
      throw new Error(`Failed to get OAuth URL: ${response.status} ${errorText}`);
    }

    const { url } = await response.json();
    console.log("[Login] OAuth URL received:", url);
    // ... resto do código
  } catch (error) {
    console.error("[Login] Full error:", error);
    Alert.alert("Login Error", error instanceof Error ? error.message : "An error occurred");
  }
};
```

---

## ✅ CHECKLIST DE VALIDAÇÃO

### Backend

- [ ] Endpoint `/api/auth/google/url` retorna 200 com JSON
- [ ] Variáveis `GOOGLE_CLIENT_ID` e `GOOGLE_REDIRECT_URI` configuradas
- [ ] CORS permite origem do app
- [ ] Logs mostram requisição recebida

**Teste:**
```bash
curl -X GET "https://3000-sandboxid.region.manus.computer/api/auth/google/url"
# Esperado: { "url": "https://accounts.google.com/o/oauth2/v2/auth?..." }
```

### App

- [ ] `getApiBaseUrl()` retorna URL correta em dev
- [ ] Requisição usa `${apiUrl}/api/auth/google/url`
- [ ] Logs mostram URL sendo chamada
- [ ] Response 200 com JSON válido

**Teste no Expo Go:**
```javascript
// No console do app
const apiUrl = getApiBaseUrl();
console.log("API URL:", apiUrl);
fetch(`${apiUrl}/api/auth/google/url`).then(r => r.json()).then(console.log);
```

### OAuth Flow

- [ ] Clique em "Entrar com Google"
- [ ] Abre navegador com URL de autorização
- [ ] Google pede permissão
- [ ] Redireciona para callback
- [ ] App recebe token e faz login

---

## 🚨 RISCOS EM PRODUÇÃO

| Risco | Impacto | Mitigação |
|-------|--------|-----------|
| URL hardcoded | App quebra se domínio mudar | Usar `getApiBaseUrl()` |
| CORS bloqueado | Requisição falha silenciosamente | Adicionar CORS explícito |
| Variáveis não configuradas | Endpoint retorna 500 | Validar em startup |
| Timeout de rede | App congela | Adicionar timeout e retry |

---

## 📦 ARQUIVOS A MODIFICAR

1. `app/login.tsx` - Usar `getApiBaseUrl()`
2. `server/_core/index.ts` - Adicionar CORS
3. `.env` - Configurar variáveis corretas
4. `app.config.ts` - Validar `EXPO_PUBLIC_API_BASE_URL`

---

## 🎯 RESULTADO ESPERADO

✅ App chama endpoint correto  
✅ Backend retorna URL de OAuth  
✅ Navegador abre com autorização  
✅ Callback funciona  
✅ Usuário logado com sucesso  

